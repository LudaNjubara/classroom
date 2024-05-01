import { Loader2Icon } from "lucide-react";

export const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <Loader2Icon className="animate-spin h-6 w-6 text-gray-500" />
    </div>
  );
};
