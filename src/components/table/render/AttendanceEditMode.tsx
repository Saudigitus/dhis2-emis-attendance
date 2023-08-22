import React, { useState, useEffect } from 'react'
import { VariablesTypes } from '../../../types/table/AttributeColumns'
import { getDisplayName } from '../../../utils/table/rows/getDisplayNameByOption';
import { AccessTime, CheckCircleOutline, HighlightOff } from '@material-ui/icons';
import MultipleButtons from '../components/multipleButtom/MultipleButtons';
import { getSelectedKey } from '../../../utils/constants/dataStore/getSelectedKey';
import { SelectedDateAddNewState } from '../../../schema/attendanceSchema';
import { useRecoilValue } from 'recoil';
import { format } from 'date-fns';
import useCreateDataValues from '../../../hooks/attendanceMode/useCreateEvents';

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

    const date = format(new Date(selectedDate), "yyyy-MM-dd")

    function getValueBySelectedDate() {
        const valueByDate = value?.[date]

        if (props.column.id === attendanceId) {
            setselectedTerm(valueByDate?.status)
        } else if (props.column.id === absentId) {
            setselectedTerm(valueByDate?.absenceOption)
        }
    }

    function onChangeAttendance(v: string) {
        void createValues({
            dataElementId: props.column.id,
            dataElementValue: v,
            rowsData,
            setTableData,
            teiDetails: value,
            typeField: column.type,
            setselectedTerm
        })
    }

    useEffect(() => {
        getValueBySelectedDate()
    }, [value, selectedDate])

    return (
        <>
            {column.type === VariablesTypes.Attendance
                ? attendanceOptionIcons(props, selectedTerm, onChangeAttendance, attendanceId)
                : getDisplayName({ attribute: column, value: value[column.id] })
            }
        </>
    )
}

export default AttendanceEditMode

function attendanceOptionIcons(props: AttendanceEditModeProps, selectedTerm: string,
    setselectedTerm: any, attendanceId: string) {
    return <MultipleButtons
        id={props.column.id}
        items={props.column.id === attendanceId ? itemsAttendance(props.column) : itemsAbsence(props.column)}
        selectedTerm={selectedTerm}
        setSelectedTerm={setselectedTerm}
    />
}

function itemsAttendance(options: AttendanceEditModeProps["column"]) {
    return options.options?.optionSet.options.map((option) => {
        return {
            code: option.value,
            type: "attendance",
            Component: codeComponent[option.value as "present" | "late" | "absent"]
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

const codeComponent = {
    present: <CheckCircleOutline style={{ color: "#21B26D" }} />,
    late: <AccessTime style={{ color: "#EAB631" }} />,
    absent: <HighlightOff style={{ color: "#F05C5C" }} />
}
