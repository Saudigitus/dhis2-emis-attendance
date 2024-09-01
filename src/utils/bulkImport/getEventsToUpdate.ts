export function getEventsToUpate(excelEvents: any, apiEvents: any, statusId: string) {
    let newEvents = [...excelEvents]
    let eventsToUpdate: any = []

    Object.keys(apiEvents ?? {}).map((teiId) => {

        Object.keys(apiEvents[teiId] ?? {}).map((eventDay) => {
            const ExcelEventIndex = newEvents.findIndex((x: any) => x.eventDate === eventDay && x.trackedEntityInstance === teiId)

            if (ExcelEventIndex !== -1) {
                if (apiEvents[teiId][eventDay]?.status != newEvents[ExcelEventIndex]?.dataValues[0].value) {
                    eventsToUpdate = [...eventsToUpdate, {
                        event: newEvents[ExcelEventIndex],
                        id: `${apiEvents[teiId][eventDay]?.eventId}/${statusId}`
                    }]
                }

                newEvents.splice(ExcelEventIndex, 1)
            }
        })
    })

    return { new: newEvents, toUpdate: eventsToUpdate }
}