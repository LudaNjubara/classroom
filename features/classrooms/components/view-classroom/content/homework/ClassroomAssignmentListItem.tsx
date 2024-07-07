import { TClassroomAssignmentWithTeacher } from "@/features/classrooms/types";
import { formatDateTime } from "@/utils/misc";

type TClassroomAssignmentListItemProps = {
  assignment: TClassroomAssignmentWithTeacher;
  onClick: (assignment: TClassroomAssignmentWithTeacher) => void;
};

export function ClassroomAssignmentListItem({ assignment, onClick }: TClassroomAssignmentListItemProps) {
  return (
    <li
      className="flex justify-between items-center gap-4 p-4 bg-slate-800 first-of-type:rounded-tl-lg first-of-type:rounded-tr-lg last-of-type:rounded-bl-lg last-of-type:rounded-br-lg hover:brightness-110 cursor-pointer transition-colors"
      onClick={() => onClick(assignment)}
    >
      <div className="flex-1 max-w-80">
        <h3 className="text-lg font-semibold">{assignment.title}</h3>
        <p className=" text-slate-500 truncate">{assignment.description}</p>
      </div>
      <div className="flex gap-4">
        <p className="text-slate-500">{formatDateTime(new Date(assignment.dueDate))}</p>
        <p className="text-slate-500">{assignment.teacher.name}</p>
      </div>
    </li>
  );
}
