import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

export type TStudentNotificationCardProps = {
  toggleModal: () => void;
};

export function StudentNotificationCard({ toggleModal }: TStudentNotificationCardProps) {
  return (
    <div>
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-medium">Student notifications</h2>
          <p className="text-slate-600">View and interact with notifications related to students</p>
        </div>

        <div>
          <Button
            className="rounded-full bg-slate-500/30 hover:bg-slate-600/30 dark:bg-slate-600/30 hover:dark:bg-slate-500/30"
            onClick={toggleModal}
            size={"icon"}
          >
            <XIcon size={24} className="text-slate-600 dark:text-slate-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}
