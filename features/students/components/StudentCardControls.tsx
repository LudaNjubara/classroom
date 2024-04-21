import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useDashboardStore } from "@/stores";
import { validateInviteMessageInput } from "@/utils/validators";
import { CheckCircle2, Info, MessageSquareText } from "lucide-react";
import { useRef, useState } from "react";
import { TStudentWithProfile } from "../types";

type TStudentCardControlsProps = {
  student: TStudentWithProfile;
  handleSelectStudent: (student: TStudentWithProfile, customInviteMessage?: string) => void;
  isSelected: boolean;
};

const StudentCardControls = ({ student, handleSelectStudent, isSelected }: TStudentCardControlsProps) => {
  // zustand state and actions
  const selectedStudentItems = useDashboardStore((state) => state.selectedStudentItems);

  // derived state
  const thisStudentItem = selectedStudentItems.find((item) => item.studentId === student.id);

  // refs
  const inviteMessageRef = useRef<HTMLTextAreaElement>(null);

  // state
  const [inputErrors, setInputErrors] = useState<{ inviteMessage?: string }>({});

  // hooks
  const { isOpen: isPopoverOpen, close: closePopover, toggle: togglePopover } = useDisclosure();

  // handlers
  const handleInviteMessageSubmit = () => {
    if (!inviteMessageRef.current) return;

    const input = inviteMessageRef.current.value;

    const { isValid, errors } = validateInviteMessageInput(input);

    if (!isValid) {
      setInputErrors(errors);
      return;
    }

    setInputErrors({});
    handleSelectStudent(student, input);
    closePopover();
  };

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
                  <p>Create a customized message that will be sent to the student.</p>

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
                  ref={inviteMessageRef}
                  id="inviteMessage"
                  placeholder="Type message here..."
                  className={inputErrors.inviteMessage ? "border-red-400" : ""}
                  defaultValue={thisStudentItem?.inviteMessage ?? ""}
                />
                {inputErrors.inviteMessage && (
                  <p className="text-xs text-red-400">{inputErrors.inviteMessage}</p>
                )}
              </div>

              <Button onClick={handleInviteMessageSubmit} variant="default">
                Select student
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="secondary"
          className="p-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 hover:bg-slate-500 dark:hover:bg-slate-800/80 transition-colors duration-200"
          onClick={() => handleSelectStudent(student)}
        >
          {<CheckCircle2 size={18} className={`${isSelected ? "text-green-500" : "text-white"}`} />}
        </Button>
      </div>
    </div>
  );
};

export default StudentCardControls;
