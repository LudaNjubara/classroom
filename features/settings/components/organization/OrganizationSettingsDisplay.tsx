import { OrganizationSettingsSkeleton, Spinner } from "@/components/Loaders";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { TOrganizationSettingsWithId } from "@/features/settings/types";
import { useDashboardStore } from "@/stores";
import { useState } from "react";
import { updateOrganizationSettings } from "../../api";
import { useOrganizationSettings } from "../../hooks/useOrganizationSettings";
import { DefaultInviteMessageFormField } from "../DefaultInviteMessageFormField";

export function OrganizationSettingsDisplay() {
  // zustand state and actions
  const selectedOrganization = useDashboardStore((state) => state.selectedOrganization);

  // state
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [editedOrganizationSettings, setEditedOrganizationSettings] = useState<TOrganizationSettingsWithId>();

  // hooks
  const {
    data: organizationSettings,
    isLoading: isOrganizationSettingsLoading,
    error: organizationSettingsError,
    refetch: refetchOrganizationSettings,
  } = useOrganizationSettings(selectedOrganization?.id);

  const { toast } = useToast();

  // handlers
  const handleSubmit = async () => {
    if (!editedOrganizationSettings || !selectedOrganization?.id) return;

    setIsFormSubmitting(true);

    try {
      await updateOrganizationSettings({
        organizationSettings: {
          organizationId: selectedOrganization.id,
          settings: editedOrganizationSettings,
        },
      });

      toast({
        title: "Settings updated successfully",
        variant: "default",
      });

      refetchOrganizationSettings();
    } catch (error) {
      console.error(error);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <div>
      {isOrganizationSettingsLoading && <OrganizationSettingsSkeleton />}

      {!isOrganizationSettingsLoading && organizationSettings.length > 0 && (
        <div className="flex flex-col gap-10 border-2 border-slate-700 rounded-xl bg-slate-900 py-5 px-6">
          <DefaultInviteMessageFormField
            setting={organizationSettings.find((setting) => setting.key === "DEFAULT_INVITE_MESSAGE")!}
            setEditedOrganizationSettings={setEditedOrganizationSettings}
          />
        </div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <Button
          onClick={handleSubmit}
          className="min-w-40"
          disabled={isOrganizationSettingsLoading || organizationSettings.length === 0 || isFormSubmitting}
        >
          {isFormSubmitting ? <Spinner /> : "Save settings"}
        </Button>
      </div>
    </div>
  );
}
