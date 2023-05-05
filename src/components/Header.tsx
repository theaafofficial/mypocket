import React from "react";
import { signOut } from "next-auth/react";
import MyPocket from "../../public/pocket-color.png";
import Image from "next/image";
import { HiLogout, HiMenu } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import Link from "next/link";
import ClickAwayListener from "react-click-away-listener";
function Navbar() {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              onClick={() => {
                if (!isExpanded) setIsExpanded(true);
              }}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isExpanded ? (
                <RxCross2 className="block h-6 w-6" />
              ) : (
                <HiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-between">
            <div className="flex ">
              <div className="flex space-x-2 p-2">
                <Image
                  src={MyPocket}
                  alt="My Pocket"
                  width={32}
                  color={"white"}
                />
                <h5 className="text-xl font-semibold text-white">My Pocket</h5>
              </div>

              <div className=" mx-5 hidden items-center sm:flex">
                <Link
                  href="/"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Home
                </Link>
                <Link
                  href="/documents"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Documents
                </Link>
                <Link
                  href="/ids"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  IDS
                </Link>
                <Link
                  href="/starred"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Starred
                </Link>
              </div>
            </div>
            <div className="hidden sm:flex">
              <button
                onClick={() => signOut()}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <ClickAwayListener onClickAway={() => setIsExpanded(false)}>
          <div className="sm:hidden" id="mobile-menu">
            <div className="flex flex-col px-2 pt-2 pb-3">
              <Link
                href="/"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() => setIsExpanded(false)}
              >
                Home
              </Link>
              <Link
                href="/documents"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() => setIsExpanded(false)}
              >
                Documents
              </Link>
              <Link
                href="/ids"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() => setIsExpanded(false)}
              >
                IDS
              </Link>
              <Link
                href="/starred"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() => setIsExpanded(false)}
              >
                Starred
              </Link>
              <button
                onClick={() => signOut()}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <HiLogout className="mr-2 inline-block" />
                Sign Out
              </button>
            </div>
          </div>
        </ClickAwayListener>
      )}
    </nav>
  );
}

export default Navbar;
