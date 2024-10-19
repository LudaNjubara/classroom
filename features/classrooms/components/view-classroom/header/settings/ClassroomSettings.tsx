import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TClassroomSettingsItem } from "@/features/classrooms/types";
import { useDashboardStore, useMiscStore } from "@/stores";
import { FileCogIcon, PaletteIcon, UserCogIcon, WrenchIcon, XIcon } from "lucide-react";
import { CustomizationSettingsItem } from "./CustomizationSettingsItem";
import { GeneralSettingsItem } from "./GeneralSettingsItem";
import { MembersSettingsItem } from "./MembersSettingsItem";
import { ResourcesSettingsItem } from "./ResourcesSettingsItem";

const CLASSROOM_SETTINGS_ITEMS: TClassroomSettingsItem[] = [
  {
    id: "general",
    title: "General",
    description: "View and manage general settings",
    icon: <WrenchIcon />,
  },
  {
    id: "members",
    title: "Members",
    description: "View and manage members",
    icon: <UserCogIcon size={20} />,
  },
  {
    id: "resources",
    title: "Files",
    description: "View and manage resources",
    icon: <FileCogIcon size={20} />,
  },
  {
    id: "customization",
    title: "Customization",
    description: "Customize the look and feel",
    icon: <PaletteIcon size={20} />,
  },
];

type TClassroomSettingsProps = {
  toggleModal: () => void;
};

export function ClassroomSettings({ toggleModal }: TClassroomSettingsProps) {
  // zustand state and actions
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);
  const accentColors = useDashboardStore((state) => state.accentColors);
  const numOfModalsOpen = useMiscStore((state) => state.numOfModalsOpen);

  return (
    <div id="classroom-settings-container" className={`${numOfModalsOpen > 3 && "h-0 overflow-hidden"}`}>
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-medium">
            <span style={{ color: accentColors[selectedClassroom!.id]?.base }}>
              {selectedClassroom?.name}
            </span>
            &apos;s settings
          </h2>
          <p className="text-slate-600">View and manage settings related to the current classroom.</p>
        </div>

        <div>
          <Button
            className="rounded-full bg-slate-500/30 hover:bg-slate-600/30 dark:bg-slate-600/30 hover:dark:bg-slate-500/30"
            onClick={toggleModal}
            size={"icon"}
          >
            <XIcon size={24} className="text-slate-600 dark:text-slate-600" />
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      <div>
        <Tabs defaultValue="general">
          <TabsList className="w-full justify-between gap-2">
            {CLASSROOM_SETTINGS_ITEMS.map((item) => (
              <TabsTrigger
                key={item.id}
                className="flex-1 hover:bg-slate-300/80 dark:hover:bg-slate-900/80"
                value={item.id}
              >
                {item.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-8 px-1">
            <TabsContent value="general">
              <GeneralSettingsItem />
            </TabsContent>

            <TabsContent value="members">
              <MembersSettingsItem />
            </TabsContent>

            <TabsContent value="resources">
              <ResourcesSettingsItem />
            </TabsContent>

            <TabsContent value="customization">
              <CustomizationSettingsItem />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
