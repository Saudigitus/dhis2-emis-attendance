import { utils } from "xlsx";
import type { Attendance } from "../../types/dataStore/DataStoreConfig";
import { getOptionCode } from "../exporter/getFilterLables";

export function getSheetData(names: string[], sheets: any, attendanceConfig: Attendance) {
    let attendanceEvents: any[] = []

    for (const name of names) {
        const rawData = utils.sheet_to_json(sheets[name], { header: 1, raw: false, dateNF: 'yyyy-mm-dd', defval: "" }) as unknown as Array<any>;

        for (let index = 2; index < rawData.length; index++) {
            for (let cell = 12; cell < rawData[index]?.length; cell++) {

                if (rawData[index][cell] == 'Non School Day' || !rawData[index][cell])
                    continue
                else {
                    attendanceEvents.push(
                        {
                            trackedEntityInstance: rawData[index][6],
                            program: rawData[index][6],
                            programStage: rawData[index][6],
                            orgUnit: rawData[index][7],
                            enrollment: rawData[index][5],
                            dataValues: [
                                {
                                    dataElement: attendanceConfig.status,
                                    value: getOptionCode(rawData[index][cell], attendanceConfig.statusOptions)
                                }
                            ],
                            eventDate: rawData[1][cell]
                        }
                    )
                }
            }
        }
    }

    console.log(attendanceEvents)
}
