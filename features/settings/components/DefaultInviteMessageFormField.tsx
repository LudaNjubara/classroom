import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ORGANIZATION_DEFAULT_INVITE_MESSAGE } from "@/constants";
import { OrganizationSettings } from "@prisma/client";
import { Dispatch, SetStateAction, useRef } from "react";
import { TOrganizationSettingsWithId } from "../types";

type TDefaultInviteMessageFormFieldProps = {
  setting: OrganizationSettings;
  setEditedOrganizationSettings: Dispatch<SetStateAction<TOrganizationSettingsWithId | undefined>>;
};

export function DefaultInviteMessageFormField({
  setting,
  setEditedOrganizationSettings,
}: TDefaultInviteMessageFormFieldProps) {
  // refs
  const inputRef = useRef<HTMLInputElement>(null);

  // handlers
  const handleResetToDefaultClick = () => {
    if (!inputRef.current) return;

    inputRef.current.value = ORGANIZATION_DEFAULT_INVITE_MESSAGE;
    inputRef.current.focus();

    setEditedOrganizationSettings((prev) => ({
      ...prev,
      DEFAULT_INVITE_MESSAGE: {
        id: setting.id,
        value: ORGANIZATION_DEFAULT_INVITE_MESSAGE,
        metadata: {
          type: "STRING",
        },
      },
    }));
  };

  return (
    <div>
      <h6 className="text-lg font-medium text-slate-400 dark:text-slate-300">Invite message</h6>
      <p className="text-sm text-muted-foreground">
        Define an invite message that will be used when inviting other teachers and students into your
        organization.
      </p>
      <div className="mt-3">
        <Button
          variant="ghost"
          size="sm"
          className="block w-fit ml-auto mb-2 text-sm"
          onClick={handleResetToDefaultClick}
        >
          Reset to default
        </Button>

        <Input
          ref={inputRef}
          placeholder="Hey there..."
          defaultValue={setting.value}
          onChange={(e) =>
            setEditedOrganizationSettings((prev) => ({
              ...prev,
              DEFAULT_INVITE_MESSAGE: {
                id: setting.id,
                value: e.target.value,
                metadata: {
                  type: "STRING",
                },
              },
            }))
          }
        />
      </div>
    </div>
  );
}
