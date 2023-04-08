import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { RxCross2 } from "react-icons/rx";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children, title }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = show ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden transition-all  ease-linear">
      <div className="relative w-5/6 rounded-lg bg-white shadow-lg sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4">
        <div className="flex flex-row-reverse items-center justify-between bg-gray-100">
          <button
            className="px-2 text-gray-700 hover:text-gray-900"
            onClick={handleCloseClick}
          >
            <RxCross2 className="h-6 w-6" />
          </button>

          {title && (
            <div className=" py-2 px-4 text-lg font-medium">{title}</div>
          )}
        </div>

        <div className="p-4">{children}</div>
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root") as Element
    );
  } else {
    return null;
  }
};

export default Modal;
