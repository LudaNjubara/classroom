import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { TResourceWithMetadata } from "@/features/classrooms/types";
import { cn } from "@/utils/cn";
import { formatFileSize } from "@/utils/misc";
import { Button } from "@components/ui/button";
import { getDownloadUrl } from "@edgestore/react/utils";
import dayjs from "dayjs";
import { DownloadIcon, FileIcon } from "lucide-react";
import Link from "next/link";

const DEFAULT_OPEN_DELAY = 1500;

type TResourceItemProps = {
  data: TResourceWithMetadata;
  className?: string;
  statisticsHandler?: () => void;
};

export function ResourceItem({ data, className, statisticsHandler }: TResourceItemProps) {
  return (
    <HoverCard openDelay={DEFAULT_OPEN_DELAY}>
      <HoverCardTrigger>
        <div
          className={cn(
            "py-2 px-4 flex items-center gap-5 rounded-lg dark:bg-slate-800 bg-slate-500",
            className
          )}
        >
          <FileIcon size={24} />
          <div className="flex w-full items-center justify-between gap-5">
            <div>
              <div className="font-bold">{data.name}</div>
              <div className="text-sm text-slate-500">{formatFileSize(data.size)}</div>
            </div>

            <Button
              size={"icon"}
              className="p-1 dark:bg-slate-600 bg-slate-900 hover:brightness-110 transition-colors duration-300"
              onClick={() => {
                statisticsHandler?.();
                window.location.href = getDownloadUrl(data.url, data.name);
              }}
            >
              <DownloadIcon size={16} className="dark:text-slate-200 text-slate-950" />
            </Button>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-full max-w-lg">
        <div className="p-2">
          <h3 className="font-bold mb-2">{data.name}</h3>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-slate-500">Size: {formatFileSize(data.size)}</p>
            <p className="text-sm text-slate-500">Uploaded by: {data.metadata.userRole}</p>
            <p className="text-sm text-slate-500">
              Created on: {dayjs(data.createdAt).format("MMMM D, YYYY h:mm A")}
            </p>

            <Link
              onClick={() => {
                statisticsHandler?.();
              }}
              href={getDownloadUrl(data.url, data.name)}
              className="flex items-center gap-3 mt-5 font-semibold dark:bg-slate-200 bg-slate-900 rounded-md dark:text-slate-950 text-slate-200 py-2 px-4 "
            >
              <DownloadIcon size={16} className="text-slate-200 dark:text-slate-950" />
              <span>Download</span>
            </Link>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
