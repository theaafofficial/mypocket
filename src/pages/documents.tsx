import type { NextPage } from "next";
import React from "react";
import { api } from "~/utils/api";
import File from "~/components/FileSection";
const documents: NextPage = () => {
  const document = api.router.getFiles.useQuery({
    type: "Document",
  });

  return (
    <>
      {File(document, "Document", "All documents", "/documents", true)}
    </>
  );
};

export default documents;