import React from 'react'
import { VariablesTypes } from '../../../types/table/AttributeColumns'
import { getDisplayName } from '../../../utils/table/rows/getDisplayNameByOption';
import { CheckCircleOutline, ErrorOutline, RemoveCircleOutline } from '@material-ui/icons';

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

function AttendanceViewMode(props: AttendanceViewModeProps) {
    const { column, value } = props
    return (
        <>
            {column.type === VariablesTypes.Attendance
                ? attendanceOptionIcons(value?.status)
                : getDisplayName({ attribute: column, value })
            }
        </>
    )
}

export default AttendanceViewMode

function attendanceOptionIcons(value: string) {
    if (value === "late") {
        return <ErrorOutline style={{ color: "#EAB631" }} />
    }
    if (value === "present") {
        return <CheckCircleOutline style={{ color: "#21B26D" }} />
    }
    if (value === "absent") {
        return <ErrorOutline style={{ color: "#F05C5C" }} />
    }
    return <RemoveCircleOutline style={{ color: "#ADAEB0" }} />
}
