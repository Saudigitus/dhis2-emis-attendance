import React from 'react'
import { VariablesTypes } from '../../../types/variables/AttributeColumns'
import { type AttendanceViewModeProps } from '../../../types/table/TableRenderTypes';
import { getDisplayName } from '../../../utils/table/rows/getDisplayNameByOption';
import { useAttendanceConst } from '../../../utils/constants/attendance/attendanceConst';
import { useRecoilValue } from 'recoil';
import { ReasonOfAbsenseState } from '../../../schema/reasonOfAbsenseSchema';
import { formatKeyValueTypeHeader } from '../../../utils/programRules/formatKeyValueType';
import { Attribute } from '../../../types/generated/models';
import { GetImageUrl } from '../../../utils/table/rows/getImageUrl';
import { IconButton } from '@material-ui/core';
import CropOriginal from '@material-ui/icons/CropOriginal';
import { ProgramConfigState } from '../../../schema/programSchema';
import { getSelectedKey } from "../../../utils/commons/dataStore/getSelectedKey";
import { getIcon } from "../../../utils/table/attendance/getIcom";
import { type DataStoreRecord } from "../../../types/dataStore/DataStoreConfig";

function AttendanceViewMode(props: AttendanceViewModeProps) {
    const { column, value, headers, trackedEntity } = props
    const { attendanceConst } = useAttendanceConst()
    const seeReason = useRecoilValue(ReasonOfAbsenseState)
    const { imageUrl } = GetImageUrl()
    const programConfigState = useRecoilValue(ProgramConfigState);
    const { getDataStoreData } = getSelectedKey()

    return (
        <>
            {column.type === VariablesTypes.Attendance
                ? attendanceOptionIcons(getDataStoreData, value?.status, attendanceConst, value?.absenceOption, seeReason as unknown as boolean, column?.schoolDay)
                : formatKeyValueTypeHeader(headers)[column.id] === Attribute.valueType.IMAGE
                    ? <a href={imageUrl({
                        attribute: column.id,
                        trackedEntity
                    })} target='_blank' rel="noreferrer">{value && <IconButton> <CropOriginal /></IconButton>}</a>
                    : getDisplayName({
                        metaData: column.id,
                        value,
                        program: programConfigState
                    })
            }
        </>
    )
}

export default AttendanceViewMode

function attendanceOptionIcons(getDataStoreData: DataStoreRecord, value: string, attendanceConst: any, absenceOption: string, seeReason: boolean, schoolDay: boolean | undefined) {
    const attendance = getDataStoreData.attendance.statusOptions.find(x => x.code === value)

    if (!schoolDay)
        return getIcon({ key: 'Non school day', code: 'NonSchoolDay' })
    else if (attendance !== undefined) {
        if (value === attendanceConst("absent"))
            return <div>
                {seeReason
                    ? getIcon({ key: absenceOption ?? '- -', code: 'Absense' })
                    : getIcon(attendance)
                }
            </div>
        else return getIcon(attendance)
    } else {
        return getIcon({
            key: 'Empty',
            code: 'Empty'
        })
    }
}
