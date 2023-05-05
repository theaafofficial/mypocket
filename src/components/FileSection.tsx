import Card from "~/components/Card";
import UploadFileModal from "~/components/UploadFileModal";
import { extractExtension } from "~/utils/helper";
import type { MediaType } from "~/utils/helper";
import SeeAllCard from "~/components/SeeAllCard";
import type { UseTRPCQueryResult } from "@trpc/react-query/shared";
import type { FileOutput } from "~/server/api/routers/files";
import Loader from "~/components/Loader";
import { useEffect } from "react";
import { useDebounce } from "usehooks-ts";
import useState from "react-usestateref";
import { createPDF } from "~/utils/helper";
import { api } from "~/utils/api";
import { RotatingSquare, TailSpin } from "react-loader-spinner";
import { MdDelete } from "react-icons/md";
import { VscFilePdf } from "react-icons/vsc";
export interface FileProps {
  result: UseTRPCQueryResult<FileOutput[], unknown>;
  MediaType: MediaType;
  title: string;
  uri: string;
  whole_page: boolean;
}
const File: React.FC<FileProps> = ({
  result,
  MediaType,
  title,
  uri,
  whole_page,
}) => {
  const deleteFiles = api.router.deleteFiles.useMutation();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(result.data);
  const [selectedCards, setSelectedCards, selectedCardsRef] = useState<
    FileOutput[]
  >([]);
  const debouncedSearchTerm = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setSearchResult(
        result.data?.filter((doc) =>
          doc?.original_filename
            ?.toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
        )
      );
    } else {
      setSearchResult(result.data);
    }
  }, [debouncedSearchTerm, result.data]);

  function handleCardSelect(card: FileOutput) {
    const index = selectedCards.findIndex((c) => c.id === card.id);
    console.log(index);
    if (index === -1) {
      console.log("here");
      console.log([...selectedCards, card]);
      setSelectedCards([...selectedCards, card]);
    } else {
      setSelectedCards([
        ...selectedCards.slice(0, index),
        ...selectedCards.slice(index + 1),
      ]);
    }
  }

  async function handleButtonClick() {
    const urls = selectedCardsRef.current.map(
      (card) => card.limited_url
    ) as string[];
    console.log(urls);
    await createPDF(urls);
  }
  function handleDelete() {
    const deleteFilesData = selectedCardsRef.current.map((card) => ({
      id: card.id,
      public_id: card.public_id as string,
      resource_type: card.resource_type as string,
    }));

    deleteFiles.mutate(deleteFilesData, {
      onSuccess: () => {
        setSelectedCards([]);
        void result.refetch();
      },
    });
  }

  return (
    <>
      <div className="m-4 flex flex-col items-center justify-between rounded-md bg-gray-100 px-4 py-2 sm:flex-row">
        <h2 className="text-lg font-medium">{title}</h2>
        {title !== "Starred" ? (
          <div
            className={`mt-2 flex w-full flex-row items-center justify-around sm:mt-0 sm:w-auto`}
          >
            {whole_page && (
              <div className="relative">
                <label className="sr-only" htmlFor="search">
                  Search{" "}
                </label>

                <input
                  className="h-10 w-full rounded-full border-none bg-white pl-4 pr-10 text-sm shadow-sm sm:w-56"
                  id="search"
                  type="search"
                  placeholder={`Search ${title}`}
                  autoComplete="off"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <button
                  type="button"
                  className="absolute top-1/2 right-1 -translate-y-1/2 rounded-full bg-gray-50 p-2 text-gray-600 transition hover:text-gray-700"
                >
                  <span className="sr-only">Search</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            )}
            <UploadFileModal
              refetch={result.refetch}
              title={`Upload ${title}`}
              mediaType={MediaType}
              documentType={MediaType === "Image" ? "ID" : "Document"}
            />
          </div>
        ) : null}
      </div>
      <div
        className={`flex flex-wrap justify-center gap-2 p-4 sm:items-start ${
          result.isLoading || result.data?.length === 0
            ? "sm:justify-center"
            : "sm:justify-start"
        }`}
      >
        {result.isLoading ? (
          <div className=" place-self-center self-center justify-self-center">
            <Loader />
          </div>
        ) : search.length > 0 && searchResult && searchResult?.length > 0 ? (
          searchResult?.map((doc) => (
            <Card
              key={doc.id}
              title={doc.original_filename}
              url={doc.limited_url}
              extension={
                doc?.format
                  ? doc?.format
                  : extractExtension(doc?.public_id as string)
              }
              id={doc.id}
              public_id={doc?.public_id}
              resource_type={doc?.resource_type}
              isStarred={doc.starred}
              refetch={result.refetch}
              isImage={MediaType === "Image"}
              onSelect={() => handleCardSelect(doc)}
              selected={selectedCards.some((c) => c.id === doc.id)}
            />
          ))
        ) : search.length > 0 && searchResult?.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-lg font-medium">No {search} found</h2>
          </div>
        ) : (
          result.data?.map((doc) => (
            <Card
              key={doc.id}
              title={doc.original_filename}
              url={doc.limited_url}
              extension={
                doc?.format
                  ? doc?.format
                  : extractExtension(doc?.public_id as string)
              }
              id={doc.id}
              public_id={doc?.public_id}
              resource_type={doc?.resource_type}
              isStarred={doc.starred}
              refetch={result.refetch}
              isImage={MediaType === "Image"}
              onSelect={() => handleCardSelect(doc)}
              selected={selectedCards.some((c) => c.id === doc.id)}
            />
          ))
        )}
        {result.data?.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-lg font-medium">No {title}</h2>
          </div>
        )}
        {result.data?.length === 5 && !whole_page && (
          <SeeAllCard uri={uri} title={`See All ${title}`} />
        )}
        {selectedCards.length > 0 && (
          <div className="fixed bottom-4 right-4 z-50 flex flex-row gap-2">
            {MediaType === "Image" && (
              <button
                className="rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 hover:text-white"
                onClick={handleButtonClick}
                disabled={deleteFiles.isLoading}
              >
                <div className="flex flex-row items-center justify-center gap-2">
                  <VscFilePdf className="h-5 w-5" />
                  Generate PDF of {selectedCards.length} images
                </div>
              </button>
            )}
            <button
              className="rounded-md bg-red-700 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 hover:text-white"
              onClick={handleDelete}
              disabled={deleteFiles.isLoading}
            >
              <div className="flex flex-row items-center justify-center gap-2">
                {deleteFiles.isLoading ? (
                  <TailSpin height={20} width={20} radius={2} color="#fff" />
                ) : (
                  <MdDelete className="h-5 w-5" />
                )}
                {deleteFiles.isLoading
                  ? `Deleting ${selectedCards.length} files`
                  : `Delete ${selectedCards.length} files`}
              </div>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default File;
