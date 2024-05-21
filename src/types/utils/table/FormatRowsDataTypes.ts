import { AttributesProps } from "../../api/WithRegistrationTypes"
import { DataValuesProps } from "../../api/WithoutRegistrationTypes"
import { Registration } from "../../dataStore/DataStoreConfig"
import { OptionsProps } from "../../variables/AttributeColumns"

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
            status: string
            events: any[]
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
    registrationIds?: Registration,
    academicYear?: string
}

type RowsDataProps = Record<string, string | number | boolean | any>;

interface DefaultProps {
    attribute: {
        id: string
        options?: {
            optionSet: {
                id: string
                options: OptionsProps[]
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

export type {
    FormatResponseRowsProps,
    RowsDataProps,
    DefaultProps,
    AttributesProps,
    DataValuesProps,
    AttendanceFormaterProps
}
