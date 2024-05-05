import { ClassroomTabSlice, createClassroomTabSlice } from '@/stores/dashboard/slices/CreateClassroomTabSlice'
import { DashboardStateSlice, createDashboardStateSlice } from '@/stores/dashboard/slices/CreateDashboardStateSlice'
import { NavigationSlice, createNavigationSlice } from '@/stores/dashboard/slices/CreateNavigationSlice'
import { StudentTabSlice, createStudentTabSlice } from '@/stores/dashboard/slices/CreateStudentTabSlice'
import { TeacherTabSlice, createTeacherTabSlice } from '@/stores/dashboard/slices/CreateTeacherTabSlice'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface DashboardState extends NavigationSlice, DashboardStateSlice, TeacherTabSlice, StudentTabSlice, ClassroomTabSlice { }

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (...a) => ({
      ...createNavigationSlice(...a),
      ...createDashboardStateSlice(...a),
      ...createTeacherTabSlice(...a),
      ...createStudentTabSlice(...a),
      ...createClassroomTabSlice(...a),
    }),
  )
)