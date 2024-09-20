import { utils } from "xlsx";
import type { Attendance } from "../../types/dataStore/DataStoreConfig";
import { getOptionCode } from "../exporter/getFilterLables";

export function getSheetData(names: string[], sheets: any, program: string, attendanceConfig: Attendance): { attendanceEvents: any[], trackedEntityIds: { tei: string, enrollment: string }[], dateRange: { sDate: string, eDate: string } } {
    let attendanceEvents: any = []
    let teis: { tei: string, enrollment: string }[] = []

    function getDateIndex(headers: string[], position: string) {
        const regex = /^\d{4}-\d{2}-\d{2}$/

        if (position === '1st') {
            for (let index = 0; index < headers?.length; index++)
                if (regex.test(headers?.[index])) return index
        } else
            for (let index = headers?.length; index > 0; index--)
                if (regex.test(headers?.[index])) return index

        return -1
    }

    function getDateRange() {
        let dateRange: any = { sDate: Date, eDate: Date }

        if (names.length > 1) {
            const firstSheet = utils.sheet_to_json(sheets[names[0]], { header: 1, raw: false, dateNF: 'yyyy-mm-dd', defval: "" }) as unknown as Array<any>;
            const lastSheet = utils.sheet_to_json(sheets[names[names?.length - 1]], { header: 1, raw: false, dateNF: 'yyyy-mm-dd', defval: "" }) as unknown as Array<any>;
            const indexOf1stDateInSheet = getDateIndex(firstSheet[1], '1st')
            const indexOf2ndDateInSheet = getDateIndex(lastSheet[1], '2nd')

            dateRange.sDate = new Date(firstSheet[1][indexOf1stDateInSheet])
            dateRange.eDate = new Date(lastSheet[1][indexOf2ndDateInSheet])
        } else {
            const rawData = utils.sheet_to_json(sheets[names[0]], { header: 1, raw: false, dateNF: 'yyyy-mm-dd', defval: "" }) as unknown as Array<any>;
            const indexOf1stDateInSheet = getDateIndex(rawData[1], '1st')
            const indexOf2ndDateInSheet = getDateIndex(rawData[1], '2nd')

            dateRange.sDate = new Date(rawData[1][indexOf1stDateInSheet])
            dateRange.eDate = new Date(rawData[1][indexOf2ndDateInSheet])
        }

        return dateRange
    }

    for (const name of names) {
        const rawData = utils.sheet_to_json(sheets[name], { header: 1, raw: false, dateNF: 'yyyy-mm-dd', defval: "" }) as unknown as Array<any>;
        const indexOf1stDateInSheet = getDateIndex(rawData[1], '1st')

        if (indexOf1stDateInSheet === -1) continue
        else for (let index = 2; index < rawData?.length; index++) {
            for (let cell = indexOf1stDateInSheet; cell < rawData[index]?.length - 3; cell++) {

                if (rawData[index][cell] == 'Non School Day' || !rawData[index][cell])
                    continue
                else {
                    if (teis.findIndex(x => x.tei === rawData[index][rawData[index].length - 2]) === -1)
                        teis.push({
                            tei: rawData[index][rawData[index].length - 2],
                            enrollment: rawData[index][rawData[index].length - 3]
                        })

                    attendanceEvents.push(
                        {
                            trackedEntityInstance: rawData[index][rawData[index].length - 2],
                            program: program,
                            programStage: attendanceConfig.programStage,
                            orgUnit: rawData[index][rawData[index].length - 1],
                            enrollment: rawData[index][rawData[index].length - 3],
                            dataValues: [
                                {
                                    dataElement: attendanceConfig.status,
                                    value: getOptionCode(rawData[index][cell], attendanceConfig.statusOptions)
                                }
                            ],
                            eventDate: rawData[1][cell],
                            occurredAt: rawData[1][cell]
                        }
                    )
                }
            }
        }
    }

    return { attendanceEvents: attendanceEvents, trackedEntityIds: teis, dateRange: getDateRange() }
}
