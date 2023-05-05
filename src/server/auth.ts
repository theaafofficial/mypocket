import { type GetServerSidePropsContext } from "next";
import { options } from "~/pages/api/auth/[...nextauth]";
import {
  getServerSession,
} from "next-auth";
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, options);
};
