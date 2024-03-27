"use client";

import { NotificationSkeleton } from "@/components/Loaders/NotificationSkeleton";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { useOrganizationNotifications } from "../../hooks/useOrganizationNotifications";

type TOrganizationNotificationCardProps = {
  toggleModal: () => void;
};

export function OrganizationNotificationCard({ toggleModal }: TOrganizationNotificationCardProps) {
  // hooks
  const { data: paginatedNotifications, isLoading } = useOrganizationNotifications();

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-medium">Organization notifications</h2>
          <p className="text-slate-600">View and interact with notifications related to organizations</p>
        </div>

        <div>
          <Button
            className="rounded-full bg-slate-500/30 hover:bg-slate-600/30 dark:bg-slate-600/30 hover:dark:bg-slate-500/30"
            onClick={toggleModal}
            size={"icon"}
          >
            <XIcon size={24} className="text-slate-600 dark:text-slate-600" />
          </Button>
        </div>
      </div>

      <div className="mt-4">
        {isLoading && Array.from({ length: 5 }).map((_, index) => <NotificationSkeleton key={index} />)}

        {!isLoading && !paginatedNotifications.data.length && (
          <p className="text-slate-600 dark:text-slate-600">No notifications found</p>
        )}

        {!isLoading && !!paginatedNotifications.data.length && (
          <div>
            {paginatedNotifications.data.map((notification) => {
              return (
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
