import { Button } from "@/components/ui/button";
import { HashIcon, PlusIcon } from "lucide-react";

const ChannelItem = () => {
  return (
    <Button className="justify-start dark:text-slate-500" variant={"ghost"}>
      <p className="text-sm">Channel</p>
    </Button>
  );
};

export function SidebarChannelSection() {
  return (
    <div>
      <h3 className="flex items-center gap-2 font-light text-lg">
        <HashIcon size={16} />
        Channels
      </h3>

      <ul className="flex flex-col mt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <ChannelItem key={i} />
        ))}
      </ul>

      <div className="mt-6">
        <Button
          className="flex flex-col w-full gap-1 py-2 h-auto dark:text-slate-500 hover:dark:text-slate-300 focus:dark:text-slate-300 transition-colors duration-150"
          variant={"outline"}
        >
          <PlusIcon className="shrink-0" size={18} />
          <span className="text-xs">Add Channel</span>
        </Button>
      </div>
    </div>
  );
}
