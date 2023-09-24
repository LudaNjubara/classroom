import { DashboardStateSlice, createDashboardStateSlice } from '@lib/store/slices/CreateDashboardStateSlice'
import { NavigationSlice, createNavigationSlice } from '@lib/store/slices/CreateNavigationSlice'
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