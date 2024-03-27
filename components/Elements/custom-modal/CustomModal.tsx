export function CustomModal({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 p-4 bg-slate-300 dark:bg-slate-950 animate-pop-up transform-gpu">
      {children}
    </div>
  );
}
