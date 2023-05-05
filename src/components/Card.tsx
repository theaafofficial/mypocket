import React from "react";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { BiWindowOpen } from "react-icons/bi";
import { truncate } from "~/utils/helper";
import FileDeteteModal from "./FileDelete";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMediaQuery } from "usehooks-ts";
import { api } from "~/utils/api";
import { MdStar } from "react-icons/md";

export interface CardProps {
  title: string | undefined;
  url: string | undefined;
  id?: string | undefined;
  extension?: string | undefined;
  public_id?: string | undefined;
  resource_type?: string | undefined;
  isStarred?: boolean;
  refetch: () => void;
  isImage?: boolean;
  onSelect?: () => void;
  selected?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  url,
  id,
  extension,
  public_id,
  resource_type,
  isStarred,
  refetch,
  isImage,
  onSelect,
  selected,
}) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const router = useRouter();
  const starred = api.router.setStarredProperty.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });
  return (
    <div
      className={`group relative block h-36 w-36 cursor-pointer sm:h-56 sm:w-56`}
    >
      <span
        className={`absolute inset-0 border-2 border-dashed ${
          !selected ? "border-gray-300" : "border-black"
        }`}
      ></span>
      <div
        className={`relative flex h-full transform items-end border-2 ${
          !selected ? "border-gray-300" : "border-black"
        } bg-white transition-all ease-out  group-hover:-translate-y-2`}
      >
        <div className="p-4 !pt-0 transition-opacity group-hover:absolute group-hover:opacity-0 sm:p-6 lg:p-8">
          {isImage ? (
            <div className="h-14 w-full rounded-md object-contain sm:h-24">
              <img
                src={url}
                alt={title}
                className="h-14 w-full rounded-md object-contain sm:h-24"
              />
            </div>
          ) : (
            <h1 className="text-3xl font-bold uppercase sm:text-4xl">
              {extension}
            </h1>
          )}

          <h2
            className="text-md mt-4 truncate font-medium sm:text-2xl"
            title={title}
          >
            {truncate(title as string, 12)}
          </h2>
        </div>

        <div className="absolute p-4 opacity-0 transition-opacity group-hover:relative group-hover:opacity-100 sm:p-6 lg:p-8">
          <div className="mt-4 mb-2 flex items-center justify-between">
            <h3
              className={`select-none text-xl font-medium sm:text-2xl `}
              title={title}
            >
              {truncate(title as string, isMobile ? 6 : 8)}
            </h3>
            <input
              type="checkbox"
              onChange={onSelect}
              checked={selected}
              className="h-5 w-5 rounded border-gray-300 bg-gray-100 text-blue-600 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          <span className="inline-flex divide-x overflow-hidden rounded-md border bg-white shadow-sm">
            <a
              className="inline-block p-1 text-gray-700 hover:bg-gray-50 focus:relative sm:p-2"
              title="Download"
              download={title}
              href={url}
            >
              <HiOutlineDocumentDownload className="h-5 w-5 sm:h-6 sm:w-6" />
            </a>
            <FileDeteteModal
              id={id as string}
              public_id={public_id as string}
              resource_type={resource_type as string}
              refetch={refetch as () => void}
              filename={title as string}
            />
            <div
              className="inline-block p-1 text-gray-700 hover:bg-gray-50 focus:relative sm:p-2"
              title="Open"
              onClick={() =>
                router.push(`/view?url=${encodeURIComponent(url as string)}`)
              }
            >
              <BiWindowOpen className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div
              className="inline-block p-1 text-gray-700 hover:bg-gray-50 focus:relative sm:p-2"
              title={isStarred ? "Starred" : "Star"}
              onClick={() =>
                starred.mutate({
                  id: id as string,
                  starred: !isStarred,
                })
              }
            >
              <MdStar
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill={isStarred ? "gold" : ""}
              />
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
