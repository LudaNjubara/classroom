import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { TAccentColor, TMessageWithSender } from "@/features/classrooms/types";
import { isToday, sanitizeInput } from "@/utils/misc";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { getDownloadUrl } from "@edgestore/react/utils";
import dayjs from "dayjs";
import Linkify from "linkify-react";
import { DownloadIcon, EditIcon, FileIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Spinner } from "../Loaders";
import { deleteMessage } from "./api/delete-message";
import { updateMessage } from "./api/update-message";

type TMessageProps = {
  data: TMessageWithSender;
  accentColor?: TAccentColor;
  isCurrentUser: boolean;
  channelId: string;
};

export function Message({ data, isCurrentUser, accentColor, channelId }: TMessageProps) {
  // state
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [messageContent, setMessageContent] = useState(data.content);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // derived state
  const canEditMessage = isCurrentUser;
  const canDeleteMessage = isCurrentUser;

  // hooks
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // handlers
  const handleEdit = async (messageId: string, content: string) => {
    try {
      setIsPending(true);

      await updateMessage(messageId, content, channelId);

      setIsEditing(false);
    } catch (error) {
      console.error("ERROR UPDATING MESSAGE", error);
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      setIsPending(true);

      await deleteMessage(messageId);

      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("ERROR DELETING MESSAGE", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div
      className={`group relative inline-flex w-fit max-w-[65%] m gap-2 py-2 px-4 rounded-lg bg-slate-500 dark:bg-slate-950 ${
        isCurrentUser ? "ml-auto dark:bg-slate-400" : ""
      }`}
      style={
        isCurrentUser && accentColor
          ? {
              background: `linear-gradient(145deg, ${accentColor.base}, ${accentColor.dark})`,
            }
          : undefined
      }
    >
      {/* Edit and delete actions */}
      {(canEditMessage || canDeleteMessage) && !data.deleted && (
        <div className="hidden group-hover:inline-block absolute group right-0 top-0 -translate-y-1/2 rounded-md backdrop-blur-md overflow-hidden">
          {/* Edit button */}
          {canEditMessage && (
            <button
              className="p-2 hover:bg-white/25 transition-colors duration-300"
              onClick={() => {
                setIsEditing(!isEditing);
              }}
            >
              <EditIcon size={14} className="dark:text-slate-200 text-slate-950" />
            </button>
          )}

          {/* Delete button with modal or drawer based on screen size */}
          {canDeleteMessage &&
            (isDesktop ? (
              <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <AlertDialogTrigger asChild>
                  <button className="p-2 hover:bg-red-500/25 transition-colors duration-300">
                    <TrashIcon size={14} className="dark:text-slate-200 text-slate-950" />
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent className="sm:max-w-[425px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete message</AlertDialogTitle>

                    <AlertDialogDescription>
                      Are you sure you want to permanently delete this message?
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        handleDelete(data.id);
                      }}
                    >
                      {isPending ? <Spinner /> : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Drawer open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DrawerTrigger asChild>
                  <button className="p-2 hover:bg-red-500/25 transition-colors duration-300">
                    <TrashIcon size={14} className="dark:text-slate-200 text-slate-950" />
                  </button>
                </DrawerTrigger>

                <DrawerContent>
                  <DrawerHeader className="text-left">
                    <DrawerTitle>Delete message</DrawerTitle>

                    <DrawerDescription>
                      Are you sure you want to permanently delete this message?
                    </DrawerDescription>
                  </DrawerHeader>

                  <DrawerFooter className="pt-2">
                    <Button
                      variant="default"
                      onClick={() => {
                        handleDelete(data.id);
                      }}
                    >
                      {isPending ? <Spinner /> : "Delete"}
                    </Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            ))}
        </div>
      )}

      <div>
        {/* Date and time */}
        {!data.deleted && (
          <p
            className={`text-xs font-medium ${
              isCurrentUser ? "text-black text-right" : "text-white opacity-60"
            }`}
          >
            {isToday(new Date(data.timestamp))
              ? dayjs(data.timestamp).format("HH:mm A")
              : dayjs(data.timestamp).format("MMMM D, HH:mm A")}
          </p>
        )}

        {/* Sender name and message */}
        {!isCurrentUser && !data.deleted && (
          <p className={`text-sm mb-1 font-bold ${isCurrentUser ? "text-black" : "text-white"}`}>
            {data.senderData.name}
          </p>
        )}

        {isEditing ? (
          <div>
            <Input
              type="text"
              className={`w-full py-1 px-3 bg-transparent border-2 border-white/30 rounded-md`}
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            />

            <div className="flex gap-2 justify-evenly mt-2">
              <Button
                className="flex-1 border-none shadow-xl hover:shadow-md transition-shadow duration-200"
                variant={"outline"}
                size={"sm"}
                onClick={() => {
                  setIsEditing(false);
                  setMessageContent(data.content);
                }}
                style={
                  accentColor && {
                    /* Use accent colors */
                    background: `linear-gradient(145deg, ${accentColor.base}, ${accentColor.dark})`,
                  }
                }
              >
                Cancel
              </Button>

              {/* 
                
                */}
              <Button
                className="flex-1 border-none shadow-xl hover:shadow-md transition-shadow duration-200"
                disabled={!messageContent || sanitizeInput(messageContent) === data.content}
                variant={"outline"}
                size={"sm"}
                onClick={() => {
                  handleEdit(data.id, messageContent);
                }}
                style={
                  accentColor && {
                    /* Use accent colors */
                    background: `linear-gradient(145deg, ${accentColor.base}, ${accentColor.dark})`,
                  }
                }
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p
            className={`text-sm font-medium ${isCurrentUser ? "text-black" : "text-white"} ${
              data.deleted && "italic opacity-70"
            }`}
          >
            <Linkify
              options={{
                attributes: {
                  target: "_blank",
                  rel: "noopener noreferrer",
                },
                className: `${isCurrentUser ? "text-black" : "text-white"} font-extrabold hover:underline`,
              }}
            >
              {data.content}
            </Linkify>
          </p>
        )}

        {data.fileUrl && (
          <div
            className="mt-3 py-1 px-4 flex items-center gap-3 rounded-lg dark:bg-slate-800 bg-slate-500 shadow-lg"
            style={
              isCurrentUser && accentColor
                ? {
                    background: `linear-gradient(145deg, ${accentColor.dark}, ${accentColor.darker})`,
                  }
                : undefined
            }
          >
            <FileIcon size={24} />
            <div className="flex w-full items-center justify-between gap-5">
              <span className="font-bold text-sm tracking-wide">File</span>

              <Button
                size={"icon"}
                className="p-1 dark:bg-slate-600 bg-slate-900 hover:brightness-110 transition-colors duration-300"
                onClick={() => {
                  if (data.fileUrl) {
                    window.location.href = getDownloadUrl(data.fileUrl);
                  }
                }}
                style={
                  isCurrentUser && accentColor
                    ? {
                        background: `linear-gradient(145deg, ${accentColor.dark}, ${accentColor.darker})`,
                      }
                    : undefined
                }
              >
                <DownloadIcon size={16} className="dark:text-slate-200 text-slate-950" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
