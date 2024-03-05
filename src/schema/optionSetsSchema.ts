import { atom } from "recoil"
import { OptionSetsRecord } from "../types/optionSets/OptionSetsTypes"

export const OptionSetsState = atom<OptionSetsRecord | undefined>({
    key: "optionSetsSchema-state",
    default: undefined
})
