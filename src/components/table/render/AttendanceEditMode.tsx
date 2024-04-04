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
import {AccessTime, CheckCircleOutline, HighlightOff} from '@material-ui/icons';
import {useAttendanceConst} from '../../../utils/constants/attendance/attendanceConst';
import {Tooltip} from '@mui/material';
import {ProgramConfigState} from '../../../schema/programSchema';

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
    const statusOptions = getDataStoreData.attendance.statusOptions
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
                ? attendanceOptionIcons(props, selectedTerm, statusOptions, onChangeAttendance, attendanceId, value?.[date], attendanceConst)
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

function attendanceOptionIcons(props: AttendanceEditModeProps, selectedTerm: string, statusOptions: any,
                               setselectedTerm: any, attendanceId: string, value: any, attendanceConst: any) {
    console.log(props.column)
    return (
        props.column.id === attendanceId
            ? <MultipleButtons
                id={props.column.id}
                items={itemsAttendance(statusOptions, attendanceConst)}
                selectedTerm={selectedTerm}
                setSelectedTerm={setselectedTerm}
            />
            : value?.status === attendanceConst("absent") &&
            <MultipleButtons
                id={props.column.id}
                items={itemsAbsence(props.column)}
                selectedTerm={selectedTerm}
                setSelectedTerm={setselectedTerm}
            />
    )
}

function itemsAttendance(options: AttendanceOptionsProps[], attendanceConst: any) {
    const codeComponent = {
        [attendanceConst("present") as string]: <Tooltip title='Present'>
            <CheckCircleOutline style={{color: "#21B26D"}}/>
        </Tooltip>,
        [attendanceConst("late") as string]: <Tooltip title='Late'>
            <AccessTime style={{color: "#EAB631"}}/>
        </Tooltip>,
        [attendanceConst("absent") as string]: <Tooltip title='Absent'>
            <HighlightOff style={{color: "#F05C5C"}}/>
        </Tooltip>
    }

    return options.map((option) => {
        return {
            code: option.code,
            type: "attendance",
            Component: codeComponent[option.code]
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
