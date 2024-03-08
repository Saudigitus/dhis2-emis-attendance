import { AttendanceFormaterProps, AttributesProps, FormatResponseRowsProps, RowsDataProps } from "../../../types/utils/table/FormatRowsDataTypes";

// TODO @edsonnhancale remove this attendanceConfig from this function
export function formatResponseRows({ eventsInstances, teiInstances, attendanceValues, attendanceConfig }: FormatResponseRowsProps): RowsDataProps[] {
    const allRows: RowsDataProps[] = []
    for (const event of eventsInstances || []) {
        const teiDetails = teiInstances.find((tei: any) => tei.trackedEntity === event.trackedEntity)
        const attendanceDetails = attendanceValues.filter((attendance: any) => attendance.trackedEntity === event.trackedEntity)
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

function attributes(data: AttributesProps[]): RowsDataProps {
    const localData: RowsDataProps = {}
    for (const attribute of data) {
        localData[attribute.attribute] = attribute.value
    }
    return localData
}

export function attendanceFormater(data: AttendanceFormaterProps[], attendanceConfig: FormatResponseRowsProps["attendanceConfig"]): RowsDataProps {
    const localData: RowsDataProps = {}
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
