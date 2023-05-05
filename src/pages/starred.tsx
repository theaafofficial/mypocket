import type { NextPage } from "next";
import React from "react";
import { api } from "~/utils/api";
import FileSection from "~/components/FileSection";
const documents: NextPage = () => {
  const document = api.router.getFiles.useQuery({
    starred: true,
  });

  return (
    <>
      <FileSection
        result={document}
        MediaType="Document"
        title="Starred"
        uri="/starred"
        whole_page={true}
      />
    </>
  );
};

export default documents;
