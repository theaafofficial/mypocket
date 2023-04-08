import type { NextPage } from "next";
import React from "react";
import { api } from "~/utils/api";
import PDFGenerate from "~/components/PDFGenerate";
const documents: NextPage = () => {
  const id = api.router.getFiles.useQuery({
    type: "ID",
  });

  return <>{PDFGenerate(id, "Image", "IDS", "/ids", true)}</>;
};

export default documents;
