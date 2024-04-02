import React from 'react'
import { VariablesTypes } from '../../../types/variables/AttributeColumns'
import { AttendanceViewModeProps } from '../../../types/table/TableRenderTypes';
import { getDisplayName } from '../../../utils/table/rows/getDisplayNameByOption';
import { useAttendanceConst } from '../../../utils/constants/attendance/attendanceConst';
import { AccessTime, CheckCircleOutline, HighlightOff, RemoveCircleOutline } from '@material-ui/icons';
import { useRecoilValue } from 'recoil';
import { ReasonOfAbsenseState } from '../../../schema/reasonOfAbsenseSchema';
import { Chip, Tooltip } from '@mui/material';
import styles from './attendance.module.css'
import { formatKeyValueTypeHeader } from '../../../utils/programRules/formatKeyValueType';
import { Attribute } from '../../../types/generated/models';
import { GetImageUrl } from '../../../utils/table/rows/getImageUrl';
import { IconButton } from '@material-ui/core';
import CropOriginal from '@material-ui/icons/CropOriginal';

function AttendanceViewMode(props: AttendanceViewModeProps) {
    const { column, value, headers, trackedEntity } = props
    const { attendanceConst } = useAttendanceConst()
    const seeReason = useRecoilValue(ReasonOfAbsenseState)
    const { imageUrl } = GetImageUrl()

    return (
        <>
            {column.type === VariablesTypes.Attendance
                ? attendanceOptionIcons(value?.status, attendanceConst, value?.absenceOption, seeReason as unknown as boolean)
                : formatKeyValueTypeHeader(headers)[column.id] === Attribute.valueType.IMAGE ?
                    <a href={imageUrl({ attribute: column.id, trackedEntity })} target='_blank'>{value && <IconButton> <CropOriginal /></IconButton>}</a>
                    : getDisplayName({ attribute: column, value })
            }
        </>
    )
}

export default AttendanceViewMode

function attendanceOptionIcons(value: string, attendanceConst: any, absenceOption: string, seeReason: boolean) {
    if (value === attendanceConst("late")) {
        return <Tooltip title='Late'>
            <AccessTime className={styles.late} />
        </Tooltip>
    }
    if (value === attendanceConst("present")) {
        return <Tooltip title='Present'>
            <CheckCircleOutline className={styles.present} />
        </Tooltip>
    }
    if (value === attendanceConst("absent")) {
        return <div>
            {seeReason ? <Chip label={absenceOption ?
                absenceOption.substring(0, 1) + absenceOption.substring(1, absenceOption.length).toLowerCase()
                :
                '- -'
            } size='small' className={styles.reasonOfAbsense} />
                : <Tooltip title='Absent'>
                    <HighlightOff className={styles.absent} />
                </Tooltip>
            }
        </div>
    }
    return <Tooltip title='Empty'>
        <RemoveCircleOutline className={styles.empty} />
    </Tooltip>

}
