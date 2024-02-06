import { atom } from "recoil"

interface options {
    code: string
    name: string
    id: string
    displayName: string
}

export type optionSetsSchema = Record<string, {
    name: string
    id: string
    displayName: string
    options: options[]
}>

export const OptionSetsState = atom<optionSetsSchema | undefined>({
    key: "optionSetsSchema-state",
    default: undefined
})
