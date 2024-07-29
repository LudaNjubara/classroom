import { useMiscStore } from "@/stores";
import { cn } from "@/utils/cn";
import { useEffect } from "react";

export function CustomModal({ children, className }: { children: React.ReactNode; className?: string }) {
  // zustand state and actions
  const incrementNumOfModalsOpen = useMiscStore((state) => state.incrementNumOfModalsOpen);
  const decrementNumOfModalsOpen = useMiscStore((state) => state.decrementNumOfModalsOpen);

  useEffect(() => {
    incrementNumOfModalsOpen();
    return () => decrementNumOfModalsOpen();
  }, [incrementNumOfModalsOpen, decrementNumOfModalsOpen]);

  return (
    <div
      className={cn(
        "absolute inset-0 p-4 bg-slate-300 dark:bg-slate-950 animate-pop-up transform-gpu",
        className
      )}
    >
      {children}
    </div>
  );
}
