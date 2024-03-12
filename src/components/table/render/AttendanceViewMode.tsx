import React from 'react'
import { VariablesTypes } from '../../../types/variables/AttributeColumns'
import { AttendanceViewModeProps } from '../../../types/table/TableRenderTypes';
import { getDisplayName } from '../../../utils/table/rows/getDisplayNameByOption';
import { useAttendanceConst } from '../../../utils/constants/attendance/attendanceConst';
import { AccessTime, CheckCircleOutline, HighlightOff, RemoveCircleOutline } from '@material-ui/icons';
import { useRecoilValue } from 'recoil';
import { ReasonOfAbsenseState } from '../../../schema/reasonOfAbsenseSchema';
import { Chip } from '@mui/material';
import styles from './attendance.module.css'

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
        return <AccessTime className={styles.late} />
    }
    if (value === attendanceConst("present")) {
        return <CheckCircleOutline className={styles.present} />
    }
    if (value === attendanceConst("absent")) {
        return <div>
            {seeReason ? <Chip label={absenceOption ?
                absenceOption.substring(0, 1) + absenceOption.substring(1, absenceOption.length).toLowerCase()
                :
                '- -'
            } size='small' className={styles.reasonOfAbsense} />
                : <HighlightOff className={styles.absent} />}
        </div>
    }
    return <RemoveCircleOutline className={styles.empty} />
}
