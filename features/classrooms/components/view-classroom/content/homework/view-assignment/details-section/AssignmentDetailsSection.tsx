import { GridView } from "@/components/Elements";
import { ResourceItemSkeleton } from "@/components/Loaders";
import { ResourceItem } from "@/components/Resource";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  TClassroomAssignmentWithTeacher,
  TEditedAssignment,
  TResourceWithMetadata,
} from "@/features/classrooms/types";
import { useStatistics } from "@/providers/statistics-provider";
import { EAssignmentStatisticsEvent } from "@/types/enums";
import { formatDateTime } from "@/utils/misc";

type TAssignmentDetailsSectionProps = {
  assignment: TClassroomAssignmentWithTeacher;
  isAssignmentResourcesLoading: boolean;
  assignmentResources: TResourceWithMetadata[];
  editedAssignment: TEditedAssignment;
  setEditedAssignment: (editedAssignment: TEditedAssignment) => void;
  editedAssignmentErrors: TEditedAssignment;
  isEditing: boolean;
};

export function AssignmentDetailsSection({
  assignment,
  assignmentResources,
  isAssignmentResourcesLoading,
  editedAssignment,
  setEditedAssignment,
  editedAssignmentErrors,
  isEditing,
}: TAssignmentDetailsSectionProps) {
  // context
  const { trackEvent } = useStatistics();

  return (
    <div className="mt-5 overflow-hidden rounded-xl">
      <div className=" bg-slate-900 px-7 py-5 text-slate-500 dark:text-slate-100">
        {!isEditing ? (
          <h1 className="text-4xl font-medium">{assignment.title}</h1>
        ) : (
          <>
            <Label id="assignment-title-input">Title</Label>
            <Input
              id="assignment-title-input"
              value={editedAssignment.title}
              onChange={(e) => setEditedAssignment({ ...editedAssignment, title: e.target.value })}
            />
            {editedAssignmentErrors.title && (
              <p className="text-red-700 text-sm mt-1">{editedAssignmentErrors.title}</p>
            )}
          </>
        )}

        {!isEditing ? (
          <Badge variant="secondary" className="mt-4 py-1 px-4 text-base">
            Due <span className="ml-1">{formatDateTime(new Date(assignment.dueDate))}</span>
          </Badge>
        ) : (
          <div className="mt-4">
            <Label id="due-date-input">Due date</Label>
            <Input
              id="due-date-input"
              type="datetime-local"
              value={editedAssignment.dueDate}
              onChange={(e) => setEditedAssignment({ ...editedAssignment, dueDate: e.target.value })}
              className="w-fit"
            />
            {editedAssignmentErrors.dueDate && (
              <p className="text-red-700 text-sm mt-1">{editedAssignmentErrors.dueDate}</p>
            )}
          </div>
        )}
      </div>

      <div
        className={`${isAssignmentResourcesLoading && "pb-5"} ${
          !isAssignmentResourcesLoading && assignmentResources.length && "pb-5"
        } ${!isAssignmentResourcesLoading && !assignmentResources.length && "pb-0"}  px-7 bg-slate-900`}
      >
        {isAssignmentResourcesLoading && (
          <GridView className="gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <ResourceItemSkeleton key={index} />
            ))}
          </GridView>
        )}

        {!isAssignmentResourcesLoading && assignmentResources.length > 0 && (
          <GridView className="gap-2">
            {assignmentResources.map((file) => (
              <ResourceItem
                key={file.id}
                data={file}
                statisticsHandler={() => {
                  // track statistics
                  trackEvent(
                    EAssignmentStatisticsEvent.DOWNLOADED_RESOURCES_COUNT,
                    { assignmentId: assignment.id },
                    { count: 1 }
                  );
                }}
              />
            ))}
          </GridView>
        )}
      </div>

      <div className="px-7 pt-3 pb-8 bg-slate-900/50">
        {!isEditing ? (
          <pre className="mt-8 text-lg text-slate-500 leading-4">{assignment.description}</pre>
        ) : (
          <>
            <Label id="assignment-description-input">Description</Label>
            <Textarea
              id="assignment-description-input"
              value={editedAssignment.description}
              onChange={(e) => setEditedAssignment({ ...editedAssignment, description: e.target.value })}
              className="h-32"
            />
            {editedAssignmentErrors.description && (
              <p className="text-red-700 text-sm mt-1">{editedAssignmentErrors.description}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
