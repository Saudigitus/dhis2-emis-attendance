interface dataValuesProps {
    dataElement: string
    value: string
}

interface attributesProps {
    attribute: string
    value: string
}

interface attendanceFormaterProps {
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
        allRows.push({ ...dataValues(event.dataValues), ...(attributes((teiDetails?.attributes) ?? [])), ...attendanceFormater(attendanceDetails, attendanceConfig) })
    }
    console.log(allRows);
    return allRows;
}

function dataValues(data: dataValuesProps[]): RowsProps {
    const localData: RowsProps = {}
    for (const dataElement of data) {
        localData[dataElement.dataElement] = dataElement.value
    }
    return localData
}

function attributes(data: attributesProps[]): RowsProps {
    const localData: RowsProps = {}
    for (const attribute of data) {
        localData[attribute.attribute] = attribute.value
    }
    return localData
}

function attendanceFormater(data: attendanceFormaterProps[], attendanceConfig: formatResponseRowsProps["attendanceConfig"]): RowsProps {
    const localData: RowsProps = {}
    let status, absenceOption, eventId

    for (const event of data) {
        eventId = event.event
        for (const dataValue of event.dataValues) {
            if (attendanceConfig.status === dataValue.dataElement) {
                status = dataValue.value
            }

            if (attendanceConfig.absenceReason === dataValue.dataElement) {
                absenceOption = dataValue.value
            }
        }
        localData[event.occurredAt?.split("T")?.[0]] = { status, absenceOption, eventId }
    }
    return localData
}
