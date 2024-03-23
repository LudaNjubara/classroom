import { TSelectedTeacherItem } from '@/features/teachers'
import { StateCreator } from 'zustand'

export interface TeacherTabSlice {
    selectedTeacherItems: TSelectedTeacherItem[]
    setSelectedTeacherItems: (items: TSelectedTeacherItem[]) => void
}

export const createTeacherTabSlice: StateCreator<
    TeacherTabSlice,
    [],
    [],
    TeacherTabSlice
> = (set) => ({
    selectedTeacherItems: [],
    setSelectedTeacherItems: (items) => set({ selectedTeacherItems: items }),
})