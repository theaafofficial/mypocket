import { type NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { api } from "~/utils/api";
import { useSession, getSession } from "next-auth/react";
import FileSection from "~/components/FileSection";
const Home: NextPage = () => {
  const { data: session } = useSession();
  const document = api.router.getFiles.useQuery({
    Limit: 5,
    type: "Document",
  });
  const id = api.router.getFiles.useQuery({
    Limit: 5,
    type: "ID",
  });

  return (
    <>
      <Head>
        <title>My Pocket</title>
        <meta name="description" content="My Pocket" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen select-none flex-col ">
        <FileSection
          result={document}
          MediaType="Document"
          title="Documents"
          uri="/documents"
          whole_page={false}
        />
        <FileSection
          result={id}
          MediaType="Image"
          title="IDS"
          uri="/ids"
          whole_page={false}
        />
      </main>
    </>
  );
};

export default Home;
