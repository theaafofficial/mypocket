// pages/view.tsx

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { getBlobFromUrl } from "~/utils/helper";
interface AppProps {
  documentBlob: Blob;
}

const App: React.FC<AppProps> = ({ documentBlob }) => {
  const docs = [{ uri: URL.createObjectURL(documentBlob) }];

  return (
    <DocViewer
      config={{
        header: {
          disableFileName: true,
        },
      }}
      style={{ height: "100dh" }}
      documents={docs}
      pluginRenderers={DocViewerRenderers}
    />
  );
};

const ViewPage: React.FC = () => {
  const router = useRouter();
  const url = router.query.url;

  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (url) {
      const fetchDocument = async () => {
        try {
          const blob = await getBlobFromUrl(url as string);
          setBlob(blob);
        } catch (err) {
          setError(true);
        }
      };
      void fetchDocument();
    }
  }, [url]);

  return (
    <div>
      {error ? (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <div className="rounded-lg bg-white p-6 text-center shadow-lg">
            <h1 className="mb-4 text-2xl font-bold">Invalid or Missing URL</h1>
            <p className="text-gray-700">
              Please provide a valid URL as a parameter in the format:
              <br />
              <code>/view?url=some_url</code>
            </p>
          </div>
        </div>
      ) : (
        blob && <App documentBlob={blob} />
      )}
    </div>
  );
};

export default ViewPage;
