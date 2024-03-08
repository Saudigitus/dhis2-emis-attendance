import { atom } from "recoil"
import { CustomAttributeProps } from "../types/variables/AttributeColumns"
import { RowProps } from "react-bootstrap"

export const TableColumnState = atom<CustomAttributeProps[]>({
    key: "tableColumn-state",
    default: []
})

export const TableDataState = atom<RowProps[]>({
    key: "tableData-state",
    default: []
})
