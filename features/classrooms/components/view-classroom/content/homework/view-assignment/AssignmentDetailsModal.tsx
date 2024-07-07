import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboardContext } from "@/context";
import { TClassroomAssignmentWithTeacher } from "@/features/classrooms/types";
import { formatDateTime } from "@/utils/misc";
import { Edit2Icon, Trash2Icon, XIcon } from "lucide-react";
import { AssignmentSolutionSection } from "./solution-section/AssignmentSolutionSection";
import { AssignmentHistorySection } from "./tracking-history-section/AssignmentHistorySection";

type TAssignmentDetailsModalProps = {
  assignment: TClassroomAssignmentWithTeacher;
  onClose: () => void;
};

export function AssignmentDetailsModal({ assignment, onClose }: TAssignmentDetailsModalProps) {
  // context
  const { profile } = useDashboardContext();

  return (
    <div className="mt-2 px-5 pb-4">
      <div className="flex justify-end">
        <Button
          className="rounded-full bg-slate-500/30 hover:bg-slate-600/30 dark:bg-slate-600/30 hover:dark:bg-slate-500/30"
          onClick={onClose}
          size={"icon"}
        >
          <XIcon size={24} className="text-slate-600 dark:text-slate-600" />
        </Button>
      </div>

      {/* Audit actions */}
      {profile.role === "TEACHER" && (
        <div className="flex gap-3 mt-8 w-fit ml-auto">
          <Button variant="default" className="px-5 text-base">
            <Edit2Icon size={15} className="mr-3" />
            Edit
          </Button>

          <Button variant="destructive" className="px-5 text-base">
            <Trash2Icon size={15} className="mr-3" />
            Remove
          </Button>
        </div>
      )}

      {/* Assignment details */}
      <div className="mt-5 overflow-hidden rounded-xl">
        <div className=" bg-slate-900 px-7 py-5 text-slate-500 dark:text-slate-100">
          <h1 className="text-4xl font-medium">{assignment.title}</h1>

          <Badge variant="secondary" className="mt-4 py-1 px-4 text-base">
            Due <span className="ml-1">{formatDateTime(new Date(assignment.dueDate))}</span>
          </Badge>
        </div>

        <div className="px-7 pt-3 pb-8 bg-slate-900/50">
          <pre className="mt-8 text-lg text-slate-500 leading-4">{assignment.description}</pre>
        </div>
      </div>

      {/* Tracking history */}
      <div className="bg-slate-900 px-7 py-5 mt-10 rounded-xl overflow-hidden">
        <h2 className="text-2xl font-medium mb-6">Tracking history</h2>

        <AssignmentHistorySection assignmentId={assignment.id} />
      </div>

      {/* Solution section */}
      <div className="bg-slate-900 px-7 py-5 mt-10 rounded-xl overflow-hidden">
        <h2 className="text-2xl font-medium mb-6">
          {profile.role === "STUDENT" ? "Upload your solution" : "View submitted solutions"}
        </h2>
        {profile.role === "STUDENT" ? (
          <AssignmentSolutionSection viewFor="student" assignmentId={assignment.id} onClose={onClose} />
        ) : (
          <AssignmentSolutionSection viewFor="teacher" assignmentId={assignment.id} onClose={onClose} />
        )}
      </div>
    </div>
  );
}
