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
    setEventsQueue((prev) => [...prev, { event, metadata, data }]);
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
