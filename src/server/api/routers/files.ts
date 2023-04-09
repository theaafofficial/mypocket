import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/utils/firebase";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import type { CloudinaryData } from "~/utils/helper";
import { v2 } from "cloudinary";
import { extractExtension } from "~/utils/helper";
import type { MediaType } from "~/utils/helper";
export type File = DocumentData & {
  metadata?: CloudinaryData;
  created_at?: Date;
  limited_url?: string;
  type?: MediaType;
  starred?: boolean;
  id: string;
};

export type FileOutput = {
  limited_url?: string;
  id: string;
  public_id?: string;
  format?: string;
  original_filename?: string;
  resource_type?: string;
  created_at?: Date;
  type?: MediaType;
  starred?: boolean;
};

const FILES_DB = "files";

const EXPIRES_AT = Math.floor(Date.now() / 1000) + 180;

export const Router = createTRPCRouter({
  uploadFile: publicProcedure
    .input(
      z.object({ metadata: z.unknown(), type: z.enum(["ID", "Document"]) })
    )
    .mutation(async ({ input: { metadata, type } }) => {
      const docRef = await addDoc(collection(db, FILES_DB), {
        metadata,
        created_at: new Date(),
        type,
        starred: false,
      });
      return docRef;
    }),
  deleteFile: publicProcedure
    .input(
      z.object({
        id: z.string(),
        public_id: z.string(),
        resource_type: z.string(),
      })
    )
    .mutation(async ({ input: { id, public_id, resource_type } }) => {
      try {
        await deleteDoc(doc(db, FILES_DB, id));
        await v2.uploader.destroy(
          public_id,
          {
            resource_type: resource_type,
            invalidate: true,
            type: "private",
          },
          (error, result) => {
            console.log(error, result);
          }
        );
        return true;
      } catch (error) {
        throw new Error("Error deleting document");
      }
    }),
  deleteFiles: publicProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          public_id: z.string(),
          resource_type: z.string(),
        })
      )
    )
    .mutation(async ({ input }) => {
      try {
        console.log(input);
        for (const { id, public_id, resource_type } of input) {
          await deleteDoc(doc(db, FILES_DB, id));
          await v2.uploader.destroy(
            public_id,
            {
              resource_type: resource_type,
              invalidate: true,
              type: "private",
            },
            (error, result) => {
              console.log(error, result);
            }
          );
        }
        return true;
      } catch (error) {
        throw new Error("Error deleting document");
      }
    }),

  getFiles: publicProcedure
    .input(
      z.object({
        Limit: z.number().optional(),
        type: z.enum(["ID", "Document"]),
      })
    )
    .query(async ({ input: { Limit, type } }) => {
      let q;
      if (!Limit) {
        q = query(
          collection(db, FILES_DB),
          orderBy("created_at", "desc"),
          where("type", "==", type)
        );
      } else {
        q = query(
          collection(db, FILES_DB),
          orderBy("created_at", "desc"),
          limit(Limit),
          where("type", "==", type)
        );
      }
      const querySnapshot = await getDocs(q);
      let documents: File[] = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      documents = documents.map((doc) => {
        return {
          limited_url: v2.utils.private_download_url(
            doc.metadata?.public_id as string,
            doc.metadata?.format
              ? doc.metadata?.format
              : extractExtension(doc.metadata?.public_id as string),
            {
              expires_at: EXPIRES_AT,
              resource_type: doc.metadata?.resource_type as string,
            }
          ),
          id: doc.id,
          public_id: doc.metadata?.public_id,
          format: doc.metadata?.format,
          original_filename: doc.metadata?.original_filename,
          resource_type: doc.metadata?.resource_type,
          created_at: doc.created_at,
          type: doc.type,
          starred: doc?.starred,
        };
      });
      return documents as FileOutput[];
    }),
});
