import type { NextPage } from "next";
import React from "react";
import { api } from "~/utils/api";
import FileSection from "~/components/FileSection";
const documents: NextPage = () => {
  const id = api.router.getFiles.useQuery({
    type: "ID",
  });

  return (
    <>
      <FileSection
        result={id}
        MediaType="Image"
        title="IDS"
        uri="/ids"
        whole_page={false}
      />
    </>
  );
};

export default documents;
