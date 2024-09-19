import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { HeaderFieldsState } from "../../schema/headersSchema"
import { useGetEvents } from "../events/useGetEvents"
import { getSelectedKey } from "../../utils/commons/dataStore/getSelectedKey"
import { useGetEnrollmentData } from "../enrollment/useGetEnrollmentData"
import { generateHeaders } from "../../utils/exporter/generateExcelHeaders"
import { gererateFile } from "../tableData/tableExporter"
import { useAttendanceMode } from "../attendanceMode/useAttendanceMode"
import { ProgramConfigState } from "../../schema/programSchema"
import { getAttendanceDays } from "../../utils/table/header/formatResponse"
import { generateAttendanceDays } from "../../utils/table/header/generateAttendanceDays"
import { useTableData } from "../tableData/useTableData"
import { ProgressState } from "../../schema/linearProgress"
import { getFilterLables } from "../../utils/exporter/getFilterLables"

export function dataExporter({ school, selectedDates }: { school: string, selectedDates: { startDate: Date, endDate: Date, key: string }[] }) {
    const { eventsResults } = useGetEvents()
    const headerFieldsState = useRecoilValue(HeaderFieldsState)
    const { getDataStoreData } = getSelectedKey()
    const { getEnrollmentDetails } = useGetEnrollmentData()
    const { getHeaders } = generateHeaders()
    const { attendanceMode } = useAttendanceMode()
    const programConfigState = useRecoilValue(ProgramConfigState);
    const { getValidDaysToExport } = generateAttendanceDays()
    const { getAttendanceData } = useTableData()
    const [, updateProgress] = useRecoilState(ProgressState)
    const { ExcelGenerator } = gererateFile()

    async function exporter() {
        updateProgress({ buffer: 15, progress: 0, stage: 'export' })

        const events = await eventsResults(
            false,
            "" as unknown as number,
            "" as unknown as number,
            school,
            headerFieldsState,
            getDataStoreData?.registration?.programStage,
            "trackedEntity,enrollment,orgUnit,program",
            school != null ? "SELECTED" : "ACCESSIBLE"
        )

        updateProgress({ buffer: 15, progress: 10, stage: 'export' })

        const response = await getAttendanceData({
            dealingWithExcel: true, trackedEntityIds: events?.map((x: { trackedEntity: string, enrollment: string }) => {
                return { tei: x.trackedEntity, enrollment: x.enrollment }
            }), sDate: selectedDates?.[0].startDate, eDate: selectedDates?.[0].endDate
        })

        let headers = getHeaders()
        const rows = await getEnrollmentDetails(events, response)
        let filters = getFilterLables(getDataStoreData.attendance.statusOptions)

        headers = [...headers, {
            name: 'Attendance', headers: getAttendanceDays(getValidDaysToExport(selectedDates?.[0].startDate, selectedDates?.[0].endDate), attendanceMode, programConfigState, getDataStoreData.attendance.programStage).map((x) => {
                return {
                    header: x.displayName,
                    key: x.id,
                    width: 25,
                }
            })
        }]

        await ExcelGenerator(headers, rows, filters)
    }

    return { exporter }
}