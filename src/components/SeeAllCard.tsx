import React from "react";
import { MdArrowForward } from "react-icons/md";
import Link from "next/link";
export interface CardProps {
  uri: string;
  title: string;
}

const SeeAllCard: React.FC<CardProps> = ({ uri, title }) => {
  return (
    <Link href={uri}>
      <div className="group relative block h-36 w-36 sm:h-56 sm:w-56">
        <span className="absolute inset-0 border-2 border-dashed border-black"></span>

        <div className="relative flex h-full transform items-center border-2 border-black bg-white transition-transform group-hover:translate-x-2 sm:group-hover:translate-x-4">
          <div className="p-4  transition-opacity group-hover:absolute group-hover:opacity-0 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold uppercase sm:text-4xl">
              See All
            </h1>
          </div>

          <div className="absolute p-4 opacity-0 transition-opacity group-hover:relative group-hover:opacity-100 sm:p-6 lg:p-8">
            <MdArrowForward className="h-12 w-12" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SeeAllCard;
