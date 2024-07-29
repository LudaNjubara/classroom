import { Skeleton } from "../ui/skeleton";

const OrganizationSettingsItemSkeleton = () => {
  return (
    <div className="bg-slate-900 rounded-xl py-5 px-6">
      <Skeleton className="w-1/5 h-6 bg-slate-800" />
      <Skeleton className="w-2/3 h-3 bg-slate-800 mt-2" />

      <div className="flex items-center gap-4 mt-3">
        <Skeleton className="w-1/2 h-4 bg-slate-800" />
      </div>
    </div>
  );
};

export function OrganizationSettingsSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pop-up">
      <OrganizationSettingsItemSkeleton />
      <OrganizationSettingsItemSkeleton />
      <OrganizationSettingsItemSkeleton />
    </div>
  );
}
