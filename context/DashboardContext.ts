import { TOrganizationWithClassroomsWithStudentsWithTeachers } from "@/types/typings";
import { Profile } from "@prisma/client";
import { createContext, useContext } from "react";

export type DashboardContextType = {
    profile: Profile;
    organizations: TOrganizationWithClassroomsWithStudentsWithTeachers[];
}

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboardContext = () => {
    const context = useContext(DashboardContext);

    if (context === undefined) {
        throw new Error("useDashboardContext must be used within a DashboardContextProvider");
    }

    return context;
}