import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDashboardStore } from "@/stores";
import { cn } from "@/utils/cn";
import { ArrowLeftIcon, EllipsisVerticalIcon } from "lucide-react";
import { hexToRGBA } from "../../../utils";

type TClassroomHeaderProps = {
  className?: string;
  toggleModal: () => void;
};

export function ClassroomHeader({ className, toggleModal }: TClassroomHeaderProps) {
  // zustand state and actions
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);
  const accentColors = useDashboardStore((state) => state.accentColors);

  if (!selectedClassroom) return null;

  // derived state
  const shouldShowAccentColors = accentColors[selectedClassroom.id];

  return (
    <header className={cn("flex gap-5 items-center", className)}>
      <div>
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
              <DropdownMenuCheckboxItem>Settings</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
