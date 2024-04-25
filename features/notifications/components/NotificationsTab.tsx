"use client";

import { CustomModal, GridView } from "@/components/Elements";
import { Separator } from "@/components/ui/separator";
import { useDashboardContext } from "@/context";
import { useDisclosure } from "@/hooks/useDisclosure";
import { Role } from "@prisma/client";
import { BuildingIcon, GraduationCapIcon, TestTube2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import { OrganizationNotificationCard, StudentNotificationCard, TeacherNotificationCard } from ".";

type TNotificationCardType = "organization" | "teacher" | "student";

type TNotificationCard = {
  id: TNotificationCardType;
  title: string;
  description: string;
  icon: JSX.Element;
  renderComponent: (props: any) => JSX.Element;
  allowedRoles: Role[];
};

const notificationCards: TNotificationCard[] = [
  {
    id: "organization",
    title: "Organization notifications",
    description: "View notifications coming from organizations. These include invites, updates, etc.",
    icon: <BuildingIcon size={20} />,
    renderComponent: (props) => <OrganizationNotificationCard {...props} />,
    allowedRoles: ["ADMIN", "ORGANIZATION", "TEACHER", "STUDENT"],
  },
  {
    id: "teacher",
    title: "Teacher notifications",
    description: "View notifications related to teachers",
    icon: <TestTube2Icon size={20} />,
    renderComponent: (props) => <TeacherNotificationCard {...props} />,
    allowedRoles: ["ADMIN", "ORGANIZATION", "TEACHER", "STUDENT"],
  },
  {
    id: "student",
    title: "Student notifications",
    description: "View notifications related to students",
    icon: <GraduationCapIcon size={20} />,
    renderComponent: (props) => <StudentNotificationCard {...props} />,
    allowedRoles: ["ADMIN", "ORGANIZATION", "TEACHER", "STUDENT"],
  },
];

export function NotificationsTab() {
  // context
  const { profile } = useDashboardContext();

  // state
  const [selectedCard, setSelectedCard] = useState<TNotificationCardType | null>(null);
  const allowedNotificationCards = useMemo(
    () => Object.values(notificationCards).filter((card) => card.allowedRoles.includes(profile.role)),
    [profile.role]
  );

  // derived state
  const cardToRender = notificationCards.find((card) => card.id === selectedCard);

  // hooks
  const { isOpen: isModalOpen, toggle: toggleModal } = useDisclosure();

  // handlers
  const handleCardClick = (cardId: TNotificationCardType) => {
    setSelectedCard(cardId);
    toggleModal();
  };

  return (
    <div>
      <div>
        <h2 className="text-2xl font-medium">Notifications</h2>
        <p className="text-slate-600">
          View and manage your notifications here. Note that notifications here are related only to the
          current organization
        </p>

        <Separator className="my-4" />

        <GridView>
          {allowedNotificationCards.map((card) => (
            <div
              tabIndex={0}
              role="button"
              aria-label={card.title}
              aria-roledescription="button"
              key={card.title}
              className="p-5 cursor-pointer hover:bg-slate-100 hover:dark:bg-slate-800 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-200 dark:bg-slate-900 transition-colors duration-300 ease-in-out"
              onClick={() => handleCardClick(card.id)}
            >
              <div className="flex items-center gap-4 rounded-lg py-2 px-2 bg-slate-300/50 dark:bg-slate-950/30">
                <span>{card.icon}</span>
                <h3 className="text-base font-medium">{card.title}</h3>
              </div>

              <div className="mt-3">
                <p className="text-sm text-slate-500 dark:text-slate-500">{card.description}</p>
              </div>
            </div>
          ))}
        </GridView>
      </div>

      {cardToRender && isModalOpen && (
        <CustomModal>
          {cardToRender.renderComponent({
            toggleModal,
          })}
        </CustomModal>
      )}
    </div>
  );
}
