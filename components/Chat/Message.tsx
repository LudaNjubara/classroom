import { TAccentColor, TMessageWithSender } from "@/features/classrooms/types";
import { isToday } from "@/utils/misc";
import dayjs from "dayjs";
import Linkify from "linkify-react";

type TMessageProps = {
  data: TMessageWithSender;
  accentColor?: TAccentColor;
  isCurrentUser: boolean;
};

export function Message({ data, isCurrentUser, accentColor }: TMessageProps) {
  return (
    <div
      className={`inline-flex w-fit max-w-[65%] m gap-2 py-2 px-4 rounded-lg bg-slate-950 ${
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
      </div>
    </div>
  );
}
