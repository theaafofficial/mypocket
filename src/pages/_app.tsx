import { type AppType } from "next/app";
import { RecoilRoot } from "recoil";
import { api } from "~/utils/api";
import { SessionProvider } from "next-auth/react";
import Layout from "~/components/Layout";
import type { NextComponentType } from "next";
import type { Session } from "next-auth";

import "~/styles/globals.css";

export interface AppProps {
  Component: NextComponentType;
  session?: Session;
  pageProps?: any;
}

const MyApp: AppType = ({ Component, session, pageProps }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RecoilRoot>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
