import { atom } from "recoil"

export interface HeaderFieldsSchema {
    dataElements: any[]
    attributes: any[]
}

export const HeaderFieldsState = atom<HeaderFieldsSchema>({
    key: "headerFieldsState-get-state",
    default: {
        dataElements: [],
        attributes: []
    }
})
