import { CustomModal } from "@/components/Elements";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDisclosure } from "@/hooks/useDisclosure";
import { ECallType } from "@/types/enums";
import { Button } from "@components/ui/button";
import { PhoneCallIcon, VideoIcon } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { CallModal } from "./CreateCallModal";

type TCallActionsProps = {};

export function CallActions({}: TCallActionsProps) {
  // state
  const [callType, setCallType] = useState<ECallType>();

  // hooks
  const { isOpen: isCallModalOopen, close: closeCallModal, toggle: toggleCallModalOpen } = useDisclosure();

  // handlers
  const handleCreateCall = (callType: ECallType) => {
    setCallType(callType);
    toggleCallModalOpen();
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                onClick={() => handleCreateCall(ECallType.AUDIO_ROOM)}
              >
                <PhoneCallIcon size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create audio call</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                onClick={() => handleCreateCall(ECallType.DEVELOPMENT)}
              >
                <VideoIcon size={24} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create video call</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Call Modal */}
      {isCallModalOopen &&
        callType &&
        createPortal(
          <CustomModal>
            <CallModal onClose={closeCallModal} callType={callType} />
          </CustomModal>,
          document.getElementById("view-classroom-container")!
        )}
    </div>
  );
}
