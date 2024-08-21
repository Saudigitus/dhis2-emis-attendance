import { useRecoilValue } from "recoil"
import { HeaderFieldsState } from "../../schema/headersSchema"
import { useGetEvents } from "../events/useGetEvents"
import { getSelectedKey } from "../../utils/commons/dataStore/getSelectedKey"
import { useGetEnrollmentData } from "../enrollment/useGetEnrollmentData"
import { generateHeaders } from "../../utils/exporter/generateExcelHeaders"
import { ExcelGenerator } from "../tableHeader/tableExporter"
import { useEffect } from 'react'

export function dataExporter({ school }: { school: string }) {
    const { eventsResults } = useGetEvents()
    const headerFieldsState = useRecoilValue(HeaderFieldsState)
    const { getDataStoreData } = getSelectedKey()
    const { getEnrollmentDetails, excelData } = useGetEnrollmentData()
    const { getHeaders } = generateHeaders()

    useEffect(() => {
        if (excelData?.length > 0) {
            const headers = getHeaders()
            
            void ExcelGenerator(headers, excelData)
        }
    }, [excelData])

    async function exporter() {
        const events = await eventsResults(false,
            "" as unknown as number,
            "" as unknown as number,
            school,
            headerFieldsState,
            getDataStoreData?.registration?.programStage,
            "trackedEntity,enrollment,orgUnit,program",
            school != null ? "SELECTED" : "ACCESSIBLE"
        )

        void getEnrollmentDetails(events)
    }

    return { exporter }
}