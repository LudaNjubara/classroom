import { Spinner } from "@/components/Loaders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDisclosure } from "@/hooks/useDisclosure";
import { TAttachmentLabel } from "@/types/typings";
import { FileState, MultiFileDropzone } from "@components/Elements/dropzone/MultiFileDropzone";
import { GridView } from "@components/Elements/grid/GridView";
import { FilePlus2Icon, PlusIcon, SendIcon, XIcon } from "lucide-react";
import { FormEvent, RefObject, useRef, useState } from "react";

type TMessageInputProps = {
  handleSubmit: (e: FormEvent<HTMLFormElement>, inputRef: RefObject<HTMLInputElement>) => void;
  fileStates: FileState[];
  setFileStates: (fileStates: FileState[]) => void;
  isDisabled: boolean;
};

export function MessageInput({ handleSubmit, isDisabled, fileStates, setFileStates }: TMessageInputProps) {
  // refs
  const inputRef = useRef<HTMLInputElement>(null);

  // state
  const [selectedAttachmentOption, setSelectedAttachmentOption] = useState<TAttachmentLabel>();

  // hooks
  const { isOpen: isFilesOpen, open: openFiles, toggle: toggleFiles } = useDisclosure();

  // constants
  const attachmentItems: {
    icon: React.ReactNode;
    label: TAttachmentLabel;
    onClick: () => void;
  }[] = [
    {
      icon: <FilePlus2Icon className="shrink-0" size={20} />,
      label: "File",
      onClick: () => {
        setSelectedAttachmentOption("File");
        toggleFiles();
      },
    },
    {
      icon: <FilePlus2Icon className="shrink-0" size={20} />,
      label: "Image",
      onClick: () => {
        setSelectedAttachmentOption("Image");
        toggleFiles();
      },
    },
    {
      icon: <FilePlus2Icon className="shrink-0" size={20} />,
      label: "Video",
      onClick: () => {
        setSelectedAttachmentOption("Video");
        toggleFiles();
      },
    },
    {
      icon: <FilePlus2Icon className="shrink-0" size={20} />,
      label: "Audio",
      onClick: () => {
        setSelectedAttachmentOption("Audio");
        toggleFiles();
      },
    },
    {
      icon: <FilePlus2Icon className="shrink-0" size={20} />,
      label: "Location",
      onClick: () => {
        setSelectedAttachmentOption("Location");
        toggleFiles();
      },
    },
    {
      icon: <FilePlus2Icon className="shrink-0" size={20} />,
      label: "Contact",
      onClick: () => {
        setSelectedAttachmentOption("Contact");
        toggleFiles();
      },
    },
  ];

  // derived state
  const accept = (() => {
    switch (selectedAttachmentOption) {
      case "File":
        return ["*"];
      case "Image":
        return [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "image/svg+xml",
          "image/tiff",
          "image/bmp",
          "image/x-icon",
        ];
      case "Video":
        return ["video/*"];
      case "Audio":
        return ["audio/*"];
      default:
        return [];
    }
  })();

  return (
    <div className="absolute bottom-0 left-0 right-0 flex gap-2 bg-slate-400 dark:bg-slate-900 py-2">
      {/* File upload */}
      {isFilesOpen && (
        <div className="absolute bottom-full left-0 w-full px-5 pt-2 pb-3 bg-inherit rounded-tl-xl rounded-tr-xl border border-b-0 border-slate-800  shadow-sm animate-pop-up duration-300">
          <header className="flex items-center gap-5 justify-between">
            <h3 className="text-base font-medium mb-2">Files</h3>

            <Button
              variant={"secondary"}
              size={"icon"}
              className="w-8 h-8 rounded-full"
              onClick={() => {
                setFileStates([]);
                toggleFiles();
                setSelectedAttachmentOption(undefined);
              }}
            >
              <XIcon size={20} className="text-slate-600 dark:text-slate-600" />
            </Button>
          </header>

          <div className="flex justify-center">
            <MultiFileDropzone
              value={fileStates}
              onChange={setFileStates}
              onFilesAdded={async (addedFiles) => {
                setFileStates([...fileStates, ...addedFiles]);
              }}
              dropzoneOptions={{
                maxFiles: 1,
                accept: {
                  files: [...accept],
                },
              }}
            />
          </div>
        </div>
      )}

      <Popover
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            openFiles();
          }
        }}
      >
        <PopoverTrigger disabled={isDisabled || isFilesOpen} asChild>
          <Button variant={"outline"} className="w-10 h-10 rounded-full disabled:cursor-not-allowed">
            <PlusIcon size={16} className="flex-shrink-0 opacity-70" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2">
          <GridView className="grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2">
            {attachmentItems.map(({ icon, label, onClick }, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <Button
                  variant={"secondary"}
                  size={"icon"}
                  className=" rounded-full w-12 h-12"
                  onClick={onClick}
                >
                  {icon}
                </Button>
                <span className="text-xs tracking-wide">{label}</span>
              </div>
            ))}
          </GridView>
        </PopoverContent>
      </Popover>

      <form className="flex flex-1 gap-2" onSubmit={(e) => handleSubmit(e, inputRef)}>
        <Input ref={inputRef} placeholder="Type a message..." name="message" disabled={isDisabled} />
        <Button variant={"secondary"} disabled={isDisabled}>
          {isDisabled ? <Spinner /> : <SendIcon size={16} />}
        </Button>
      </form>
    </div>
  );
}
