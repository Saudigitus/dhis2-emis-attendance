import React from 'react'
import {VariablesTypes} from '../../../types/variables/AttributeColumns'
import {type AttendanceViewModeProps} from '../../../types/table/TableRenderTypes';
import {getDisplayName} from '../../../utils/table/rows/getDisplayNameByOption';
import {useAttendanceConst} from '../../../utils/constants/attendance/attendanceConst';
import {RemoveCircleOutline} from '@material-ui/icons';
import {useRecoilValue} from 'recoil';
import {ReasonOfAbsenseState} from '../../../schema/reasonOfAbsenseSchema';
import {Chip, Tooltip} from '@mui/material';
import styles from './attendance.module.css'
import {formatKeyValueTypeHeader} from '../../../utils/programRules/formatKeyValueType';
import {Attribute} from '../../../types/generated/models';
import {GetImageUrl} from '../../../utils/table/rows/getImageUrl';
import {IconButton} from '@material-ui/core';
import CropOriginal from '@material-ui/icons/CropOriginal';
import {ProgramConfigState} from '../../../schema/programSchema';
import {getSelectedKey} from "../../../utils/commons/dataStore/getSelectedKey";
import {getIcon} from "../../../utils/table/attendance/getIcom";
import {type DataStoreRecord} from "../../../types/dataStore/DataStoreConfig";

function AttendanceViewMode(props: AttendanceViewModeProps) {
    const {
        column,
        value,
        headers,
        trackedEntity
    } = props
    const {attendanceConst} = useAttendanceConst()
    const seeReason = useRecoilValue(ReasonOfAbsenseState)
    const {imageUrl} = GetImageUrl()
    const programConfigState = useRecoilValue(ProgramConfigState);
    const {getDataStoreData} = getSelectedKey()

    return (
        <>
            {column.type === VariablesTypes.Attendance
                ? attendanceOptionIcons(getDataStoreData, value?.status, attendanceConst, value?.absenceOption, seeReason as unknown as boolean, programConfigState)
                : formatKeyValueTypeHeader(headers)[column.id] === Attribute.valueType.IMAGE
                    ? <a href={imageUrl({
                        attribute: column.id,
                        trackedEntity
                    })} target='_blank' rel="noreferrer">{value && <IconButton> <CropOriginal/></IconButton>}</a>
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

function attendanceOptionIcons(getDataStoreData: DataStoreRecord, value: string, attendanceConst: any, absenceOption: string, seeReason: boolean, program: any) {
    const attendance = getDataStoreData.attendance.statusOptions.find(x => x.code === value)
    const programOptionsSets: string[] | undefined = program.programStages.find((x: any) => x.id === getDataStoreData.attendance.programStage)?.programStageDataElements?.find((x: any) => x?.dataElement?.id === getDataStoreData.attendance.status)?.dataElement?.optionSet?.options as unknown as []

    if (attendance !== undefined && programOptionsSets?.filter((x: any) => x.value === value)?.length > 0) {
        if (value === attendanceConst("absent")) {
            return <div>
                {seeReason
                    ? <Chip
                        // eslint-disable-next-line
                        label={absenceOption
                            ? absenceOption.substring(0, 1) + absenceOption.substring(1, absenceOption.length).toLowerCase()
                            : '- -'
                        } size='small' className={styles.reasonOfAbsense}/>
                    : getIcon(attendance)
                }
            </div>
        } else {
            return getIcon(attendance)
        }
    } else {
        return <Tooltip title='Empty'>
            <RemoveCircleOutline className={styles.empty}/>
        </Tooltip>
    }
}
