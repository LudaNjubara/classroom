import { ModalStateSlice, createMiscSlice } from "@/stores/misc/slices/CreateModalSlice";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface MiscState extends ModalStateSlice { }

export const useMiscStore = create<MiscState>()(
    devtools(
        (...a) => ({
            ...createMiscSlice(...a),
        }),
    )
)