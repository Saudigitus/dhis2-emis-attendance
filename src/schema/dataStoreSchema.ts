import { atom } from "recoil"
import { DataStoreRecord } from "../types/dataStore/DataStoreConfig"


export const DataStoreState = atom<DataStoreRecord[]>({
    key: "dataStore-get-state",
    default: []
})
