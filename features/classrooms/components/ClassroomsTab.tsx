"use client";

import { CustomModal, GridView } from "@/components/Elements";
import { Separator } from "@/components/ui/separator";
import { useDashboardContext } from "@/context";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useDashboardStore, useMiscStore } from "@/stores";
import { Role } from "@prisma/client";
import { EyeIcon, HammerIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { CreateClassroomCard } from "./create-classroom";
import { ViewClassroomsCard } from "./view-classrooms";

type TClassroomCardType = "create" | "view";

type TClassroomCard = {
  id: TClassroomCardType;
  title: string;
  description: string;
  icon: JSX.Element;
  renderComponent: (props: any) => JSX.Element;
  allowedRoles: Role[];
};

const classroomCards: TClassroomCard[] = [
  {
    id: "create",
    title: "Create a classroom",
    description: "Create a new classroom where you can add students and teachers",
    icon: <HammerIcon size={20} />,
    renderComponent: (props) => <CreateClassroomCard {...props} />,
    allowedRoles: ["ADMIN", "ORGANIZATION", "TEACHER"],
  },
  {
    id: "view",
    title: "View classrooms",
    description:
      "View and manage classrooms you are a part of. Connect with students and teachers, share resources, etc.",
    icon: <EyeIcon size={20} />,
    renderComponent: (props) => <ViewClassroomsCard {...props} />,
    allowedRoles: ["ADMIN", "ORGANIZATION", "TEACHER", "STUDENT"],
  },
];

export function ClassroomsTab() {
  // context
  const { profile } = useDashboardContext();

  // zustand state and actions
  const selectedOrganization = useDashboardStore((state) => state.selectedOrganization);
  const numOfModalsOpen = useMiscStore((state) => state.numOfModalsOpen);

  // state
  const [selectedCard, setSelectedCard] = useState<TClassroomCardType | null>(null);
  const allowedClassroomCards = useMemo(
    () => Object.values(classroomCards).filter((card) => card.allowedRoles.includes(profile.role)),
    [profile.role]
  );

  // derived state
  const cardToRender = classroomCards.find((card) => card.id === selectedCard);

  // hooks
  const { isOpen: isModalOpen, toggle: toggleModal } = useDisclosure();

  // handlers
  const handleCardClick = (cardId: TClassroomCardType) => {
    if (!selectedOrganization) return;

    setSelectedCard(cardId);
    toggleModal();
  };

  return (
    <div>
      <div>
        <h2 className="text-2xl font-medium">Classrooms</h2>
        <p className="text-slate-600">
          View and manage your classrooms here. Note that classrooms here are related only to the current
          organization
        </p>

        <Separator className="my-4" />

        {!selectedOrganization && (
          <p className="text-slate-500">
            Select an organization to view classrooms. If no organizations are available check your
            notifications.
          </p>
        )}

        {selectedOrganization && (
          <GridView>
            {allowedClassroomCards.map((card) => (
              <button
                key={card.title}
                className="p-5 cursor-pointer text-start hover:bg-slate-100 hover:dark:bg-slate-800 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-200 dark:bg-slate-900 transition-colors duration-300 ease-in-out"
                onClick={() => handleCardClick(card.id)}
              >
                <div className="flex items-center gap-4 rounded-lg py-2 px-2 bg-slate-300/50 dark:bg-slate-950/30">
                  <span>{card.icon}</span>
                  <h3 className="text-base font-medium">{card.title}</h3>
                </div>

                <div className="mt-3">
                  <p className="text-sm text-slate-500 dark:text-slate-500">{card.description}</p>
                </div>
              </button>
            ))}
          </GridView>
        )}
      </div>

      {cardToRender && isModalOpen && (
        <CustomModal>
          <div className={`${numOfModalsOpen > 1 && "h-0 overflow-hidden"}`}>
            {cardToRender.renderComponent({
              toggleModal,
            })}
          </div>
        </CustomModal>
      )}
    </div>
  );
}
