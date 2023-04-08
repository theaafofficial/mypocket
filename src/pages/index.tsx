"use-client";
import { type NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { api } from "~/utils/api";
import { useSession, getSession } from "next-auth/react";
import File from "~/components/FileSection";
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
      <main className="flex min-h-screen flex-col  ">
        {File(document, "Document", "Documents", "/documents", false)}
        {File(id, "Image", "IDS", "/ids", false)}
      </main>
    </>
  );
};

export default Home;
