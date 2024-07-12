
import { TAccentColor, TClassroomWithSettings } from '@/features/classrooms/types'
import { ClassroomChannel } from '@prisma/client'
import { StateCreator } from 'zustand'

export interface ClassroomTabSlice {
    selectedClassroom: TClassroomWithSettings | null
    setSelectedClassroom: (classroom: TClassroomWithSettings | null) => void
    selectedChannel: ClassroomChannel | null
    setSelectedChannel: (channel: ClassroomChannel | null) => void
    accentColors: { [key: string]: TAccentColor }
    setAccentColors: (accentColors: { [key: string]: TAccentColor }) => void

    resetClassroomTabSlice: () => void
}

export const createClassroomTabSlice: StateCreator<
    ClassroomTabSlice,
    [],
    [],
    ClassroomTabSlice
> = (set) => ({
    selectedClassroom: null,
    setSelectedClassroom: (classroom) => set({ selectedClassroom: classroom }),
    selectedChannel: null,
    setSelectedChannel: (channel) => set({ selectedChannel: channel }),
    accentColors: {},
    setAccentColors: (accentColors) => set({ accentColors }),

    resetClassroomTabSlice: () => set({ selectedClassroom: null, selectedChannel: null, accentColors: {} })
})