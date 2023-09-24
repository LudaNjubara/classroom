import { TDashboardAsideTab } from '@/types/typings'
import { StateCreator } from 'zustand'

export interface NavigationSlice {
    selectedTab: keyof TDashboardAsideTab | null
    setSelectedTab: (tab: keyof TDashboardAsideTab) => void
}

export const createNavigationSlice: StateCreator<
    NavigationSlice,
    [],
    [],
    NavigationSlice
> = (set) => ({
    selectedTab: null,
    setSelectedTab: (tab) => set({ selectedTab: tab }),
})