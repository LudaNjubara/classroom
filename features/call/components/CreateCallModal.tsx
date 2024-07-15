"use client";

import { STREAMIO_API_KEY } from "@/constants";
import { useDashboardContext } from "@/context";
import { useDashboardStore } from "@/stores";
import { ECallType } from "@/types/enums";
import { Button } from "@components/ui/button";
import {
  Call,
  CallControls,
  CallParticipantsList,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { generateClientToken } from "../api/generate-client-token";

type TCreateCallModalProps = {
  onClose: () => void;
  callType: ECallType;
};

export function CallModal({ onClose, callType }: TCreateCallModalProps) {
  // context
  const { profile } = useDashboardContext();

  // zustand state and actions
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);

  // state
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);

  useEffect(() => {
    if (!selectedClassroom || !profile || !STREAMIO_API_KEY) return;

    const client = new StreamVideoClient({
      apiKey: STREAMIO_API_KEY!,
      user: {
        id: profile.id,
        name: profile.name,
        image: profile.picture ?? undefined,
      },
      tokenProvider: () => generateClientToken(),
    });
    const call = client.call("default", selectedClassroom.id);
    call.join({ create: true });

    setClient(client);
    setCall(call);

    return () => {
      const cleanup = async () => {
        try {
          await call.leave();
          await client.disconnectUser();
        } catch (error) {
          console.error(error);
        }
      };

      cleanup();
    };
  }, [selectedClassroom, profile]);

  return (
    <div className="pb-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-medium">Create a call</h2>
          <p className="text-slate-600">
            Create a call to start a video call with members of the current classroom.
          </p>
        </div>

        <div>
          <Button
            className="rounded-full bg-slate-500/30 hover:bg-slate-600/30 dark:bg-slate-600/30 hover:dark:bg-slate-500/30"
            onClick={onClose}
            size={"icon"}
          >
            <XIcon size={24} className="text-slate-600 dark:text-slate-600" />
          </Button>
        </div>
      </div>

      <div className="mt-8">
        {!!client && !!call && (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <StreamTheme>
                <SpeakerLayout />
                <CallControls onLeave={onClose} />
                <CallParticipantsList onClose={() => {}} />
              </StreamTheme>
            </StreamCall>
          </StreamVideo>
        )}
      </div>
    </div>
  );
}
