import { TClassroomAssignmentWithTeacher } from "@/features/classrooms/types";
import { CreateAssignmentSolutionForm } from "./create-solution/CreateAssignmentSolutionForm";
import { ViewAssignmentSolutions } from "./view-solutions/ViewAssignmentSolutions";

// Props common to both student and teacher
type TCommonProps = {
  viewFor: "student" | "teacher";
  assignmentId: string;
  onClose: () => void;
};

// Props specific to teacher
type TConditionalProps =
  | { viewFor: "teacher"; classroomAssignment: TClassroomAssignmentWithTeacher }
  | { viewFor: "student"; classroomAssignment: TClassroomAssignmentWithTeacher };

type TAssignmentSolutionSectionProps = TCommonProps & TConditionalProps;

export function AssignmentSolutionSection(props: TAssignmentSolutionSectionProps) {
  // derived props
  const { viewFor, assignmentId, onClose } = props;

  return viewFor === "student" ? (
    <CreateAssignmentSolutionForm
      assignmentId={assignmentId}
      classroomAssignment={props.classroomAssignment}
      onClose={onClose}
    />
  ) : (
    <ViewAssignmentSolutions assignmentId={assignmentId} classroomAssignment={props.classroomAssignment} />
  );
}
