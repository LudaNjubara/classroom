
import { TAccentColor, TClassroomWithSettings } from '@/features/classrooms/types'
import { StateCreator } from 'zustand'

export interface ClassroomTabSlice {
    selectedClassroom: TClassroomWithSettings | null
    setSelectedClassroom: (classroom: TClassroomWithSettings) => void
    accentColors: { [key: string]: TAccentColor }
    setAccentColors: (accentColors: { [key: string]: TAccentColor }) => void
}

export const createClassroomTabSlice: StateCreator<
    ClassroomTabSlice,
    [],
    [],
    ClassroomTabSlice
> = (set) => ({
    selectedClassroom: null,
    setSelectedClassroom: (classroom) => set({ selectedClassroom: classroom }),
    accentColors: {},
    setAccentColors: (accentColors) => set({ accentColors })
})