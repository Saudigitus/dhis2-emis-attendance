interface AttendanceEditModeProps {
    value: string | any
    column: {
        type: string
        id: "attendance-status" | "reason-absence" | any
        options?: {
            optionSet: {
                id: string
                options: [{
                    value: string
                    label: string
                }]
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
                options: [{
                    value: string
                    label: string
                }]
            }
        }
    }
}


export type { AttendanceEditModeProps, AttendanceViewModeProps}