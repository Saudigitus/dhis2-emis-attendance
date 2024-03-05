import { atom } from "recoil"
import { HeaderFieldsType } from "../types/headerFields/HeaderFieldsTypes"

export const HeaderFieldsState = atom<HeaderFieldsType>({
    key: "headerFieldsState-get-state",
    default: {
        dataElements: [],
        attributes: []
    }
})
