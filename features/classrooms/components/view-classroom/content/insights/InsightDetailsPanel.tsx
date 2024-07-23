import { GridView } from "@/components/Elements";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  TAggregatedAssignmentInsight,
  TAggregatedClassroomInsight,
  TClassroomInsight,
  TClassroomInsightAggregatedItem,
  TClassroomInsightBaseItem,
} from "@/features/classrooms/types";
import { cn } from "@/utils/cn";
import { InfoIcon, LightbulbIcon, WrenchIcon } from "lucide-react";

type TInsightDetailsPanelAggregatedItemProps = {
  insight: TClassroomInsightAggregatedItem;
};

const InsightDetailsPanelAggregatedItem = ({ insight }: TInsightDetailsPanelAggregatedItemProps) => {
  return (
    <div className="relative flex flex-col gap-3 rounded-lg p-5 border-2 border-slate-700/10 shadow-xl fade-in duration-300">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="absolute bottom-2 right-2 w-7 h-7 grid place-items-center rounded-full bg-slate-800/50 hover:bg-slate-800/70 focus:bg-slate-800/70 transition-colors duration-200"
          >
            <InfoIcon size={16} className="text-slate-400" />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="flex flex-col gap-4" side="top">
          <div>
            <div className="flex gap-2 items-center mb-1">
              <LightbulbIcon size={16} className="text-slate-400" />
              <h5>Meaning</h5>
            </div>
            <p className="text-xs text-slate-500">{insight.meaning}</p>
          </div>

          <div>
            <div className="flex gap-2 items-center mb-1">
              <WrenchIcon size={16} className="text-slate-400" />
              <h5>How it works</h5>
            </div>
            <p className="text-xs text-slate-500">{insight.howItWorks}</p>
          </div>
        </HoverCardContent>
      </HoverCard>

      <h4 className="text-sm font-semibold">{insight.title}</h4>
      <span className="block py-1 text-center text-3xl bg-slate-800 rounded-full text-slate-400 ">
        {insight.representAs === "percentage" ? `${insight.value * 100}%` : insight.value}
      </span>
      <p className="mt-4 text-xs text-slate-500">{insight.description}</p>
    </div>
  );
};

type TInsightDetailsPanelBaseItemProps = {
  insight: TClassroomInsightBaseItem;
};

const InsightDetailsPanelBaseItem = ({ insight }: TInsightDetailsPanelBaseItemProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-lg p-5 border-2 border-slate-700/10 shadow-xl fade-in duration-300">
      <h4 className="text-sm font-semibold">{insight.title}</h4>
      <span className="block py-1 text-center text-3xl bg-slate-800 rounded-full text-slate-400 ">
        {insight.value}
      </span>
      <p className="mt-4 text-xs text-slate-500">{insight.description}</p>
    </div>
  );
};

type TModeKey = keyof TAggregatedClassroomInsight | keyof TAggregatedAssignmentInsight;

type TInsightDetailsPanelProps = {
  insights: TClassroomInsight;
  modes: TModeKey[];
  className?: string;
};

export function InsightDetailsPanel({ insights, modes, className }: TInsightDetailsPanelProps) {
  return (
    <div className={cn("", className)}>
      {/* Classroom statistics */}
      <div className="mt-3 border rounded-lg overflow-hidden">
        <h3 className="px-3 py-4 bg-slate-800 tracking-wide w-full">Classroom statistics</h3>
        <Accordion type="multiple" defaultValue={["classroom-statistics-aggregated"]} className="p-3">
          <AccordionItem
            value="classroom-statistics-base"
            hidden={!modes.includes("base") && !modes.includes("total")}
          >
            <AccordionTrigger>Base</AccordionTrigger>

            <AccordionContent>
              <GridView className="p-3 md:grid-cols-1 lg:grid-cols-3 gap-3">
                {Object.values(insights.classroomInsights.base).map((value) => (
                  <InsightDetailsPanelBaseItem key={value.title} insight={value} />
                ))}
              </GridView>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="classroom-statistics-aggregated" hidden={!modes.includes("aggregated")}>
            <AccordionTrigger>Aggregated</AccordionTrigger>

            <AccordionContent>
              <GridView className="p-3 md:grid-cols-1 lg:grid-cols-3 gap-3">
                {Object.values(insights.classroomInsights.aggregated).map((value) => (
                  <InsightDetailsPanelAggregatedItem key={value.title} insight={value} />
                ))}
              </GridView>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Assignment statistics */}
      <div className="mt-3 border rounded-lg overflow-hidden">
        <h3 className="px-3 py-4 bg-slate-800 tracking-wide w-full">Assignment statistics</h3>
        <Accordion type="multiple" defaultValue={["assignment-statistics-aggregated"]} className="p-3">
          <AccordionItem value="assignment-statistics-base" hidden={!modes.includes("total")}>
            <AccordionTrigger>Base</AccordionTrigger>

            <AccordionContent>
              <GridView className="p-3 md:grid-cols-1 lg:grid-cols-3 gap-3">
                {Object.values(insights.assignmentInsights.total).map((value) => (
                  <InsightDetailsPanelBaseItem key={value.title} insight={value} />
                ))}
              </GridView>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="assignment-statistics-aggregated" hidden={!modes.includes("aggregated")}>
            <AccordionTrigger>Aggregated</AccordionTrigger>

            <AccordionContent>
              <GridView className="p-3 md:grid-cols-1 lg:grid-cols-3 gap-3">
                {Object.values(insights.assignmentInsights.aggregated).map((value) => (
                  <InsightDetailsPanelAggregatedItem key={value.title} insight={value} />
                ))}
              </GridView>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Communication statistics */}
      <div className="mt-3 border rounded-lg overflow-hidden">
        <h3 className="px-3 py-4 bg-slate-800 tracking-wide w-full">Communication statistics</h3>
        <Accordion type="multiple" defaultValue={["communication-statistics-aggregated"]} className="p-3">
          <AccordionItem value="communication-statistics-base" hidden={!modes.includes("base")}>
            <AccordionTrigger>Base</AccordionTrigger>

            <AccordionContent>
              <GridView className="p-3 md:grid-cols-1 lg:grid-cols-3 gap-3">
                {Object.values(insights.communicationInsights.base).map((value) => (
                  <InsightDetailsPanelBaseItem key={value.title} insight={value} />
                ))}
              </GridView>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="communication-statistics-aggregated" hidden={!modes.includes("aggregated")}>
            <AccordionTrigger>Aggregated</AccordionTrigger>

            <AccordionContent>
              <GridView className="p-3 md:grid-cols-1 lg:grid-cols-3 gap-3">
                {Object.values(insights.communicationInsights.aggregated).map((value) => (
                  <InsightDetailsPanelAggregatedItem key={value.title} insight={value} />
                ))}
              </GridView>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
