import { TAccentColor, TMessageWithSender } from "@/features/classrooms/types";
import { isToday } from "@/utils/misc";
import { getDownloadUrl } from "@edgestore/react/utils";
import dayjs from "dayjs";
import Linkify from "linkify-react";
import { DownloadIcon, FileIcon } from "lucide-react";
import { Button } from "../ui/button";

type TMessageProps = {
  data: TMessageWithSender;
  accentColor?: TAccentColor;
  isCurrentUser: boolean;
};

export function Message({ data, isCurrentUser, accentColor }: TMessageProps) {
  return (
    <div
      className={`inline-flex w-fit max-w-[65%] m gap-2 py-2 px-4 rounded-lg bg-slate-500 dark:bg-slate-950 ${
        isCurrentUser ? "ml-auto bg-white" : ""
      }`}
      style={
        isCurrentUser && accentColor
          ? {
              background: `linear-gradient(145deg, ${accentColor.base}, ${accentColor.dark})`,
            }
          : undefined
      }
    >
      <div>
        {/* Date and time */}
        <p
          className={`text-xs font-medium ${
            isCurrentUser ? "text-black text-right" : "text-white opacity-60"
          }`}
        >
          {isToday(new Date(data.timestamp))
            ? dayjs(data.timestamp).format("HH:mm A")
            : dayjs(data.timestamp).format("MM/DD/YYYY HH:mm A")}
        </p>

        {/* Sender name and message */}
        {!isCurrentUser && (
          <p className={`text-sm mb-1 font-bold ${isCurrentUser ? "text-black" : "text-white"}`}>
            {data.senderData.name}
          </p>
        )}
        <p className={`text-sm font-medium ${isCurrentUser ? "text-black" : "text-white"}`}>
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
