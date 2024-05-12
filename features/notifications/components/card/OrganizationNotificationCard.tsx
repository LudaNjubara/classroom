"use client";

import { NotificationSkeleton } from "@/components/Loaders";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useDashboardContext } from "@/context";
import { Notification } from "@prisma/client";
import dayjs from "dayjs";
import { CalendarDaysIcon, CheckCheckIcon, CircleOffIcon, XIcon } from "lucide-react";
import { memo, useCallback } from "react";
import { acceptNotification, dismissNotification } from "../..";
import { NOTIFICATIONS_WITH_ACTIONS } from "../../constants";
import { useOrganizationNotifications } from "../../hooks/useOrganizationNotifications";
import { TNotificationAction } from "../../types";

type TNotificationItemProps = {
  notification: Notification;
  handleAction: (action: TNotificationAction, notification: Notification) => void;
};

const NotificationItem: React.FC<TNotificationItemProps> = memo(({ notification, handleAction }) => {
  return (
    <div key={notification.id} className="p-4 bg-slate-500/30 dark:bg-slate-600/30 rounded-lg my-2">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <CalendarDaysIcon size={16} className="text-slate-600 dark:text-slate-600" />
              <p className="text-slate-600 dark:text-slate-600 text-xs">
                {dayjs(notification.createdAt).format("DD MMM, YYYY")}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">{notification.recipientId}</h3>
              <p className="text-slate-600 dark:text-slate-600">{notification.message}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {NOTIFICATIONS_WITH_ACTIONS.includes(notification.type) ? (
            notification.status === "PENDING" ? (
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={() => handleAction("DISMISS", notification)}>
                  Dismiss
                </Button>

                <Button
                  variant="outline"
                  className="bg-green-800 hover:bg-green-600 transition-colors duration-200"
                  size="sm"
                  onClick={() => handleAction("ACCEPT", notification)}
                >
                  Accept
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-slate-600 dark:text-slate-600">Resolved</p>
                {notification.status === "ACCEPTED" ? (
                  <CheckCheckIcon size={20} className="text-green-800 dark:text-green-800" />
                ) : (
                  <CircleOffIcon size={18} className="text-red-800 dark:text-red-800" />
                )}
              </div>
            )
          ) : (
            <div>
              <Button variant="outline" size="sm">
                View info
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

NotificationItem.displayName = "NotificationItem";

type TOrganizationNotificationCardProps = {
  toggleModal: () => void;
};

export function OrganizationNotificationCard({ toggleModal }: TOrganizationNotificationCardProps) {
  // context
  const { profile } = useDashboardContext();
  // hooks
  const { toast } = useToast();
  const {
    data: paginatedNotifications,
    isLoading,
    refetch: refetchOrganizationNotifications,
  } = useOrganizationNotifications(profile.role);

  // handlers
  const handleAction = useCallback(
    async (action: TNotificationAction, notification: Notification) => {
      switch (action) {
        case "ACCEPT":
          await acceptNotification(notification);

          toast({
            title: "Welcome to the organization",
            description: "You have successfully joined the organization",
          });

          refetchOrganizationNotifications();
          break;
        case "DISMISS":
          await dismissNotification(notification);

          toast({
            title: "Notification dismissed",
            description: "You have successfully dismissed the notification",
          });

          refetchOrganizationNotifications();
          break;
        default:
          const _exhaustiveCheck: never = action;
          break;
      }
    },
    [toast, refetchOrganizationNotifications]
  );

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
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  handleAction={handleAction}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
