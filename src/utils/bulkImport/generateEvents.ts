import { utils } from "xlsx";
import type { Attendance } from "../../types/dataStore/DataStoreConfig";
import { getOptionCode } from "../exporter/getFilterLables";

export function getSheetData(names: string[], sheets: any, program: string, attendanceConfig: Attendance): { attendanceEvents: any[], trackedEntityIds: { tei: string, enrollment: string }[], dateRange: { sDate: string, eDate: string } } {
    let attendanceEvents: any = []
    let teis: { tei: string, enrollment: string }[] = []

    function get1stDateIndex(headers: string[]) {
        const regex = /^\d{4}-\d{2}-\d{2}$/

        for (let index = 0; index < headers?.length; index++)
            if (regex.test(headers?.[index])) return index

        return -1
    }

    function getDateRange() {
        let dateRange: any = { sDate: Date, eDate: Date }

        if (names.length > 1) {
            const firstSheet = utils.sheet_to_json(sheets[names[0]], { header: 1, raw: false, dateNF: 'yyyy-mm-dd', defval: "" }) as unknown as Array<any>;
            const lastSheet = utils.sheet_to_json(sheets[names[names?.length - 1]], { header: 1, raw: false, dateNF: 'yyyy-mm-dd', defval: "" }) as unknown as Array<any>;
            const indexOf1stDateInSheet = get1stDateIndex(firstSheet[1])

            dateRange.sDate = new Date(firstSheet[1][indexOf1stDateInSheet])
            dateRange.eDate = new Date(lastSheet[1][lastSheet[1].length - 1])
        } else {
            const rawData = utils.sheet_to_json(sheets[names[0]], { header: 1, raw: false, dateNF: 'yyyy-mm-dd', defval: "" }) as unknown as Array<any>;
            const indexOf1stDateInSheet = get1stDateIndex(rawData[1])

            dateRange.sDate = new Date(rawData[1][indexOf1stDateInSheet])
            dateRange.eDate = new Date(rawData[1][rawData[1]?.length - 1])
        }

        return dateRange
    }

    for (const name of names) {
        const rawData = utils.sheet_to_json(sheets[name], { header: 1, raw: false, dateNF: 'yyyy-mm-dd', defval: "" }) as unknown as Array<any>;
        const indexOf1stDateInSheet = get1stDateIndex(rawData[1])

        if (indexOf1stDateInSheet === -1) continue
        else for (let index = 2; index < rawData?.length; index++) {
            for (let cell = indexOf1stDateInSheet; cell < rawData[index]?.length; cell++) {

                if (rawData[index][cell] == 'Non School Day' || !rawData[index][cell])
                    continue
                else {
                    if (teis.findIndex(x => x.tei === rawData[index][6]) === -1)
                        teis.push({ tei: rawData[index][6], enrollment: rawData[index][5] })

                    attendanceEvents.push(
                        {
                            trackedEntityInstance: rawData[index][6],
                            program: program,
                            programStage: attendanceConfig.programStage,
                            orgUnit: rawData[index][7],
                            enrollment: rawData[index][5],
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
