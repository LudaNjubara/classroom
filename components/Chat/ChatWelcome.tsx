import { HashIcon } from "lucide-react";

type TChatWelcomeProps = {
  channelName: string;
};

export function ChatWelcome({ channelName }: TChatWelcomeProps) {
  return (
    <div className="space-y-2 px-4">
      <div className="h-[50px] w-[50px] rounded-full bg-slate-500 dark:bg-slate-800 flex items-center justify-center">
        <HashIcon size={30} className="text-slate-300 dark:text-slate-500" />
      </div>

      <p className="text-xl md:text-2xl font-semibold">Welcome to #{channelName}</p>
      <p className="text-sm dark:text-slate-500 text-slate-950">
        This is the very beginning of the #{channelName} channel. Fill it with some awesome content!
      </p>
    </div>
  );
}
