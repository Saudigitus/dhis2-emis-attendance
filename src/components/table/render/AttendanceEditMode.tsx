import React, {useState, useEffect} from 'react'
import {format} from 'date-fns';
import {useRecoilValue} from 'recoil';
import {useCreateDataValues, useUpdateEvents} from '../../../hooks';
import {VariablesTypes} from '../../../types/variables/AttributeColumns'
import MultipleButtons from '../components/multipleButtom/MultipleButtons';
import {SelectedDateAddNewState} from '../../../schema/attendanceSchema';
import {type AttendanceEditModeProps} from '../../../types/table/TableRenderTypes';
import {type AttendanceOptionsProps} from '../../../types/variables/AttributeColumns';
import {getSelectedKey} from '../../../utils/commons/dataStore/getSelectedKey';
import {getDisplayName} from '../../../utils/table/rows/getDisplayNameByOption';
import {useAttendanceConst} from '../../../utils/constants/attendance/attendanceConst';
import {ProgramConfigState} from '../../../schema/programSchema';
import {checkCanceled} from "../../../utils/table/rows/checkCanceled";
import {getIcon} from "../../../utils/table/attendance/getIcom";

function AttendanceEditMode(props: AttendanceEditModeProps) {
    const {
        column,
        value,
        rowsData,
        setTableData
    } = props
    const [selectedTerm, setselectedTerm] = useState<string>("")
    const {getDataStoreData} = getSelectedKey()
    const attendanceId = getDataStoreData.attendance.status
    const absentId = getDataStoreData.attendance.absenceReason
    const dataStoreOptions = getDataStoreData.attendance.statusOptions
    const {selectedDate} = useRecoilValue(SelectedDateAddNewState)
    const {createValues} = useCreateDataValues()
    const {updateValues} = useUpdateEvents()
    const {attendanceConst} = useAttendanceConst()
    const programConfigState = useRecoilValue(ProgramConfigState);

    const date = format(new Date(selectedDate), "yyyy-MM-dd")

    function getValueBySelectedDate() {
        const valueByDate = value?.[date]

        if (column.id === attendanceId) {
            setselectedTerm(valueByDate?.status)
        } else if (column.id === absentId) {
            setselectedTerm(valueByDate?.absenceOption)
        }
    }

    function onChangeAttendance(v: string, type: string) {
        // eslint-disable-next-line
        if (value[date]?.eventId) {
            void updateValues({
                dataElementId: column.id,
                dataElementValue: v,
                rowsData,
                setTableData,
                teiDetails: value,
                typeField: type,
                setselectedTerm
            })
        } else {
            void createValues({
                dataElementId: column.id,
                dataElementValue: v,
                rowsData,
                setTableData,
                teiDetails: value,
                typeField: type,
                setselectedTerm
            })
        }
    }

    useEffect(() => {
        getValueBySelectedDate()
    }, [value, selectedDate])

    return (
        <>
            {column.type === VariablesTypes.Attendance
                ? attendanceOptionIcons(props, selectedTerm, dataStoreOptions, onChangeAttendance, attendanceId, value?.status, value?.[date], attendanceConst)
                : getDisplayName({
                    metaData: column.id,
                    value: value[column.id],
                    program: programConfigState
                })
            }
        </>
    )
}

export default AttendanceEditMode

function attendanceOptionIcons(props: AttendanceEditModeProps, selectedTerm: string, dataStoreOptions: AttendanceOptionsProps[],
                               setselectedTerm: any, attendanceId: string, enrollmentStatus: string, value: any, attendanceConst: any) {
    return (
        props.column.id === attendanceId
            ? <MultipleButtons
                id={props.column.id}
                items={itemsAttendance(dataStoreOptions, props.column, checkCanceled(enrollmentStatus))}
                selectedTerm={selectedTerm}
                setSelectedTerm={setselectedTerm}
                disabled={checkCanceled(enrollmentStatus)}
            />
            : value?.status === attendanceConst("absent") &&
            <MultipleButtons
                id={props.column.id}
                items={itemsAbsence(props.column)}
                selectedTerm={selectedTerm}
                setSelectedTerm={setselectedTerm}
                disabled={checkCanceled(enrollmentStatus)}
            />
    )
}

function itemsAttendance(dataStoreOptions: AttendanceOptionsProps[], programOptions: AttendanceEditModeProps["column"], disabled: boolean) {
    return dataStoreOptions?.map((option) => {
        return {
            code: option.code,
            type: "attendance",
            Component: getIcon(option, disabled)
        }
    }) as []
}

function itemsAbsence(options: AttendanceEditModeProps["column"]) {
    return options.options?.optionSet.options.map((option) => {
        return {
            code: option.value,
            type: "absence",
            Component: option.label
        }
    }) as []
}
