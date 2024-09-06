export function getEventsToUpate(excelEvents: any, apiEvents: any, statusId: string) {
    let newEvents = [...excelEvents]
    let eventsToUpdate: any = []

    Object.keys(apiEvents ?? {}).map((teiId) => {

        Object.keys(apiEvents[teiId] ?? {}).map((eventDay) => {
            const ExcelEventIndex = newEvents.findIndex((x: any) => x.eventDate === eventDay && x.trackedEntityInstance === teiId)

            if (ExcelEventIndex !== -1) {
                eventsToUpdate = [...eventsToUpdate, {
                    ...newEvents[ExcelEventIndex], event: apiEvents[teiId][eventDay]?.eventId,
                }]

                newEvents.splice(ExcelEventIndex, 1)
            }
        })
    })

    return { new: newEvents, toUpdate: eventsToUpdate }
}