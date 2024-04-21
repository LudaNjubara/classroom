import { useDashboardStore } from "@/stores";
import Image from "next/image";
import { TStudentWithProfile } from "../types";
import StudentCardControls from "./StudentCardControls";

type TStudentCardProps = {
  student: TStudentWithProfile;
  handleSelectStudent: (student: TStudentWithProfile, customInviteMessage?: string) => void;
};

export function StudentCard({ student, handleSelectStudent }: TStudentCardProps) {
  // zustand state and actions
  const selectedStudentItems = useDashboardStore((state) => state.selectedStudentItems);

  // derived state
  const isSelected = selectedStudentItems.some((item) => item.studentId === student.id);

  return (
    <article
      onClick={() => handleSelectStudent(student)}
      className={`relative group flex gap-3 rounded-lg cursor-pointer overflow-hidden  bg-slate-500 dark:bg-slate-900 dark:hover:bg-slate-800/80 transition-colors duration-300 animate-pop-up ${
        isSelected &&
        "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-green-900 dark:to-slate-800/80 to-80%"
      }`}
    >
      {/* Controls */}
      <StudentCardControls
        student={student}
        handleSelectStudent={handleSelectStudent}
        isSelected={isSelected}
      />

      <div className="relative basis-20 flex-shrink-0 rounded-s-lg overflow-hidden">
        <Image
          src={student.profile.picture!}
          style={{ objectFit: "cover", objectPosition: "center" }}
          quality={80}
          sizes="100px"
          alt={student.name}
          fill
        />
      </div>

      <div className="flex-1 pt-4 pb-8 px-2">
        <h3 className="text-lg font-medium">{student.name}</h3>
        <p className="text-slate-600 break-all">{student.email}</p>
      </div>
    </article>
  );
}
