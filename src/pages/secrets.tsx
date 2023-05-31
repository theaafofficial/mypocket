import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { MdDeleteForever, MdEdit, MdSaveAs, MdSettings } from "react-icons/md";
import { BiClipboard } from "react-icons/bi";
import { truncate, convertToAllCapsUnderscore } from "~/utils/helper";
import { useMediaQuery } from "usehooks-ts";
import Loader from "~/components/Loader";
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";
import { HiEye, HiEyeOff } from "react-icons/hi";
type EditSecret = {
  id: string;
  secret_value: string;
  visible?: boolean;
};
export default function Secrets() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [copyToClipboard, setCopyToClipboard] = useState("Copy to clipboard");
  const [editSecret, setEditSecret] = useState([] as EditSecret[]);
  const [newSecret, setNewSecret] = useState({
    secret_name: "",
    secret_value: "",
  });
  const secrets = api.router.getAllSecrets.useQuery(
    {},
    {
      onSuccess(data) {
        setEditSecret(
          data.map((e) => ({
            id: e.id,
            secret_value: e.secret_value,
            visible: false,
          }))
        );
      },
    }
  );
  const edit_secret = api.router.editSecret.useMutation({
    onSuccess: async () => {
      await secrets.refetch();
    },
  });
  const delete_secret = api.router.deleteSecret.useMutation({
    onSuccess: async () => {
      await secrets.refetch();
    },
  });
  const save_secret = api.router.saveSecret.useMutation({
    onSuccess: async () => {
      await secrets.refetch();
    },
  });

  const copyToClipboardFunc = async (secret_value: string) => {
    try {
      await navigator.clipboard.writeText(secret_value);
      setCopyToClipboard("Copied to clipboard!");
      setTimeout(() => {
        setCopyToClipboard("Copy to clipboard");
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="flex min-h-screen flex-col  bg-gray-50 py-2">
        <h1 className="m-4 text-4xl font-bold">Secrets</h1>

        <div className="m-4 flex flex-col items-center justify-center gap-4">
          {secrets?.data?.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <h1 className="text-2xl font-semibold">No secrets found</h1>
              <h1 className="text-xl font-semibold">Add a new secret</h1>
            </div>
          ) : secrets?.isLoading ? (
            <Loader />
          ) : null}
          {secrets?.data?.map((secret) => {
            return (
              <label className="input-group" key={secret.id}>
                <span className="w-1/4 truncate pr-5 text-left text-xs font-semibold sm:text-lg">
                  {truncate(secret.secret_name, isMobile ? 13 : 35)}
                </span>
                <input
                  type="text"
                  placeholder={
                    editSecret?.find((e) => e.id === secret.id)?.visible
                      ? secret.secret_value
                      : "**********"
                  }
                  disabled={
                    !editSecret?.find((e) => e.id === secret.id)?.visible
                  }
                  className="input-bordered input w-3/4 focus:border-0"
                  onChange={(e) => {
                    setEditSecret((prev) => {
                      const newArray = prev.map((item) => {
                        if (item?.id === secret.id) {
                          return {
                            ...item,
                            secret_value: e?.target?.value,
                          };
                        }
                        return item;
                      });
                      return newArray;
                    });
                  }}
                />
                <button className="dropdown-hover dropdown dropdown-top dropdown-end no-animation btn-square btn pl-2">
                  <MdSettings size={26} />
                  <div
                    tabIndex={0}
                    className="dropdown-content menu rounded-box flex flex-row gap-1 bg-gray-500 p-2 shadow"
                  >
                    <div
                      data-tip={copyToClipboard}
                      className="tooltip-sm tooltip tooltip-left"
                    >
                      <button
                        className="btn-square btn-sm btn "
                        onClick={async () => {
                          await copyToClipboardFunc(secret.secret_value);
                        }}
                      >
                        <BiClipboard size={16} />
                      </button>
                    </div>
                    <div
                      className="tooltip-sm tooltip tooltip-left"
                      data-tip={
                        editSecret?.find((e) => e.id === secret.id)?.visible
                          ? "Hide"
                          : "Show"
                      }
                    >
                      <button
                        className="btn-square btn-sm btn"
                        onClick={() => {
                          setEditSecret((prev) => {
                            const newArray = prev.map((item) => {
                              if (item?.id === secret.id) {
                                return {
                                  ...item,
                                  visible: !item?.visible,
                                };
                              }
                              return item;
                            });
                            return newArray;
                          });
                        }}
                      >
                        {!editSecret?.find((e) => e.id === secret.id)
                          ?.visible ? (
                          <HiEye size={16} />
                        ) : (
                          <HiEyeOff size={16} />
                        )}
                      </button>
                    </div>
                    {editSecret?.find((e) => e.id === secret.id)?.visible && (
                      <div
                        data-tip="Edit"
                        className="tooltip-sm tooltip tooltip-left"
                      >
                        <button
                          className={
                            edit_secret.isLoading
                              ? "loading btn-square btn-sm btn "
                              : "btn-square btn-sm btn "
                          }
                          onClick={async () => {
                            console.log(editSecret);
                            await edit_secret.mutateAsync({
                              id: secret.id,
                              secret_value:
                                editSecret.find((e) => e.id === secret.id)
                                  ?.secret_value || secret.secret_value,
                            });
                          }}
                        >
                          {!edit_secret.isLoading ? <MdEdit size={16} /> : null}
                        </button>
                      </div>
                    )}
                    <div
                      data-tip="Delete"
                      className="tooltip-sm tooltip tooltip-left tooltip-error"
                    >
                      <button
                        className={
                          delete_secret.isLoading
                            ? "loading btn-square btn-sm btn bg-red-500 "
                            : "btn-square btn-sm btn bg-red-500 "
                        }
                        onClick={async () => {
                          await delete_secret.mutateAsync({
                            id: secret.id,
                          });
                        }}
                      >
                        {!delete_secret.isLoading ? (
                          <MdDeleteForever size={16} />
                        ) : null}
                      </button>
                    </div>
                  </div>
                </button>
              </label>
            );
          })}
        </div>
        <h2 className="m-4 text-2xl font-bold">Add Secret</h2>
        <div className="m-4 flex flex-col items-center justify-center gap-4">
          <label className="input-group ">
            <input
              type="text"
              placeholder={"Secret Name"}
              className="input-bordered input mr-1 w-3/4 focus:border-0"
              value={newSecret.secret_name}
              onChange={(e) => {
                setNewSecret({ ...newSecret, secret_name: e.target.value });
              }}
            />
            <input
              type="text"
              placeholder={"Secret Value"}
              className="input-bordered input w-3/4 focus:border-0"
              value={newSecret.secret_value}
              onChange={(e) => {
                setNewSecret({ ...newSecret, secret_value: e.target.value });
              }}
            />
            <button
              className={
                !save_secret.isLoading
                  ? `btn-success btn-square btn`
                  : `loading btn-success btn-square btn`
              }
              onClick={async () => {
                await save_secret.mutateAsync({
                  secret_name: convertToAllCapsUnderscore(
                    newSecret.secret_name
                  ),
                  secret_value: newSecret.secret_value,
                });
                setNewSecret({
                  secret_name: "",
                  secret_value: "",
                });
              }}
            >
              {!save_secret.isLoading ? <MdSaveAs size={26} /> : null}
            </button>
          </label>
        </div>
      </div>
    </>
  );
}
