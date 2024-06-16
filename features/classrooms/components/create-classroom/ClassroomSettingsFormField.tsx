import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { Dispatch, SetStateAction, memo } from "react";
import { CLASSROOM_ACCENT_COLORS } from "../../constants";
import { TClassroomSettings } from "../../types";

export const AccentColorSetting = ({
  classroomSettings,
  setClassroomSettings,
}: TClassroomSettingsFormFieldProps) => {
  return (
    <div className="mt-4 ml-5">
      <h6 className="text-lg font-light text-slate-400 dark:text-slate-300">Accent Color</h6>
      <p className="text-sm text-muted-foreground">Choose an accent color for your classroom</p>
      <div className="flex items-center gap-4 mt-3">
        {CLASSROOM_ACCENT_COLORS.map((color) => (
          <Button
            key={color.value}
            className={"rounded-full w-8 h-8"}
            size={"icon"}
            style={{
              backgroundColor: color.value,
              outlineColor:
                classroomSettings?.ACCENT_COLOR?.value === color.value ? `${color.value}` : "transparent",
              outlineStyle: "solid",
              outlineOffset: "4px",
              outlineWidth: "4px",
            }}
            onClick={() =>
              setClassroomSettings((prev) => ({
                ...prev,
                ACCENT_COLOR: {
                  value: color.value,
                  metadata: {
                    type: "STRING",
                  },
                },
              }))
            }
          />
        ))}

        {/* Reset accent color button */}
        <Button
          className={"text-xs"}
          variant={"ghost"}
          onClick={() =>
            setClassroomSettings((prev) => {
              const { ACCENT_COLOR, ...rest } = prev || {};
              return rest;
            })
          }
        >
          <span className="text-slate-300">Reset to default</span>
        </Button>
      </div>
    </div>
  );
};

type TClassroomSettingsFormFieldProps = {
  className?: string;
  classroomSettings?: TClassroomSettings;
  setClassroomSettings: Dispatch<SetStateAction<TClassroomSettings | undefined>>;
};

export const ClassroomSettingsFormField = memo(
  ({ className, classroomSettings, setClassroomSettings }: TClassroomSettingsFormFieldProps) => {
    return (
      <div className={cn("", className)}>
        <h5 className="text-sm font-medium">Settings</h5>
        <p className="text-sm text-muted-foreground">
          Configure the initial settings for your classroom here
        </p>

        <AccentColorSetting
          classroomSettings={classroomSettings}
          setClassroomSettings={setClassroomSettings}
        />
      </div>
    );
  }
);

ClassroomSettingsFormField.displayName = "ClassroomSettingsFormField";
