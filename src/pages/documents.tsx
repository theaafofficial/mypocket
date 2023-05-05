import type { NextPage } from "next";
import React from "react";
import { api } from "~/utils/api";
import FileSection from "~/components/FileSection";
const documents: NextPage = () => {
  const document = api.router.getFiles.useQuery({
    type: "Document",
  });

  return (
    <>
      <FileSection result={document} MediaType="Document" title="Documents" uri="/documents" whole_page={false} />
    </>
  );
};

export default documents;
