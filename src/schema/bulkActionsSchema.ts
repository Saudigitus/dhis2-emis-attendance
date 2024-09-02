import { atom } from "recoil"

export const bulkActionsState = atom<string | null>({
    key: "bulk-state",
    default: null
})
