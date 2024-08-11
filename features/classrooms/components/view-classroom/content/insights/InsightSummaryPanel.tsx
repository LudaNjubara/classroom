import { InsightSummarySkeleton, Spinner } from "@/components/Loaders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { generateInsightsSummary } from "@/features/classrooms/api";
import { INSIGHTS_SUMMARY_MARKDOWN_OPTIONS } from "@/features/classrooms/constants";
import { useClassroomInsightsSummary } from "@/features/classrooms/hooks/useClassroomInsightsSummary";
import { TClassroomInsight } from "@/features/classrooms/types";
import { generateInsightsPrompt } from "@/features/classrooms/utils";
import { useDashboardStore } from "@/stores";
import { cn } from "@/utils/cn";
import { formatDateTime, isToday } from "@/utils/misc";
import { StatisticsSummary } from "@prisma/client";
import { WandSparklesIcon } from "lucide-react";
import Markdown from "markdown-to-jsx";
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

  // derived state
  const isSummaryGeneratedToday = !!oldSummary && isToday(new Date(oldSummary.createdAt));

  // handlers
  const handleGenerateSummaryClick = async () => {
    if (!selectedClassroom || isSummaryGeneratedToday) return;

    const prompt = generateInsightsPrompt(insights);

    try {
      setIsGeneratingSummary(true);
      const { insightSummary } = await generateInsightsSummary({ prompt, classroomId: selectedClassroom.id });

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
      <div className="flex justify-end gap-4 items-center">
        {isSummaryGeneratedToday && (
          <p className="text-sm text-muted-foreground">Summary already generated today.</p>
        )}

        <Button
          variant="default"
          className="flex gap-2 w-48"
          onClick={handleGenerateSummaryClick}
          disabled={isGeneratingSummary || isOldSummaryLoading || isSummaryGeneratedToday}
        >
          {isGeneratingSummary ? (
            <Spinner />
          ) : (
            <>
              <WandSparklesIcon size={16} />
              Generate Summary
            </>
          )}
        </Button>
      </div>

      <div className="mt-3 border rounded-lg overflow-hidden">
        <div className="px-3 py-4 bg-slate-800">
          <h3 className="tracking-wide">Summary</h3>
          <p className="text-sm mt-2 text-slate-400">
            Summary is where all the insights are gathered and presented in a concise, easy-to-understand
            manner. It provides the information into what the insights above actually mean, how they may be
            used for improving the teaching process, interaction between members and more.
          </p>
        </div>

        {isGeneratingSummary && (
          <div className="px-3 py-6">
            <InsightSummarySkeleton />
          </div>
        )}

        <div className="px-3 py-6">
          {!isGeneratingSummary && (
            <div>
              {oldSummary && (
                <>
                  <Badge>Generated on {formatDateTime(new Date(oldSummary.createdAt))}</Badge>

                  <div className="mt-3">
                    <Markdown options={INSIGHTS_SUMMARY_MARKDOWN_OPTIONS}>{oldSummary.content}</Markdown>
                  </div>
                </>
              )}

              {newSummary && (
                <>
                  <Badge>Generated on {formatDateTime(new Date(newSummary.createdAt))}</Badge>

                  <div className="mt-3">
                    <Markdown options={INSIGHTS_SUMMARY_MARKDOWN_OPTIONS}>{newSummary.content}</Markdown>
                  </div>
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
