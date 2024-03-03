import { TTeacherWithProfile } from "@/types/typings";
import Image from "next/image";

type TTeacherCardProps = {
  teacher: TTeacherWithProfile;
};

export default function TeacherCard({ teacher }: TTeacherCardProps) {
  return (
    <article className="flex gap-3 rounded-lg bg-slate-400 dark:bg-slate-900 overflow-hidden animate-pop-up">
      <div className="relative basis-20 flex-shrink-0">
        <Image
          src={teacher.profile.picture!}
          objectFit="cover"
          quality={80}
          sizes="100px"
          alt={teacher.name}
          fill
        />
      </div>

      <div className="flex-1 py-4 px-2">
        <h3 className="text-lg font-medium">{teacher.name}</h3>
        <p className="text-slate-600">{teacher.email}</p>
      </div>
    </article>
  );
}
