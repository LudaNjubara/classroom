import { DashboardStateSlice, createDashboardStateSlice } from '@/stores/dashboard/slices/CreateDashboardStateSlice'
import { NavigationSlice, createNavigationSlice } from '@/stores/dashboard/slices/CreateNavigationSlice'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface DashboardState extends NavigationSlice, DashboardStateSlice { }

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (...a) => ({
      ...createNavigationSlice(...a),
      ...createDashboardStateSlice(...a),
    }),
  )
)