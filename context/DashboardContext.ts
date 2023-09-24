import { TOrganizationWithClassroomsWithStudentsWithTeachers } from "@/types/typings";
import { Profile } from "@prisma/client";
import { createContext, useContext } from "react";

type DashboardContextType = {
    profile: Profile;
    organizations: TOrganizationWithClassroomsWithStudentsWithTeachers[];
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const useDashboardContext = () => {
    const context = useContext(DashboardContext);

    if (context === undefined) {
        throw new Error("useDashboardContext must be used within a DashboardContextProvider");
    }

    return context;
}

export { DashboardContext, useDashboardContext };

