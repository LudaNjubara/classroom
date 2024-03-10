import { TOrganizationWithClassroomsWithStudentsWithTeachers } from '@/types/typings'
import { StateCreator } from 'zustand'

export interface DashboardStateSlice {
    selectedOrganization: TOrganizationWithClassroomsWithStudentsWithTeachers | null
    setSelectedOrganization: (org: TOrganizationWithClassroomsWithStudentsWithTeachers) => void
}

export const createDashboardStateSlice: StateCreator<
    DashboardStateSlice,
    [],
    [],
    DashboardStateSlice
> = (set) => ({
    selectedOrganization: null,
    setSelectedOrganization: (org) => set({ selectedOrganization: org }),
})