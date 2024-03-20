import { OptionsProps } from "../variables/AttributeColumns"

interface AttendanceEditModeProps {
    value: string | any
    column: {
        type: string
        id: "attendance-status" | "reason-absence" | any
        options?: {
            optionSet: {
                id: string
                options: OptionsProps[]
            }
        }
    }
    rowsData: any[]
    setTableData: any
}


interface AttendanceViewModeProps {
    value: string | any
    column: {
        type: string
        id: string
        options?: {
            optionSet: {
                id: string
                options: OptionsProps[]
            }
        }
    }
}


export type { AttendanceEditModeProps, AttendanceViewModeProps}