import { useToast } from "@/components/ui/use-toast";
import { useDashboardStore } from "@/stores";
import { useState } from "react";

export function MembersSettingsItem() {
  // zustand state and actions
  const selectedOrganization = useDashboardStore((state) => state.selectedOrganization);
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);

  // state
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // hooks
  const { toast } = useToast();

  // handlers

  return <div></div>;
}
