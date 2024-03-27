// create skeleton from this jsx and use Skeleton component from "@/components/ui/skeleton".
/* 

<div
                  key={notification.id}
                  className="p-4 bg-slate-500/30 dark:bg-slate-600/30 rounded-lg my-2"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{notification.recipientId}</h3>
                      <p className="text-slate-600 dark:text-slate-600">{notification.message}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="text-slate-600 dark:text-slate-600">
                        {notification.createdAt.toLocaleString()}
                      </p>
                      <Button variant="outline" size="sm">
                        Mark as read
                      </Button>
                    </div>
                  </div>
                </div>
*/

import { Skeleton } from "@/components/ui/skeleton";

export function NotificationSkeleton() {
  return (
    <div className="p-4 bg-slate-500/30 dark:bg-slate-600/30 rounded-lg my-2 animate-pop-up">
      <div className="flex justify-between">
        <div>
          <Skeleton className="w-1/2 h-8"></Skeleton>

          <Skeleton className="w-3/4 h-4 mt-2"></Skeleton>
        </div>

        <div className="flex items-center gap-4">
          <Skeleton className="w-1/4 h-8"></Skeleton>
          <Skeleton className="w-24 h-8"></Skeleton>
        </div>
      </div>
    </div>
  );
}
