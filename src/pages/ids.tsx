import type { NextPage } from "next";
import React from "react";
import { api } from "~/utils/api";
import File from "~/components/FileSection";
const documents: NextPage = () => {
  const id = api.router.getFiles.useQuery({
    type: "ID",
  });

  return (
    <>
      <File
        result={id}
        MediaType="Image"
        title="IDS"
        uri="/images"
        whole_page={false}
      />
    </>
  );
};

export default documents;
