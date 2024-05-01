import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/utils/cn";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Dispatch, SetStateAction, memo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { TDay, TScheduleItem, TScheduleTime } from "../../types";

const days: TDay[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const times: TScheduleTime[] = [
  "12:00",
  "12:30",
  "1:00",
  "1:30",
  "2:00",
  "2:30",
  "3:00",
  "3:30",
  "4:00",
  "4:30",
  "5:00",
  "5:30",
  "6:00",
  "6:30",
  "7:00",
  "7:30",
  "8:00",
  "8:30",
  "9:00",
  "9:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
];

type TScheduleItemProps = {
  data: TScheduleItem;
  totalItems: number;
  setScheduleItems: Dispatch<SetStateAction<TScheduleItem[]>>;
  className?: string;
};

function ScheduleItem({ setScheduleItems, totalItems, data, className }: TScheduleItemProps) {
  // state
  const [_data, _setData] = useState<TScheduleItem>(data);

  // hooks
  const { toast } = useToast();

  // handlers
  const handleRemoveItem = () => {
    if (totalItems === 1) {
      toast({
        title: "You must provide at least one schedule.",
        variant: "destructive",
      });
      return;
    }

    setScheduleItems((prev) => prev.filter((item) => item.id !== data.id));
  };

  const handleSaveItem = () => {
    setScheduleItems((prev) =>
      prev.map((item) => {
        if (item.id === data.id) {
          return _data;
        }
        return item;
      })
    );
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex gap-4 items-center">
        <span className="min-w-max text-sm">Day of the week:</span>

        <Select
          defaultValue={data.day}
          onValueChange={(value) => _setData((prev) => ({ ...prev, day: value as TDay }))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Day of the week" />
          </SelectTrigger>
          <SelectContent>
            {days.map((day) => (
              <SelectItem key={day} value={day}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4 items-center">
        <span className="min-w-max text-sm">Start time:</span>

        <div className="flex gap-2">
          <Select
            defaultValue={data.startTime}
            onValueChange={(value) => _setData((prev) => ({ ...prev, startTime: value as TScheduleTime }))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Start time" />
            </SelectTrigger>
            <SelectContent>
              {times.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Select for am or pm */}
          <Select
            defaultValue={data.startTimeAmPm}
            onValueChange={(value) => _setData((prev) => ({ ...prev, startTimeAmPm: value as "AM" | "PM" }))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="AM/PM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <span className="min-w-max text-sm">End time:</span>

        <div className="flex gap-2">
          <Select
            defaultValue={data.endTime}
            onValueChange={(value) => _setData((prev) => ({ ...prev, endTime: value as TScheduleTime }))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="End time" />
            </SelectTrigger>
            <SelectContent>
              {times.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Select for am or pm */}
          <Select
            defaultValue={data.endTimeAmPm}
            onValueChange={(value) => _setData((prev) => ({ ...prev, endTimeAmPm: value as "AM" | "PM" }))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="AM/PM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 items-center mt-3">
        <Button onClick={handleRemoveItem} variant={"destructive"} size={"icon"} className="w-9 h-9">
          <TrashIcon size={20} />
        </Button>

        <Button onClick={handleSaveItem} variant={"secondary"} size={"sm"}>
          Save/Update
        </Button>
      </div>
    </div>
  );
}

type TScheduleFormFieldProps = {
  scheduleItems: TScheduleItem[];
  setScheduleItems: Dispatch<SetStateAction<TScheduleItem[]>>;
  className?: string;
};

export const ScheduleFormField = memo(
  ({ scheduleItems, setScheduleItems, className }: TScheduleFormFieldProps) => {
    return (
      <div className={cn("", className)}>
        <h5 className="text-sm font-medium">Schedule *</h5>
        <p className="text-sm text-muted-foreground">
          Here you define the schedule for the classroom. You may add more than one schedule.
        </p>

        <div className="flex flex-col gap-8 mt-4">
          {scheduleItems.map((item) => (
            <ScheduleItem
              key={item.id}
              className="pl-4 border-l-4 border-slate-700 border-dotted"
              totalItems={scheduleItems.length}
              data={item}
              setScheduleItems={setScheduleItems}
            />
          ))}
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() =>
                  setScheduleItems((prev) => [
                    ...prev,
                    {
                      id: uuidv4(),
                      day: "Monday",
                      startTime: "12:00",
                      endTime: "12:30",
                      startTimeAmPm: "AM",
                      endTimeAmPm: "AM",
                    },
                  ])
                }
                size={"icon"}
                variant={"default"}
                className="mt-8 w-12 h-12 rounded-full"
              >
                <PlusIcon size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>New schedule</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }
);

ScheduleFormField.displayName = "ScheduleFormField";
