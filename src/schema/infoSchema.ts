import { atom } from "recoil"

export const InfoState = atom<string>({
    key: "info-state",
    default: ""
})
