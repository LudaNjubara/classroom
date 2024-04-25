"use client";

import { MultiFileDropzone, type FileState } from "@/components/Elements/dropzone/MultiFIleDropzone";
import { useEdgeStore } from "@/config/edgestore";
import { cn } from "@/utils/cn";
import { memo, useState } from "react";

type TResourcesFormFieldProps = {
  className?: string;
};

export const ResourcesFormField = memo(({ className }: TResourcesFormFieldProps) => {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const { edgestore } = useEdgeStore();

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find((fileState) => fileState.key === key);
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  return (
    <div className={cn("", className)}>
      <h5 className="text-sm font-medium">Resources</h5>
      <p className="text-sm text-muted-foreground">
        Here you can upload resources for the classroom. Files that could help everyone involved getting
        started with the classroom.
      </p>

      <MultiFileDropzone
        className="mx-auto mt-6"
        value={fileStates}
        onChange={(files) => {
          setFileStates(files);
        }}
        onFilesAdded={async (addedFiles) => {
          setFileStates([...fileStates, ...addedFiles]);
          await Promise.all(
            addedFiles.map(async (addedFileState) => {
              try {
                const res = await edgestore.publicFiles.upload({
                  file: addedFileState.file,
                  onProgressChange: async (progress) => {
                    updateFileProgress(addedFileState.key, progress);
                    if (progress === 100) {
                      // wait 1 second to set it to complete
                      // so that the user can see the progress bar at 100%
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      updateFileProgress(addedFileState.key, "COMPLETE");
                    }
                  },
                });
                console.log(res);
              } catch (err) {
                updateFileProgress(addedFileState.key, "ERROR");
              }
            })
          );
        }}
      />
    </div>
  );
});

ResourcesFormField.displayName = "ResourcesFormField";
