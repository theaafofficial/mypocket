import React from "react";
import Modal from "./Modal";
import { MdUploadFile } from "react-icons/md";
import { useFileUpload } from "use-file-upload";
import type { FileUpload } from "use-file-upload";
import { uploadToCloudinary } from "~/utils/helper";
import { Blocks } from "react-loader-spinner";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { MdOutlineDelete } from "react-icons/md";
import Loader from "./Loader";
import { truncate } from "~/utils/helper";
export interface Props {
  id: string;
  public_id: string;
  resource_type: string;
  filename: string;
  refetch: () => void;
}

const FileDeteteModal: React.FC<Props> = ({
  id,
  public_id,
  resource_type,
  filename,
  refetch,
}) => {
  const [show, setShow] = React.useState(false);
  const deleteDocument = api.router.deleteFile.useMutation();
  const [loading, setLoading] = React.useState(false);

  const handleOpen = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <button
        className="inline-block p-1 text-gray-700 hover:bg-gray-50 focus:relative sm:p-2"
        onClick={handleOpen}
        title="Delete"
      >
        <MdOutlineDelete className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
      <Modal
        show={show}
        onClose={handleClose}
        title={loading ? `Deleting ${truncate(filename, 20)}` : `Are you sure?`}
      >
        <div className="flex flex-row items-center justify-center gap-2">
          {loading ? (
            <Loader />
          ) : (
            <>
              <button
                className="group relative inline-block overflow-hidden border border-gray-600 px-8 py-3 focus:outline-none focus:ring"
                onClick={async () => {
                  setLoading(true);
                  try {
                    await deleteDocument.mutateAsync({
                      id,
                      public_id,
                      resource_type,
                    });
                    toast.success("Document deleted successfully");
                    setLoading(false);
                    refetch();
                    handleClose();
                  } catch (error) {
                    console.log(error);
                    toast.error("Something went wrong");
                    setLoading(false);
                  }
                }}
              >
                <span className="group-active:bg-white-500 absolute inset-y-0 left-0 w-[2px] bg-red-600 transition-all group-hover:w-full"></span>

                <span className="text-white-600 relative text-sm font-medium transition-colors group-hover:text-white">
                  Delete
                </span>
              </button>

              <button
                className="group relative inline-block overflow-hidden border border-gray-600 px-8 py-3 focus:outline-none focus:ring"
                onClick={handleClose}
              >
                <span className="absolute inset-y-0 right-0 w-[2px] bg-gray-600 transition-all group-hover:w-full group-active:bg-gray-500"></span>
                <span className="relative text-sm font-medium text-gray-600 transition-colors group-hover:text-white">
                  Cancel
                </span>
              </button>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default FileDeteteModal;
