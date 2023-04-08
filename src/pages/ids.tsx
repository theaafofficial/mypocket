import type { NextPage } from "next";
import React from "react";
import { api } from "~/utils/api";
import File from "~/components/FileSection";
const documents: NextPage = () => {
  const id = api.router.getFiles.useQuery({
    type: "ID",
  });

  return <>{File(id, "Image", "IDS", "/ids", true)}</>;
};

export default documents;
