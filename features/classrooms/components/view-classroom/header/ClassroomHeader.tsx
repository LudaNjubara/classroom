import { CustomModal } from "@/components/Elements";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDashboardContext } from "@/context";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useDashboardStore } from "@/stores";
import { cn } from "@/utils/cn";
import { lazyImport } from "@/utils/lazy-import";
import { ArrowLeftIcon, EllipsisVerticalIcon } from "lucide-react";
import { createPortal } from "react-dom";
import { hexToRGBA } from "../../../utils";

const { ClassroomSettings } = lazyImport(() => import("./settings/"), "ClassroomSettings");

type TClassroomHeaderProps = {
  className?: string;
  toggleModal: () => void;
};

export function ClassroomHeader({ className, toggleModal }: TClassroomHeaderProps) {
  // context
  const { profile } = useDashboardContext();

  // zustand state and actions
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);
  const accentColors = useDashboardStore((state) => state.accentColors);

  //hooks
  const { isOpen: isSettingsModalOpen, toggle: toggleSettingsModal } = useDisclosure();

  if (!selectedClassroom) return null;

  // derived state
  const shouldShowAccentColors = accentColors[selectedClassroom.id];

  return (
    <>
      <header className={cn("flex gap-5 items-center", className)}>
        <div>
          {/* Back button */}
          <Button size={"icon"} variant={"ghost"} className="w-10 h-10 rounded-full" onClick={toggleModal}>
            <ArrowLeftIcon
              size={24}
              className="brightness-75 hover:brightness-100 focus:brightness-100 transition-colors duration-150"
              style={
                shouldShowAccentColors && {
                  color: accentColors[selectedClassroom.id].base,
                }
              }
            />
          </Button>
        </div>

        <div className="flex flex-1 justify-between gap-5">
          {/* Info */}
          <div>
            <h2
              className="inline-block text-2xl mb-1 font-bold rounded-full px-4 py-1"
              style={
                shouldShowAccentColors && {
                  color: accentColors[selectedClassroom.id].base,
                  background: hexToRGBA(accentColors[selectedClassroom.id].base, 0.25),
                }
              }
            >
              {selectedClassroom?.name}
            </h2>

            <div
              className="flex items-center gap-2 rounded-full px-4 py-[2px]"
              style={
                shouldShowAccentColors && {
                  background: hexToRGBA(accentColors[selectedClassroom.id].base, 0.25),
                }
              }
            >
              <p
                className="brightness-75 "
                style={
                  shouldShowAccentColors && {
                    color: accentColors[selectedClassroom.id].base,
                  }
                }
              >
                {selectedClassroom?.description}
              </p>
            </div>
          </div>

          {/* Three dot */}
          {profile.role !== "STUDENT" && (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size={"icon"}
                    className="rounded-full"
                    style={
                      shouldShowAccentColors && {
                        color: accentColors[selectedClassroom.id].base,
                      }
                    }
                  >
                    <EllipsisVerticalIcon size={20} className="opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem onClick={toggleSettingsModal}>Settings</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </header>

      {/* Settings modal */}
      {isSettingsModalOpen &&
        createPortal(
          <CustomModal>
            <ClassroomSettings toggleModal={toggleSettingsModal} />
          </CustomModal>,
          document.getElementById("view-classroom-container")!
        )}
    </>
  );
}
