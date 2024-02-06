interface dataValuesProps {
    dataElement: string
    value: string
}

interface attributesProps {
    attribute: string
    value: string
}

export interface attendanceFormaterProps {
    dataValues: dataValuesProps[]
    occurredAt: string
    trackedEntity: string
    event: string
}

interface formatResponseRowsProps {
    eventsInstances: [{
        trackedEntity: string
        dataValues: dataValuesProps[]
    }]
    teiInstances: [{
        trackedEntity: string
        attributes: attributesProps[]
        enrollments: [{
            enrollment: string
            orgUnit: string
            program: string
        }]
    }]
    attendanceValues: [{
        trackedEntity: string
        occurredAt: string
        dataValues: dataValuesProps[]
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

type RowsProps = Record<string, string | number | boolean | any>;

// TODO @edsonnhancale remove this attendanceConfig from this function
export function formatResponseRows({ eventsInstances, teiInstances, attendanceValues, attendanceConfig }: formatResponseRowsProps): RowsProps[] {
    const allRows: RowsProps[] = []
    for (const event of eventsInstances || []) {
        const teiDetails = teiInstances.find(tei => tei.trackedEntity === event.trackedEntity)
        const attendanceDetails = attendanceValues.filter(attendance => attendance.trackedEntity === event.trackedEntity)
        allRows.push({
            ...(attributes((teiDetails?.attributes) ?? [])),
            ...attendanceFormater(attendanceDetails, attendanceConfig),
            trackedEntity: event.trackedEntity,
            enrollmentId: teiDetails?.enrollments?.[0]?.enrollment,
            orgUnitId: teiDetails?.enrollments?.[0]?.orgUnit,
            programId: teiDetails?.enrollments?.[0]?.program
        })
    }
    return allRows;
}

function attributes(data: attributesProps[]): RowsProps {
    const localData: RowsProps = {}
    for (const attribute of data) {
        localData[attribute.attribute] = attribute.value
    }
    return localData
}

export function attendanceFormater(data: attendanceFormaterProps[], attendanceConfig: formatResponseRowsProps["attendanceConfig"]): RowsProps {
    const localData: RowsProps = {}
    let status, absenceOption, eventId

    for (const event of data) {
        eventId = event.event
        for (const dataValue of event.dataValues) {
            if (attendanceConfig?.status === dataValue.dataElement) {
                status = dataValue.value
            }

            if (attendanceConfig?.absenceReason === dataValue.dataElement) {
                absenceOption = dataValue.value
            }
        }
        localData[event.occurredAt?.split("T")?.[0]] = { status, absenceOption, eventId }
    }
    return localData
}
