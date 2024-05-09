import { Spinner } from "@/components/Loaders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, SendIcon } from "lucide-react";
import { FormEvent } from "react";

type TMessageInputProps = {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isDisabled: boolean;
};

export function MessageInput({ handleSubmit, isDisabled }: TMessageInputProps) {
  return (
    <div className="flex gap-2">
      <Button variant={"outline"} className="w-10 h-10 rounded-full" disabled={isDisabled}>
        <PlusIcon size={16} className="flex-shrink-0 opacity-70" />
      </Button>

      <form className="flex flex-1 gap-2" onSubmit={handleSubmit}>
        <Input placeholder="Type a message..." name="message" disabled={isDisabled} />
        <Button variant={"secondary"} disabled={isDisabled}>
          {isDisabled ? <Spinner /> : <SendIcon size={16} />}
        </Button>
      </form>
    </div>
  );
}
