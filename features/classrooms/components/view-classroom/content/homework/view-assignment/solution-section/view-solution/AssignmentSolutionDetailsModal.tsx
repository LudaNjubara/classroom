import { GridView } from "@/components/Elements";
import { ResourceItemSkeleton, Spinner } from "@/components/Loaders";
import { ClassroomAssignmentSolutionResourceItem } from "@/components/Resource";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { MAX_ASSIGNMENT_SOLUTION_GRADE, MIN_ASSIGNMENT_SOLUTION_GRADE } from "@/constants";
import { gradeClassroomAssignmentSolution } from "@/features/classrooms/api/grade-classroom-assignment-solution";
import { useClassroomAssignmentSolutionFiles } from "@/features/classrooms/hooks/useClassroomAssignmentSolutionFiles";
import { TAssignmentSolutionWithStudent, TClassroomAssignmentWithTeacher } from "@/features/classrooms/types";
import { formatDateTime } from "@/utils/misc";
import { ScrollTextIcon, XIcon } from "lucide-react";
import { useState } from "react";

type TAssignmentSolutionDetailsModalProps = {
  classroomAssignment: TClassroomAssignmentWithTeacher;
  assignmentSolution: TAssignmentSolutionWithStudent;
  onClose: () => void;
  onSuccessfulGrade: (grade: number) => void;
};

export function AssignmentSolutionDetailsModal({
  classroomAssignment,
  assignmentSolution,
  onClose,
  onSuccessfulGrade,
}: TAssignmentSolutionDetailsModalProps) {
  // state
  const [value, setValue] = useState(assignmentSolution.grade || MIN_ASSIGNMENT_SOLUTION_GRADE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // hooks
  const {
    data: assignmentSolutionFiles,
    isLoading: isAssignmentSolutionFilesLoading,
    error: assignmentSolutionFilesError,
    refetch: refetchAssignmentSolutionFiles,
  } = useClassroomAssignmentSolutionFiles(assignmentSolution.id);

  const { toast } = useToast();

  // handlers
  const calculatePosition = (value: number) => {
    return (
      ((value - MIN_ASSIGNMENT_SOLUTION_GRADE) *
        (MAX_ASSIGNMENT_SOLUTION_GRADE - MIN_ASSIGNMENT_SOLUTION_GRADE)) /
        (MAX_ASSIGNMENT_SOLUTION_GRADE - MIN_ASSIGNMENT_SOLUTION_GRADE) +
      MIN_ASSIGNMENT_SOLUTION_GRADE
    );
  };

  const handleGradeSolution = async () => {
    try {
      setIsSubmitting(true);

      const res = await gradeClassroomAssignmentSolution({
        solutionId: assignmentSolution.id,
        grade: value,
      });

      toast({
        title: "Solution graded",
        description: "The solution has been successfully graded",
        variant: "default",
      });

      onSuccessfulGrade(value);
    } catch (error) {
      toast({
        title: "Error grading solution",
        description: error instanceof Error ? error.message : "An error occurred while grading the solution",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <div className="mt-5">
        <h1 className="text-3xl font-semibold">
          Reviewing <span className="text-slate-400">{assignmentSolution.student.name}</span>s&apos; solution
          to <span className="text-slate-400">{classroomAssignment.title}</span> assignment
        </h1>

        <div className="mt-4">
          {/* Details */}
          <div className="mt-12 px-7 py-5 bg-slate-900 rounded-xl">
            <h2 className="text-xl font-semibold">Details</h2>

            <GridView className="md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
              <div className="border border-slate-800/75 rounded-xl p-5 shadow-md">
                <h3 className="mb-1 text-slate-300 font-semibold">First submitted</h3>
                <p className="text-lg text-slate-400">
                  {formatDateTime(new Date(assignmentSolution.createdAt))}
                </p>
              </div>
              <div className="border border-slate-800/75 rounded-xl p-5 shadow-md">
                <h3 className="mb-1 text-slate-300 font-semibold">Last edited</h3>
                <p className="text-lg text-slate-400">
                  {formatDateTime(new Date(assignmentSolution.updatedAt))}
                </p>
              </div>
              <div className="border border-slate-800/75 rounded-xl p-5 shadow-md">
                <h3 className="mb-1 text-slate-300 font-semibold">Submitee</h3>
                <p className="text-lg text-slate-400">{assignmentSolution.student.name}</p>
              </div>
              <div className="border border-slate-800/75 rounded-xl p-5 shadow-md">
                <h3 className="mb-1 text-slate-300 font-semibold">Status</h3>
                <p className="text-lg text-slate-400">{assignmentSolution.status}</p>
              </div>
            </GridView>
          </div>

          {/* Solution files */}
          <div className="mt-12 px-7 py-5 bg-slate-900 rounded-xl">
            <h2 className="text-xl font-semibold">Uploaded files</h2>

            <div className="mt-4">
              {isAssignmentSolutionFilesLoading && (
                <GridView className="gap-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <ResourceItemSkeleton key={index} />
                  ))}
                </GridView>
              )}

              {!isAssignmentSolutionFilesLoading && !assignmentSolutionFiles.length && (
                <p className="text-lg text-slate-400">No files uploaded</p>
              )}

              {!isAssignmentSolutionFilesLoading && assignmentSolutionFiles.length > 0 && (
                <GridView className="gap-2">
                  {assignmentSolutionFiles.map((file) => (
                    <ClassroomAssignmentSolutionResourceItem key={file.id} data={file} />
                  ))}
                </GridView>
              )}
            </div>

            {/* Students note */}
            <Alert className="mt-8">
              <ScrollTextIcon size={24} className="opacity-80" />
              <AlertDescription className="ml-5 text-xs leading-normal">
                <h2 className="text-lg font-semibold">Student note</h2>

                <p className="mt-1 text-base text-slate-400">
                  {assignmentSolution.note ? assignmentSolution.note : "No note provided"}
                </p>
              </AlertDescription>
            </Alert>
          </div>

          {/* Grading */}
          <div className="mt-12 px-7 py-5 bg-slate-900 rounded-xl">
            <h2 className="text-xl font-semibold">Grade the solution</h2>

            <div className="relative mt-5 py-5">
              {/* Min indicator */}
              <div className="absolute left-0 bottom-0">{MIN_ASSIGNMENT_SOLUTION_GRADE}</div>

              {/* Current value indicator */}
              <div
                className="absolute top-0 rounded-full w-12 h-12 bg-slate-950 grid place-items-center font-bold"
                style={{
                  left: `calc(${calculatePosition(value)}% - 24px)`,
                }}
              >
                {value}
              </div>

              {/* The slider */}
              <Input
                type="range"
                disabled={assignmentSolution.status !== "SUBMITTED"}
                min={MIN_ASSIGNMENT_SOLUTION_GRADE}
                max={MAX_ASSIGNMENT_SOLUTION_GRADE}
                step="1"
                value={value}
                className="mt-4 bg-slate-200 "
                onChange={(e) => setValue(Number(e.target.value))}
              />

              {/* Max indicator */}
              <div className="absolute right-0 bottom-0">{MAX_ASSIGNMENT_SOLUTION_GRADE}</div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                className="text-base font-semibold"
                onClick={handleGradeSolution}
                disabled={assignmentSolution.status !== "SUBMITTED"}
              >
                {isSubmitting ? <Spinner /> : "Grade solution"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
