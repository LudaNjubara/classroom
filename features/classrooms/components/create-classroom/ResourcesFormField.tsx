"use client";

import { MultiFileDropzone, type FileState } from "@/components/Elements/dropzone/MultiFileDropzone";
import { cn } from "@/utils/cn";
import { Dispatch, SetStateAction, memo } from "react";

type TResourcesFormFieldProps = {
  className?: string;
  description: string;
  fileStates: FileState[];
  setFileStates: Dispatch<SetStateAction<FileState[]>>;
};

export const ResourcesFormField = memo(
  ({ className, description, fileStates, setFileStates }: TResourcesFormFieldProps) => {
    return (
      <div className={cn("", className)}>
        <h5 className="text-sm font-medium">Resources</h5>
        <p className="text-sm text-muted-foreground">{description}</p>

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
