import { Spinner } from "@/components/Loaders";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { updateClassroom } from "@/features/classrooms/api";
import { TClassroomSettings, TClassroomSettingsWithId } from "@/features/classrooms/types";
import { generateAccentColorsFromSeed } from "@/features/classrooms/utils";
import { useDashboardStore } from "@/stores";
import { useMemo, useState } from "react";
import { AccentColorSetting } from "../../../create-classroom/ClassroomSettingsFormField";

export function CustomizationSettingsItem() {
  // zustand state and actions
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);
  const setSelectedClassroom = useDashboardStore((state) => state.setSelectedClassroom);
  const accentColors = useDashboardStore((state) => state.accentColors);
  const setAccentColors = useDashboardStore((state) => state.setAccentColors);

  // hooks
  const { toast } = useToast();

  // derived state
  const transformedSettings = useMemo(() => {
    const settings = selectedClassroom?.settings || [];
    const transformedSettings = settings.reduce((acc, setting) => {
      acc[setting.key] = {
        value: setting.value,
        metadata: {
          type: setting.type,
        },
      };
      return acc;
    }, {} as Required<TClassroomSettings>);

    return transformedSettings;
  }, [selectedClassroom?.settings]);

  // state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classroomSettings, setClassroomSettings] = useState<TClassroomSettings | undefined>(
    transformedSettings
  );

  // handlers
  const handleSubmit = async () => {
    if (!selectedClassroom || !classroomSettings) return;
    setIsSubmitting(true);

    // add id to every setting in the classroom settings
    Object.entries(classroomSettings).map(([key, value]) => {
      const setting = selectedClassroom.settings.find((setting) => setting.key === key);

      // @ts-ignore-next-line
      classroomSettings[key] = {
        value: value.value,
        metadata: {
          type: value.metadata.type,
        },
        id: setting?.id,
      };
    });

    try {
      await updateClassroom({
        classroomSettings: {
          settings: classroomSettings as TClassroomSettingsWithId,
          classroomId: selectedClassroom!.id,
        },
      });

      setAccentColors({
        ...accentColors,
        [selectedClassroom.id]: generateAccentColorsFromSeed(classroomSettings.ACCENT_COLOR!.value),
      });

      toast({
        title: "Settings saved",
        description: "The classroom settings have been saved successfully.",
        variant: "default",
      });
    } catch (err) {
      console.error(err);

      toast({
        title: "Failed to save settings",
        description: "An error occurred while saving the classroom settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <AccentColorSetting
        classroomSettings={{ ACCENT_COLOR: classroomSettings?.ACCENT_COLOR }}
        setClassroomSettings={setClassroomSettings}
      />

      <div className="mt-8 flex justify-end gap-2">
        <Button type="submit" className="min-w-40" disabled={isSubmitting} onClick={handleSubmit}>
          {isSubmitting ? <Spinner /> : "Save Customization settings"}
        </Button>
      </div>
    </div>
  );
}
