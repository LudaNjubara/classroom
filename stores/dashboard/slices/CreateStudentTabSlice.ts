
import { TSelectedStudentItem } from '@/features/students/types'
import { StateCreator } from 'zustand'

export interface StudentTabSlice {
    selectedStudentItems: TSelectedStudentItem[]
    setSelectedStudentItems: (items: TSelectedStudentItem[]) => void
}

export const createStudentTabSlice: StateCreator<
    StudentTabSlice,
    [],
    [],
    StudentTabSlice
> = (set) => ({
    selectedStudentItems: [],
    setSelectedStudentItems: (items) => set({ selectedStudentItems: items }),
})