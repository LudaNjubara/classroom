"use client";

import { MultiFileDropzone, type FileState } from "@/components/Elements/dropzone/MultiFileDropzone";
import { cn } from "@/utils/cn";
import { Dispatch, SetStateAction, memo } from "react";

type TResourcesFormFieldProps = {
  className?: string;
  fileStates: FileState[];
  setFileStates: Dispatch<SetStateAction<FileState[]>>;
};

export const ResourcesFormField = memo(
  ({ className, fileStates, setFileStates }: TResourcesFormFieldProps) => {
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
          }}
        />
      </div>
    );
  }
);

ResourcesFormField.displayName = "ResourcesFormField";
