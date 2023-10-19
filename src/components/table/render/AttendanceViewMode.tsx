import React from 'react'
import { VariablesTypes } from '../../../types/table/AttributeColumns'
import { getDisplayName } from '../../../utils/table/rows/getDisplayNameByOption';
import { AccessTime, CheckCircleOutline, HighlightOff, RemoveCircleOutline } from '@material-ui/icons';
import { useAttendanceConst } from '../../../utils/constants/attendance/attendanceConst';

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
    const { attendanceConst } = useAttendanceConst()
    return (
        <>
            {column.type === VariablesTypes.Attendance
                ? attendanceOptionIcons(value?.status, attendanceConst)
                : getDisplayName({ attribute: column, value })
            }
        </>
    )
}

export default AttendanceViewMode

function attendanceOptionIcons(value: string, attendanceConst: any) {
    if (value === attendanceConst("late")) {
        return <AccessTime style={{ color: "#EAB631" }} />
    }
    if (value === attendanceConst("present")) {
        return <CheckCircleOutline style={{ color: "#21B26D" }} />
    }
    if (value === attendanceConst("absent")) {
        return <HighlightOff style={{ color: "#F05C5C" }} />
    }
    return <RemoveCircleOutline style={{ color: "#ADAEB0" }} />
}
