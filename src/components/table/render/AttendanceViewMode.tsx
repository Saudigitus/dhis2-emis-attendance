import React from 'react'
import { VariablesTypes } from '../../../types/variables/AttributeColumns'
import { AttendanceViewModeProps } from '../../../types/table/TableRenderTypes';
import { getDisplayName } from '../../../utils/table/rows/getDisplayNameByOption';
import { useAttendanceConst } from '../../../utils/constants/attendance/attendanceConst';
import { AccessTime, CheckCircleOutline, HighlightOff, RemoveCircleOutline } from '@material-ui/icons';

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
