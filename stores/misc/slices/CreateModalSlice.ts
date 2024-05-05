

import { StateCreator } from 'zustand'

export interface ModalStateSlice {
    numOfModalsOpen: number
    incrementNumOfModalsOpen: () => void
    decrementNumOfModalsOpen: () => void
}

export const createMiscSlice: StateCreator<
    ModalStateSlice,
    [],
    [],
    ModalStateSlice
> = (set) => ({
    numOfModalsOpen: 0,
    incrementNumOfModalsOpen: () => set((state) => ({ numOfModalsOpen: state.numOfModalsOpen + 1 })),
    decrementNumOfModalsOpen: () => set((state) => ({ numOfModalsOpen: state.numOfModalsOpen - 1 }))
})