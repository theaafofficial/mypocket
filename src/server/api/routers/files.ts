import { z } from "zod";
import { createTRPCRouter, protectedProdecure } from "~/server/api/trpc";
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
  updateDoc,
  setDoc,
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

export type secret = {
  id: string;
  secret_name: string;
  secret_value: string;
  created_at: Date;
};

const FILES_DB = "files";

const EXPIRES_AT = Math.floor(Date.now() / 1000) + 60 * 15; // 15 minutes

export const Router = createTRPCRouter({
  uploadFile: protectedProdecure
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
  deleteFile: protectedProdecure
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
  deleteFiles: protectedProdecure
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

  setStarredProperty: protectedProdecure
    .input(
      z.object({
        id: z.string(),
        starred: z.boolean(),
      })
    )
    .mutation(async ({ input: { id, starred } }) => {
      try {
        await updateDoc(doc(db, FILES_DB, id), {
          starred: starred,
        });
        return true;
      } catch (error) {
        throw new Error("Error saving to starred");
      }
    }),

  getFiles: protectedProdecure
    .input(
      z.object({
        Limit: z.number().optional(),
        type: z.enum(["ID", "Document"]).optional(),
        starred: z.boolean().optional(),
      })
    )
    .query(async ({ input: { Limit, type, starred } }) => {
      let q;
      if (starred) {
        q = query(
          collection(db, FILES_DB),
          orderBy("created_at", "desc"),
          where("starred", "==", starred)
        );
      } else {
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

  saveSecret: protectedProdecure
    .input(
      z.object({
        secret_name: z.string(),
        secret_value: z.string(),
      })
    )
    .mutation(async ({ input: { secret_name, secret_value } }) => {
      try {
        await addDoc(collection(db, "secrets"), {
          secret_name,
          secret_value,
          created_at: new Date(),
        });
        return true;
      } catch (error) {
        throw new Error("Error saving secret");
      }
    }),
  getAllSecrets: protectedProdecure
    .input(
      z.object({
        Limit: z.number().optional(),
      })
    )
    .query(async ({ input: { Limit } }) => {
      try {
        let q;
        if (!Limit) {
          q = query(collection(db, "secrets"), orderBy("created_at", "desc"));
        } else {
          q = query(
            collection(db, "secrets"),
            orderBy("created_at", "desc"),
            limit(Limit)
          );
        }
        const querySnapshot = await getDocs(q);
        const secrets: secret[] = [];
        querySnapshot.forEach((doc) => {
          secrets.push({ id: doc.id, ...doc.data() } as secret);
        });
        return secrets;
      } catch (error) {
        throw new Error("Error getting secrets");
      }
    }),

  deleteSecret: protectedProdecure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input: { id } }) => {
      try {
        await deleteDoc(doc(db, "secrets", id));
        return true;
      } catch (error) {
        throw new Error("Error deleting secret");
      }
    }),

  editSecret: protectedProdecure
    .input(
      z.object({
        id: z.string(),

        secret_value: z.string(),
      })
    )
    .mutation(async ({ input: { id, secret_value } }) => {
      try {
        await updateDoc(doc(db, "secrets", id), {
          secret_value: secret_value,
        });
        return true;
      } catch (error) {
        throw new Error("Error saving to starred");
      }
    }),
});
