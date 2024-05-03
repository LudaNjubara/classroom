import { GridView } from "@/components/Elements";
import { ClassroomCardSkeleton } from "@/components/Loaders";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { CalendarDaysIcon, XIcon } from "lucide-react";
import { useMemo } from "react";
import { useClassrooms } from "../../hooks";
import { generateAccentColorsFromSeed, hexToRGBA } from "../../utils";

type TViewClassroomsCardProps = {
  toggleModal: () => void;
};

export function ViewClassroomsCard({ toggleModal }: TViewClassroomsCardProps) {
  const { data: classrooms, isLoading } = useClassrooms();

  const memoizedAccentColors = useMemo(() => {
    const accentColorsToReturn: {
      [key: string]: {
        dark: string;
        darker: string;
        light: string;
        lighter: string;
      };
    } = {};

    const allClassroomAccentColorsWithClassroomIds = classrooms.map((classroom) => {
      const accentColorSetting = classroom.settings.find((setting) => setting.key === "ACCENT_COLOR");

      if (accentColorSetting) return { value: accentColorSetting.value, classroomId: classroom.id };
    });

    allClassroomAccentColorsWithClassroomIds.forEach((classroomAccentColor) => {
      if (!classroomAccentColor) return;

      const accentColors = generateAccentColorsFromSeed(classroomAccentColor.value);

      accentColorsToReturn[classroomAccentColor.classroomId] = accentColors;
    });

    return accentColorsToReturn;
  }, [classrooms]);

  return (
    <div className="pb-4">
      <div className="flex justify-between mb-4">
        <div>
          <h2 className="text-2xl font-medium">View classrooms</h2>
          <p className="text-slate-600">View all the classrooms you are a part of</p>
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

      {isLoading && (
        <GridView>
          {Array.from({ length: 5 }).map((_, index) => (
            <ClassroomCardSkeleton key={index} />
          ))}
        </GridView>
      )}

      {!isLoading && !classrooms.length && (
        <p className="text-slate-600 dark:text-slate-600">No classrooms found</p>
      )}

      <GridView>
        {classrooms.map((classroom) => (
          <div
            key={classroom.id}
            className="flex flex-col gap-4 dark:bg-slate-900 bg-slate-400 p-5 rounded-lg"
            style={{
              borderWidth: 3,
              borderColor: hexToRGBA(memoizedAccentColors[classroom.id]?.lighter, 0.3),
              borderStyle: "solid",
              background: `linear-gradient(145deg, ${memoizedAccentColors[classroom.id]?.dark}, ${
                memoizedAccentColors[classroom.id]?.darker
              })`,
            }}
          >
            {/* Content */}
            <div className="mb-2">
              <h3
                className="text-xl font-medium mb-2"
                style={{
                  color: memoizedAccentColors[classroom.id]?.lighter,
                }}
              >
                {classroom.name}
              </h3>

              <p className="text-white">{classroom.description}</p>
            </div>

            {/* Meta */}
            <div
              className="flex items-center gap-2 py-1 px-3 rounded-full mt-auto self-end bg-slate-300/70 dark:bg-slate-800/70"
              style={{
                background: hexToRGBA(memoizedAccentColors[classroom.id]?.dark, 0.7),
              }}
            >
              <CalendarDaysIcon
                size={16}
                style={{
                  color: memoizedAccentColors[classroom.id]?.lighter,
                }}
              />
              <p
                className="text-xs"
                style={{
                  color: memoizedAccentColors[classroom.id]?.lighter,
                }}
              >
                Created on {dayjs(classroom.createdAt).format("DD MMM, YYYY")}
              </p>
            </div>
          </div>
        ))}
      </GridView>
    </div>
  );
}
