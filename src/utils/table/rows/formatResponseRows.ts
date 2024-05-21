import { type AttendanceFormaterProps, type AttributesProps, type FormatResponseRowsProps, type RowsDataProps } from "../../../types/utils/table/FormatRowsDataTypes";

// TODO @edsonnhancale remove this attendanceConfig from this function
export function formatResponseRows({ eventsInstances, teiInstances, attendanceValues, attendanceConfig }: FormatResponseRowsProps): RowsDataProps[] {
    const allRows: RowsDataProps[] = []
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    for (const event of eventsInstances || []) {
        const teiDetails = teiInstances.find((tei: any) => tei.trackedEntity === event.trackedEntity)
        const attendanceDetails = attendanceValues.filter((attendance: any) => attendance.trackedEntity === event.trackedEntity).filter((attendance: any) => attendance.enrollment === event.enrollment)
       
        allRows.push({
            ...(attributes((teiDetails?.attributes) ?? [])),
            ...attendanceFormater(attendanceDetails, attendanceConfig),
            trackedEntity: event.trackedEntity,
            enrollmentId: event?.enrollment,
            orgUnitId: event?.orgUnit,
            programId: event?.program,
            status: teiDetails?.enrollments.find(x => x.enrollment === event.enrollment)?.status
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
