import React from 'react'
import { VariablesTypes } from '../../../types/variables/AttributeColumns'
import { AttendanceViewModeProps } from '../../../types/table/TableRenderTypes';
import { getDisplayName } from '../../../utils/table/rows/getDisplayNameByOption';
import { useAttendanceConst } from '../../../utils/constants/attendance/attendanceConst';
import { AccessTime, CheckCircleOutline, HighlightOff, RemoveCircleOutline } from '@material-ui/icons';
import { Chip } from "@dhis2/ui";
import { useRecoilValue } from 'recoil';
import { ReasonOfAbsenseState } from '../../../schema/reasonOfAbsenseSchema';

function AttendanceViewMode(props: AttendanceViewModeProps) {
    const { column, value } = props
    const { attendanceConst } = useAttendanceConst()
    const seeReason = useRecoilValue(ReasonOfAbsenseState)

    return (
        <>
            {column.type === VariablesTypes.Attendance
                ? attendanceOptionIcons(value?.status, attendanceConst, value?.absenceOption, seeReason as unknown as boolean)
                : getDisplayName({ attribute: column, value })
            }
        </>
    )
}

export default AttendanceViewMode

function attendanceOptionIcons(value: string, attendanceConst: any, absenceOption: string, seeReason: boolean) {
    if (value === attendanceConst("late")) {
        return <AccessTime style={{ color: "#EAB631" }} />
    }
    if (value === attendanceConst("present")) {
        return <CheckCircleOutline style={{ color: "#21B26D" }} />
    }
    if (value === attendanceConst("absent")) {
        return <div>
            {seeReason ? <Chip dense selected >
                {absenceOption ? absenceOption : '- -'}
            </Chip>
                : <HighlightOff style={{ color: "#F05C5C" }} />}
        </div>
    }
    return <RemoveCircleOutline style={{ color: "#ADAEB0" }} />
}
