import { AssignmentSolutionStudentSection } from "./AssignmentSolutionStudentSection";
import { AssignmentSolutionTeacherSection } from "./AssignmentSolutionTeacherSection";

type TassignmentSolutionSectionProps = {
  viewFor: "student" | "teacher";
  assignmentId: string;
  onClose: () => void;
};

export function AssignmentSolutionSection({
  viewFor,
  assignmentId,
  onClose,
}: TassignmentSolutionSectionProps) {
  return viewFor === "student" ? (
    <AssignmentSolutionStudentSection assignmentId={assignmentId} onClose={onClose} />
  ) : (
    <AssignmentSolutionTeacherSection />
  );
}
