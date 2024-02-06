import { atom } from "recoil"
import { type ProgramConfig } from "../types/programConfig/ProgramConfig"

export const ProgramConfigState = atom<ProgramConfig>({
    key: "programConfig-get-state",
    default: undefined
})
