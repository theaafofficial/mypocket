import React from "react";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { BiWindowOpen } from "react-icons/bi";
import { truncate } from "~/utils/helper";
import FileDeteteModal from "./FileDelete";
import Link from "next/link";
import { useRouter } from "next/router";

export interface CardProps {
  title: string | undefined;
  url: string | undefined;
  id?: string | undefined;
  extension?: string | undefined;
  public_id?: string | undefined;
  resource_type?: string | undefined;
  refetch?: () => void;
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
  refetch,
  isImage,
  onSelect,
  selected,
}) => {
  const router = useRouter();
  return (
    <div
      className={`group relative block h-36 w-36 sm:h-56 sm:w-56 ${
        isImage ? "cursor-pointer" : ""
      } `}
    >
      <span
        className={`absolute inset-0 border-2 border-dashed ${
          selected ? "border-gray-200" : "border-black"
        }`}
      ></span>
      <div
        className={`relative flex h-full transform items-end border-2 ${
          selected ? "border-gray-200" : "border-black"
        } bg-white transition-all ease-out  group-hover:-translate-y-2`}
        onClick={onSelect}
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
          <h3
            className={`text-md mt-4 mb-2 select-none font-medium sm:text-2xl `}
            title={title}
          >
            {truncate(title as string, 12)}
          </h3>
          <span className="inline-flex divide-x overflow-hidden rounded-md border bg-white shadow-sm">
            <a
              className="inline-block p-2 sm:p-3 text-gray-700 hover:bg-gray-50 focus:relative"
              title="Download"
              download={title}
              href={url}
            >
              <HiOutlineDocumentDownload className="h-4 w-4 sm:h-6 sm:w-6" />
            </a>
            <FileDeteteModal
              id={id as string}
              public_id={public_id as string}
              resource_type={resource_type as string}
              refetch={refetch as () => void}
              filename={title as string}
            />
            <div
              className="inline-block p-2 sm:p-3 text-gray-700 hover:bg-gray-50 focus:relative"
              title="Open"
              onClick={() =>
                router.push(`/view?url=${encodeURIComponent(url as string)}`)
              }
            >
              <BiWindowOpen className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
