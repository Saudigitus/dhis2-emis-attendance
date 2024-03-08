import { AttributesProps } from "../../api/WithRegistrationTypes"
import { DataValuesProps } from "../../api/WithoutRegistrationTypes"

interface FormatResponseRowsProps {
    eventsInstances: [{
        trackedEntity: string
        dataValues: DataValuesProps[]
    }]
    teiInstances: [{
        trackedEntity: string
        attributes: AttributesProps[]
        enrollments: [{
            enrollment: string
            orgUnit: string
            program: string
        }]
    }]
    attendanceValues: [{
        trackedEntity: string
        occurredAt: string
        dataValues: DataValuesProps[]
        event: string
    }]
    attendanceConfig: {
        absenceReason: string
        programStage: string
        status: string
        statusOptions: [{
            code: string
            icon: string
        }]
    }
}

type RowsDataProps = Record<string, string | number | boolean | any>;

interface DefaultProps {
    attribute: {
        id: string
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
    value: string | any
}

interface AttendanceFormaterProps {
    dataValues: DataValuesProps[]
    occurredAt: string
    trackedEntity: string
    event: string
}

export type { FormatResponseRowsProps, RowsDataProps, DefaultProps, AttributesProps, DataValuesProps, AttendanceFormaterProps }