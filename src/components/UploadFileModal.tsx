import React from "react";
import Modal from "./Modal";
import { MdUploadFile } from "react-icons/md";
import { useFileUpload } from "use-file-upload";
import type { FileUpload } from "use-file-upload";
import { uploadToCloudinary } from "~/utils/helper";
import { Blocks, RotatingSquare } from "react-loader-spinner";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import type { MediaType } from "~/utils/helper";
import { getFileTypes } from "~/utils/helper";
import Loader from "./Loader";
import ClickAwayListener from "react-click-away-listener";
export interface Props {
  refetch: () => void;
  title: string;
  mediaType: MediaType;
  documentType: "Document" | "ID";
}

const UploadFileModal: React.FC<Props> = ({
  refetch,
  title,
  mediaType,
  documentType,
}) => {
  const [file, selectFile] = useFileUpload();
  const [show, setShow] = React.useState(false);
  const uploadDocument = api.router.uploadFile.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const [loading, setLoading] = React.useState(false);

  const handleOpen = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };
  const handleClickAway = () => {
    if (loading) return;
    setShow(false);
  };

  return (
    <>
      <button
        className="ml-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
        onClick={handleOpen}
      >
        <MdUploadFile className="h-6 w-6" />
      </button>
      <Modal show={show} onClose={handleClose} title={title}>
        <ClickAwayListener onClickAway={handleClickAway}>
          <div className="flex flex-col items-center justify-center">
            {loading ? (
              <Loader />
            ) : (
              <button
                className="group relative inline-block overflow-hidden border border-gray-600 px-8 py-3 focus:outline-none focus:ring"
                onClick={() => {
                  selectFile(
                    { accept: getFileTypes(mediaType), multiple: false },
                    async (fileObject) => {
                      const { file } = fileObject as FileUpload;
                      setLoading(true);
                      const res = await uploadToCloudinary(file);
                      uploadDocument.mutate({
                        metadata: res,
                        type: documentType,
                      });
                      setLoading(false);
                      setShow(false);
                      toast.success("Document Uploaded Successfully");
                    }
                  );
                }}
              >
                <span className="absolute inset-y-0 left-0 w-[2px] bg-gray-600 transition-all group-hover:w-full group-active:bg-gray-500"></span>

                <span className="relative text-sm font-medium text-gray-600 transition-colors group-hover:text-white">
                  Select File
                </span>
              </button>
            )}
          </div>
        </ClickAwayListener>
      </Modal>
    </>
  );
};

export default UploadFileModal;
