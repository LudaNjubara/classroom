import { InsightSummarySkeleton, Spinner } from "@/components/Loaders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { generateInsightsSummary } from "@/features/classrooms/api";
import { useClassroomInsightsSummary } from "@/features/classrooms/hooks/useClassroomInsightsSummary";
import { TClassroomInsight } from "@/features/classrooms/types";
import { generateInsightsPrompt } from "@/features/classrooms/utils";
import { useDashboardStore } from "@/stores";
import { cn } from "@/utils/cn";
import { formatDateTime } from "@/utils/misc";
import { StatisticsSummary } from "@prisma/client";
import { WandSparklesIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type TInsightSummaryPanelProps = {
  insights: TClassroomInsight;
  className?: string;
};

export function InsightSummaryPanel({ insights, className }: TInsightSummaryPanelProps) {
  // zustand state and actions
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);

  // state
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [newSummary, setNewSummary] = useState<StatisticsSummary | null>(null);

  // hooks
  const {
    data: oldSummary,
    isLoading: isOldSummaryLoading,
    error: oldSummaryError,
    refetch: refetchOldSummary,
  } = useClassroomInsightsSummary(selectedClassroom?.id);

  const { toast } = useToast();

  // handlers
  const handleGenerateSummaryClick = async () => {
    const prompt = generateInsightsPrompt(insights);

    try {
      setIsGeneratingSummary(true);
      const { insightSummary } = await generateInsightsSummary(prompt);

      setNewSummary(insightSummary);
    } catch (error) {
      console.error(error);

      toast({
        title: "Failed to generate summary",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while generating the summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };
  return (
    <div className={cn("mt-10", className)}>
      <Button variant="default" className="ml-auto flex gap-2 w-48" onClick={handleGenerateSummaryClick}>
        {isGeneratingSummary ? (
          <Spinner />
        ) : (
          <>
            <WandSparklesIcon size={16} />
            Generate Summary
          </>
        )}
      </Button>

      <div className="mt-3 border rounded-lg overflow-hidden">
        <div className="px-3 py-4 bg-slate-800">
          <h3 className="tracking-wide">Summary</h3>
          <p className="text-sm mt-2 text-slate-400">
            Summary is where all the insights are gathered and presented in a concise, easy-to-understand
            manner. It provides the information into what the insights above actually mean, how they may be
            used for improving the teaching process, interaction between members and more.
          </p>
        </div>

        {isGeneratingSummary && <InsightSummarySkeleton />}

        <div className="px-3 py-8">
          {!isGeneratingSummary && (
            <div>
              {oldSummary && (
                <>
                  <Badge>Generated on {formatDateTime(new Date(oldSummary.createdAt))}</Badge>

                  <p className="text-xs text-slate-500">{oldSummary.content}</p>
                </>
              )}

              {newSummary && (
                <>
                  <Badge>Generated on {formatDateTime(new Date(newSummary.createdAt))}</Badge>

                  <p className="text-xs text-slate-500">{newSummary.content}</p>
                </>
              )}

              {!oldSummary && !newSummary && (
                <div className="flex flex-col items-center justify-center gap-5 py-8 tracking-wide fade-in duration-200">
                  <Image
                    src="/no-classroom-insight-summary.svg"
                    alt="No classroom insight summary"
                    width={200}
                    height={200}
                    className="opacity-70"
                  />
                  <p className="text-slate-500 text-sm font-semibold">
                    No summary available. Click the button above to generate a new summary.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
