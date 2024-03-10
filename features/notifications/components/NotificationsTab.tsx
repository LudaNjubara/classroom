import { Separator } from "@/components/ui/separator";

export default function NotificationsTab() {
  return (
    <div>
      <div>
        <h2 className="text-2xl font-medium">Notifications</h2>
        <p className="text-slate-600">
          View and manage your notifications here. Note that notifications here are related only to the
          current organization
        </p>

        {/* <div className="flex items-center justify-end mt-2">
              <Button
                className="flex gap-2 mt-4"
                variant={"secondary"}
                onClick={() => setIsAddTeacherModalOpen(true)}
              >
                <PlusCircle size={18} className="opacity-80" />
                Add Teacher(s)
              </Button>
            </div> */}

        <Separator className="my-4" />

        {/* <div className="mt-8">
              <DataTable columns={teacherTableColumns} data={selectedOrganization?.teachers ?? []} />
            </div> */}
      </div>

      {/* {isAddTeacherModalOpen && <AddTeacherModal setIsAddTeacherModalOpen={setIsAddTeacherModalOpen} />} */}
    </div>
  );
}
