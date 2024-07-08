import { TAssignmentSolutionWithStudent } from "@/features/classrooms/types";
import { formatDateTime } from "@/utils/misc";

type TAssignmentSolutionListItemProps = {
  solution: TAssignmentSolutionWithStudent;
  onClick: (solution: TAssignmentSolutionWithStudent) => void;
};

export default function AssignmentSolutionListItem({ solution, onClick }: TAssignmentSolutionListItemProps) {
  return (
    <li
      className="flex justify-between items-center gap-4 p-4 bg-slate-800 first-of-type:rounded-tl-lg first-of-type:rounded-tr-lg last-of-type:rounded-bl-lg last-of-type:rounded-br-lg hover:brightness-110 cursor-pointer transition-colors"
      onClick={() => onClick(solution)}
    >
      <div className="flex-1 max-w-80">
        <h3 className="text-lg font-semibold">{solution.student.name}</h3>
        <p className=" text-slate-500 truncate">{solution?.note}</p>
      </div>
      <div className="flex gap-4">
        <p className="text-slate-500">{formatDateTime(new Date(solution.createdAt))}</p>
        <p className="text-slate-500">{solution.status}</p>
      </div>
    </li>
  );
}
