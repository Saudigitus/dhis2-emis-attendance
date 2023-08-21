import React, { useState } from 'react'
import { VariablesTypes } from '../../../types/table/AttributeColumns'
import { getDisplayName } from '../../../utils/table/rows/getDisplayNameByOption';
import { AccessTime, CheckCircleOutline, HighlightOff } from '@material-ui/icons';
import MultipleButtons from '../components/multipleButtom/MultipleButtons';
import { getSelectedKey } from '../../../utils/constants/dataStore/getSelectedKey';

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
}

interface ButtonProps {
    selectedTerm: any
    setSelectedTerm: (arg: any) => void
}

function AttendanceEditMode(props: AttendanceEditModeProps) {
    const { column, value } = props
    const [selectedTerm, setselectedTerm] = useState<ButtonProps>()
    const { getDataStoreData } = getSelectedKey()
    const attendanceId = getDataStoreData.attendance.status
    const absenceId = getDataStoreData.attendance.absenceReason

    return (
        <>
            {column.type === VariablesTypes.Attendance
                ? attendanceOptionIcons(props, selectedTerm, setselectedTerm, attendanceId, absenceId)
                : getDisplayName({ attribute: column, value })
            }
        </>
    )
}

export default AttendanceEditMode

function attendanceOptionIcons(props: AttendanceEditModeProps, selectedTerm: ButtonProps["selectedTerm"],
    setselectedTerm: ButtonProps["setSelectedTerm"], attendanceId: string, absenceId: string) {
    if (props.column.id === attendanceId) {
        return <MultipleButtons
            items={itemsAttendance}
            selectedTerm={selectedTerm}
            setSelectedTerm={setselectedTerm}
        />
    }

    if (props.column.id === absenceId) {
        return <MultipleButtons
            items={itemsAbsence(props.column)}
            selectedTerm={selectedTerm}
            setSelectedTerm={setselectedTerm}
        />
    }
    return null
}

const itemsAttendance = [
    {
        id: "present",
        type: "attendance-button",
        Component: <CheckCircleOutline style={{ color: "#21B26D" }} />
    },
    {
        id: "late",
        type: "attendance-button",
        Component: <AccessTime style={{ color: "#EAB631" }} />
    },
    {
        id: "absence",
        type: "attendance-button",
        Component: <HighlightOff style={{ color: "#F05C5C" }} />
    }
]

function itemsAbsence(options: AttendanceEditModeProps["column"]) {
    return options.options?.optionSet.options.map((option) => {
        return {
            id: option.value,
            type: "absence-button",
            Component: option.label
        }
    }) as []
}
