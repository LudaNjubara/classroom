"use client";

import { sendStatistics } from "@/api";
import { SEND_STATISTICS_INTERVAL } from "@/constants";
import {
  EAssignmentStatisticsEvent,
  EClassroomStatisticsEvent,
  ECommunicationStatisticsEvent,
} from "@/types/enums";
import { TEventQueue, TStatisticsEventMetadata } from "@/types/typings";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type StatisticsContextType = {
  trackEvent: (
    event: EAssignmentStatisticsEvent | EClassroomStatisticsEvent | ECommunicationStatisticsEvent,
    metadata: TStatisticsEventMetadata,
    data: any
  ) => void;
};

const StatisticsContext = createContext<StatisticsContextType>({
  trackEvent: () => {},
});

export const useStatistics = () => {
  return useContext(StatisticsContext);
};

export const StatisticsProvider = ({ children }: { children: React.ReactNode }) => {
  // state
  const [eventsQueue, setEventsQueue] = useState<TEventQueue[]>([]);

  // refs
  const eventsQueueRef = useRef<TEventQueue[]>([]);

  // methods
  const trackEvent = (
    event: EAssignmentStatisticsEvent | EClassroomStatisticsEvent | ECommunicationStatisticsEvent,
    metadata: TStatisticsEventMetadata,
    data: any
  ) => {
    const newEvent = { event, metadata, data };

    const eventIndex = eventsQueue.findIndex(
      (event) =>
        event.event === newEvent.event &&
        (event.metadata.classroomId === newEvent.metadata.classroomId ||
          event.metadata.assignmentId === newEvent.metadata.assignmentId)
    );

    switch (event) {
      case ECommunicationStatisticsEvent.TOTAL_NUMBER_OF_MESSAGES:
      case ECommunicationStatisticsEvent.TOTAL_NUMBER_OF_CALLS:
      case EClassroomStatisticsEvent.TOTAL_CLASSROOM_RESOURCE_DOWNLOAD_COUNT:
      case EAssignmentStatisticsEvent.NOTES_COUNT:
      case EAssignmentStatisticsEvent.SUBMISSIONS_COUNT:
      case EAssignmentStatisticsEvent.ON_TIME_SUBMISSIONS_COUNT:
      case EAssignmentStatisticsEvent.LOCKED_SUBMISSIONS_COUNT:
      case EAssignmentStatisticsEvent.GRADE_COUNT:
      case EAssignmentStatisticsEvent.DOWNLOADED_RESOURCES_COUNT:
        if (eventIndex !== -1) {
          eventsQueue[eventIndex].data.count += data.count;
        } else {
          setEventsQueue((prevEventsQueue) => [...prevEventsQueue, newEvent]);
        }
        break;
      case EAssignmentStatisticsEvent.GRADE_SUM_TOTAL:
        if (eventIndex !== -1) {
          eventsQueue[eventIndex].data.sum += data.sum;
        } else {
          setEventsQueue((prevEventsQueue) => [...prevEventsQueue, newEvent]);
        }
        break;
      case ECommunicationStatisticsEvent.TOTAL_CALL_DURATION:
        if (eventIndex !== -1) {
          eventsQueue[eventIndex].data.duration += data.duration;
        } else {
          setEventsQueue((prevEventsQueue) => [...prevEventsQueue, newEvent]);
        }
        break;
      default:
        const _exhaustiveCheck: never = event;
        return _exhaustiveCheck;
    }
  };

  useEffect(() => {
    eventsQueueRef.current = eventsQueue;
  }, [eventsQueue]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      console.log("Trying to send statistics");

      if (eventsQueueRef.current.length === 0) {
        console.log("No statistics to send");
        return;
      }

      try {
        const resData = await sendStatistics(eventsQueueRef.current);

        if (resData.success) {
          console.log("Statistics sent successfully");
          setEventsQueue([]);
        }
      } catch (error) {
        console.error("Error sending statistics", error);

        setEventsQueue([]);
      }
    }, SEND_STATISTICS_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  return <StatisticsContext.Provider value={{ trackEvent }}>{children}</StatisticsContext.Provider>;
};
