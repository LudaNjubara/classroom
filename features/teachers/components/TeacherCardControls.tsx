import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useDisclosure } from "@/hooks/useDisclosure";
import { TTeacherWithProfile } from "@/types/typings";
import { CheckCircle2, Info, MessageSquareText } from "lucide-react";
import { useState } from "react";

type TTeacherCardControlsProps = {
  teacher: TTeacherWithProfile;
  handleSelectTeacher: (teacher: TTeacherWithProfile, customInviteMessage?: string) => void;
  isSelected: boolean;
};

const TeacherCardControls = ({ teacher, handleSelectTeacher, isSelected }: TTeacherCardControlsProps) => {
  const [customInviteMessage, setCustomInviteMessage] = useState("");

  const { isOpen: isPopoverOpen, close: closePopover, toggle: togglePopover } = useDisclosure();

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`absolute top-1 -right-1 py-1 px-2 rounded-full cursor-default bg-slate-400/20 z-10 translate-x-full group-hover:-translate-x-2 transition-transform ease-in-out duration-300 ${
        isPopoverOpen && "-translate-x-2"
      }`}
    >
      <div className="flex items-center gap-1">
        <Popover open={isPopoverOpen} onOpenChange={togglePopover}>
          <PopoverTrigger asChild>
            <Button
              variant="secondary"
              className="p-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 hover:bg-slate-500 dark:hover:bg-slate-800/80 transition-colors duration-200"
            >
              {<MessageSquareText size={18} className="text-white" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Custom message</h4>
                <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                  <p>Create a customized message that will be sent to the teacher.</p>

                  <Alert>
                    <Info size={18} />
                    <AlertDescription className="text-xs">
                      This overwrites your default invite message which can be changed in the
                      organization&apos;s settings.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="inviteMessage">Message</Label>
                <Textarea
                  id="inviteMessage"
                  placeholder="Type message here..."
                  value={customInviteMessage}
                  onChange={(e) => setCustomInviteMessage(e.target.value)}
                />
              </div>

              <Button
                onClick={() => {
                  handleSelectTeacher(teacher, customInviteMessage);
                  setCustomInviteMessage("");
                  closePopover();
                }}
                disabled={!customInviteMessage}
                variant="default"
              >
                Select teacher
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          onClick={() => handleSelectTeacher(teacher)}
          variant="secondary"
          className="p-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 hover:bg-slate-500 dark:hover:bg-slate-800/80 transition-colors duration-200"
        >
          {<CheckCircle2 size={18} className={`${isSelected ? "text-green-500" : "text-white"}`} />}
        </Button>
      </div>
    </div>
  );
};

export default TeacherCardControls;
