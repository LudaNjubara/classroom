import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useDisclosure } from "@/hooks/useDisclosure";
import { TTeacherWithProfile } from "@/types/typings";
import { CheckCircle2, MessageSquareText } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

type TTeacherCardProps = {
  teacher: TTeacherWithProfile;
  isSelected: boolean;
  handleSelectTeacher: (teacher: TTeacherWithProfile, customInviteMessage?: string) => void;
};

export function TeacherCard({ teacher, isSelected, handleSelectTeacher }: TTeacherCardProps) {
  const customInviteMessageTextareaRef = useRef<HTMLTextAreaElement>(null);

  const { isOpen, close: closePopover, toggle } = useDisclosure();

  return (
    <article
      onClick={() => handleSelectTeacher(teacher)}
      className={`relative group flex gap-3 rounded-lg cursor-pointer overflow-hidden  bg-slate-500 dark:bg-slate-900 dark:hover:bg-slate-800/80 transition-colors duration-300 animate-pop-up ${
        isSelected &&
        "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-green-900 dark:to-slate-800/80 to-80%"
      }`}
    >
      {/* Controls */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute top-1 -right-1 py-1 px-2 rounded-full cursor-default bg-slate-400/20 z-10 translate-x-full group-hover:-translate-x-2 transition-transform ease-in-out duration-300 ${
          isOpen && "-translate-x-2"
        }`}
      >
        <div className="flex items-center gap-1">
          <Popover open={isOpen} onOpenChange={toggle}>
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
                  <p className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <span>Create a customized message that will be sent to the teacher.</span>
                    <span>
                      This overwrites your default invite message which can be changed in the
                      organization&apos;s settings.
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="inviteMessage">Message</Label>
                  <Textarea
                    ref={customInviteMessageTextareaRef}
                    id="inviteMessage"
                    placeholder="Type message here..."
                  />
                </div>

                <Button
                  onClick={() => {
                    const customInviteMessage = customInviteMessageTextareaRef.current?.value;
                    handleSelectTeacher(teacher, customInviteMessage);
                    closePopover();
                  }}
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

      <div className="relative basis-20 flex-shrink-0 rounded-s-lg overflow-hidden">
        <Image
          src={teacher.profile.picture!}
          style={{ objectFit: "cover", objectPosition: "center" }}
          quality={80}
          sizes="100px"
          alt={teacher.name}
          fill
        />
      </div>

      <div className="flex-1 pt-4 pb-8 px-2">
        <h3 className="text-lg font-medium">{teacher.name}</h3>
        <p className="text-slate-600 break-all">{teacher.email}</p>
      </div>
    </article>
  );
}
