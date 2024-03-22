import { TTeacherWithProfile } from "@/types/typings";
import Image from "next/image";
import TeacherCardControls from "./TeacherCardControls";

type TTeacherCardProps = {
  teacher: TTeacherWithProfile;
  isSelected: boolean;
  handleSelectTeacher: (teacher: TTeacherWithProfile, customInviteMessage?: string) => void;
};

export function TeacherCard({ teacher, isSelected, handleSelectTeacher }: TTeacherCardProps) {
  return (
    <article
      onClick={() => handleSelectTeacher(teacher)}
      className={`relative group flex gap-3 rounded-lg cursor-pointer overflow-hidden  bg-slate-500 dark:bg-slate-900 dark:hover:bg-slate-800/80 transition-colors duration-300 animate-pop-up ${
        isSelected &&
        "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-green-900 dark:to-slate-800/80 to-80%"
      }`}
    >
      {/* Controls */}
      <TeacherCardControls
        teacher={teacher}
        handleSelectTeacher={handleSelectTeacher}
        isSelected={isSelected}
      />

      <div className="relative basis-20 flex-shrink-0 rounded-s-lg overflow-hidden">
        <Image
          src={teacher.profile.picture!}
          style={{ objectFit: "cover", objectPosition: "center" }}
          quality={80}
          sizes="100px"
          alt={teacher.name}
          fill
        />
      </div>

      <div className="flex-1 pt-4 pb-8 px-2">
        <h3 className="text-lg font-medium">{teacher.name}</h3>
        <p className="text-slate-600 break-all">{teacher.email}</p>
      </div>
    </article>
  );
}
