import { useMiscStore } from "@/stores";
import { useEffect } from "react";

export function CustomModal({ children }: { children: React.ReactNode }) {
  // zustand state and actions
  const incrementNumOfModalsOpen = useMiscStore((state) => state.incrementNumOfModalsOpen);
  const decrementNumOfModalsOpen = useMiscStore((state) => state.decrementNumOfModalsOpen);

  useEffect(() => {
    incrementNumOfModalsOpen();
    return () => decrementNumOfModalsOpen();
  }, [incrementNumOfModalsOpen, decrementNumOfModalsOpen]);

  return (
    <div className="absolute inset-0 p-4 bg-slate-300 dark:bg-slate-950 animate-pop-up transform-gpu">
      {children}
    </div>
  );
}
