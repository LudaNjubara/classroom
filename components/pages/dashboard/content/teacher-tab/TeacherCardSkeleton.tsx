export default function TeacherCardSkeleton() {
  return (
    <div className="flex gap-3 rounded-lg bg-slate-400 dark:bg-slate-900 overflow-hidden animate-pop-up">
      <div className="relative basis-20 flex-shrink-0">
        <div className="w-20 h-20 bg-slate-500 dark:bg-slate-800 animate-pulse"></div>
      </div>

      <div className="flex-1 py-4 px-2">
        <div className="w-24 h-4 bg-slate-500 dark:bg-slate-800 animate-pulse"></div>
        <div className="w-32 h-4 bg-slate-500 dark:bg-slate-800 animate-pulse mt-1"></div>
      </div>
    </div>
  );
}
