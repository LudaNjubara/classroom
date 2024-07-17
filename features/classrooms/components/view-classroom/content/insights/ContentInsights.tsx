import { Spinner } from "@/components/Loaders";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HTTP_STATUS_CODES } from "@/constants";
import { useClassroomInsights } from "@/features/classrooms/hooks/useClassroomInsights";
import { useDashboardStore } from "@/stores";
import { InfoIcon, RotateCwIcon } from "lucide-react";

export function ContentInsights() {
  // zustand state and actions
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);

  // hooks
  const {
    data: insights,
    isLoading: isInsightsLoading,
    error: insightsError,
    refetch: refetchInsights,
  } = useClassroomInsights(selectedClassroom?.id);

  return (
    <div>
      <div>
        <h2 className="text-lg mb-3 font-semibold">Classroom Insights</h2>

        {isInsightsLoading && <Spinner />}

        {!isInsightsLoading &&
          insightsError &&
          (insightsError?.statusCode === HTTP_STATUS_CODES.UNPROCESSABLE_CONTENT ? (
            <div className="flex items-center gap-7 bg-yellow-500/20 bg- rounded-lg p-5">
              <div className="grid place-items-center self-stretch pr-5 border-r-2 border-yellow-500/30">
                <InfoIcon size={24} className="text-yellow-300" />
              </div>

              <div className="flex-1">
                <p className="text-yellow-300 text-sm">
                  There is not enough information to compute insightful statistics. Keep using the classroom
                  in order for the insights to show.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-7 bg-red-500/30 rounded-lg p-5">
              <div className="grid place-items-center self-stretch pr-5 border-r border-red-600/80">
                <InfoIcon size={24} className="text-red-500" />
              </div>

              <div className="flex-1">
                <p className="text-red-500 text-sm">There was an issue with fetching statistics data.</p>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={refetchInsights}
                        className="grid place-items-center mt-2 rounded-full bg-red-500/30 hover:bg-red-800 focus:bg-red-800 transition-colors duration-200"
                      >
                        <RotateCwIcon size={16} className="text-center " />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Try refetching statistics</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ))}

        {!isInsightsLoading && !!insights && (
          <p>{insights.assignmentInsights.aggregated.assignmentCompletionRate}</p>
        )}
      </div>

      {/* Generate AI insight */}
      <div className="mt-8"></div>
    </div>
  );
}
