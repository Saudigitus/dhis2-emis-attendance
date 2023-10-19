import React, { useState, useEffect } from 'react'
import { VariablesTypes } from '../../../types/table/AttributeColumns'
import { getDisplayName } from '../../../utils/table/rows/getDisplayNameByOption';
import { AccessTime, CheckCircleOutline, HighlightOff } from '@material-ui/icons';
import MultipleButtons from '../components/multipleButtom/MultipleButtons';
import { getSelectedKey } from '../../../utils/commons/dataStore/getSelectedKey';
import { SelectedDateAddNewState } from '../../../schema/attendanceSchema';
import { useRecoilValue } from 'recoil';
import { format } from 'date-fns';
import useCreateDataValues from '../../../hooks/attendanceMode/useCreateEvents';
import useUpdateEvents from '../../../hooks/attendanceMode/useUpdateEvents';
import { useAttendanceConst } from '../../../utils/constants/attendance/attendanceConst';

interface AttendanceEditModeProps {
    value: string | any
    column: {
        type: string
        id: "attendance-status" | "reason-absence" | any
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
    rowsData: any[]
    setTableData: any
}

function AttendanceEditMode(props: AttendanceEditModeProps) {
    const { column, value, rowsData, setTableData } = props
    const [selectedTerm, setselectedTerm] = useState<string>("")
    const { getDataStoreData } = getSelectedKey()
    const attendanceId = getDataStoreData.attendance.status
    const absentId = getDataStoreData.attendance.absenceReason
    const { selectedDate } = useRecoilValue(SelectedDateAddNewState)
    const { createValues } = useCreateDataValues()
    const { updateValues } = useUpdateEvents()
    const { attendanceConst } = useAttendanceConst()

    const date = format(new Date(selectedDate), "yyyy-MM-dd")

    function getValueBySelectedDate() {
        const valueByDate = value?.[date]

        if (props.column.id === attendanceId) {
            setselectedTerm(valueByDate?.status)
        } else if (props.column.id === absentId) {
            setselectedTerm(valueByDate?.absenceOption)
        }
    }

    function onChangeAttendance(v: string, type: string) {
        if (value[date]?.eventId) {
            void updateValues({
                dataElementId: props.column.id,
                dataElementValue: v,
                rowsData,
                setTableData,
                teiDetails: value,
                typeField: type,
                setselectedTerm
            })
        } else {
            void createValues({
                dataElementId: props.column.id,
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
                ? attendanceOptionIcons(props, selectedTerm, onChangeAttendance, attendanceId, value?.[date], attendanceConst)
                : getDisplayName({ attribute: column, value: value[column.id] })
            }
        </>
    )
}

export default AttendanceEditMode

function attendanceOptionIcons(props: AttendanceEditModeProps, selectedTerm: string,
    setselectedTerm: any, attendanceId: string, value: any, attendanceConst: any) {
    return (
        props.column.id === attendanceId
            ? <MultipleButtons
                id={props.column.id}
                items={itemsAttendance(props.column, attendanceConst)}
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

function itemsAttendance(options: AttendanceEditModeProps["column"], attendanceConst: any) {
    const codeComponent = {
        [attendanceConst("present") as string]: <CheckCircleOutline style={{ color: "#21B26D" }} />,
        [attendanceConst("late") as string]: <AccessTime style={{ color: "#EAB631" }} />,
        [attendanceConst("absent") as string]: <HighlightOff style={{ color: "#F05C5C" }} />
    }

    return options.options?.optionSet.options.map((option) => {
        return {
            code: option.value,
            type: "attendance",
            Component: codeComponent[option.value]
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
