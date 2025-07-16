import { useEffect, useState } from "react";
import { useDataEngine } from "@dhis2/app-runtime";
import useShowAlerts from "../commons/useShowAlert";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useParams } from "../commons/useQueryParams";
import { HeaderFieldsState } from "../../schema/headersSchema";
import { TableDataState } from "../../schema/tableColumnsSchema";
import { getSelectedKey } from '../../utils/commons/dataStore/getSelectedKey';
import { formatResponseRows, attendanceFormater } from "../../utils/table/rows/formatResponseRows";
import { SelectedDateAddNewState, SelectedDateState } from "../../schema/attendanceSchema";
import { type AttendanceQueryResults } from "../../types/api/WithoutRegistrationTypes";
import { type TeiQueryProps, type TeiQueryResults } from "../../types/api/WithRegistrationTypes";
import { type AttendanceFormaterProps } from "../../types/utils/table/FormatRowsDataTypes";
import { EnrollmentDetailsTeisState } from "../../schema/enrollmentDetailsSchema";
import { useGetEvents } from "../events/useGetEvents";
import { getDates } from "../../utils/commons/getDates";
import { ProgressState } from "../../schema/linearProgress";
import { InfoState } from "../../schema/infoSchema";

type TableDataProps = Record<string, string>;

const TEI_QUERY = ({
    pageSize,
    program,
    trackedEntity,
}: TeiQueryProps) => ({
    results: {
        resource: "tracker/trackedEntities",
        params: {
            program,
            pageSize,
            trackedEntity,
            fields: "trackedEntity,createdAt,orgUnit,attributes[attribute,value],enrollments[enrollment,orgUnit,program,status]"
        }
    }
})

export function useTableData() {
    const engine = useDataEngine();
    const headerFieldsState = useRecoilValue(HeaderFieldsState)
    const [enrollmentTeis, setEnrollmentTeis] = useRecoilState(EnrollmentDetailsTeisState)
    const setTableColumnState = useSetRecoilState(TableDataState)
    const { selectedDate } = useRecoilValue(SelectedDateState)
    const selectedDateAddNew = useRecoilValue(SelectedDateAddNewState)
    const { urlParamiters } = useParams()
    const [loading, setLoading] = useState<boolean>(false)
    const [tableData, setTableData] = useState<TableDataProps[]>([])
    const { hide, show } = useShowAlerts()
    const school = urlParamiters().school as unknown as string
    const { getDataStoreData } = getSelectedKey()
    const attendanceConfig = getSelectedKey()?.getDataStoreData?.attendance
    const { getEvents, eventsResults } = useGetEvents()
    const updateProgress = useSetRecoilState(ProgressState)
    const sysInfo = useRecoilValue(InfoState);

    const showError = (error: any) => {
        show({
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            message: `${("Could not get data")}: ${error.message}`,
            type: { critical: true }
        });
        setTimeout(hide, 5000);
    }

    async function getData(page: number, pageSize: number) {
        if (school !== null) {
            try {
                setLoading(true)
                const events = await eventsResults(true, page, pageSize, school, headerFieldsState, getDataStoreData?.registration?.programStage, "trackedEntity,enrollment,orgUnit,program", school != null ? "SELECTED" : "ACCESSIBLE")
                let startDate = getDates(false, selectedDateAddNew.selectedDate ?? selectedDate ?? new Date(), true, sysInfo),
                    endDate = getDates(false, selectedDateAddNew.selectedDate ?? selectedDate ?? new Date(), false, sysInfo)

                const attendanceValuesByTei: AttendanceQueryResults = {
                    results: { instances: [] }
                }

                // Map trackedEntityIds from the events
                const trackedEntityIds = events?.map((x: { trackedEntity: string }) => x.trackedEntity)
                setEnrollmentTeis({ enrollmentDetails: trackedEntityIds })
                const trackedEntityToFetch = trackedEntityIds?.join(';')

                // Get events from the programStage attendance for each student
                for (const tei of trackedEntityIds) {
                    const attendanceResults: AttendanceQueryResults = await getEvents(startDate, endDate, school, tei, true)
                    attendanceValuesByTei.results.instances.push(...attendanceResults?.results?.instances)
                }
                // Get the list of trackedEntityIds attributes from the events
                const teiResults: TeiQueryResults = trackedEntityToFetch?.length > 0
                    ? await engine.query(TEI_QUERY({
                        pageSize,
                        program: getDataStoreData?.program as unknown as string,
                        trackedEntity: trackedEntityToFetch
                    })) as unknown as TeiQueryResults
                    : { results: { instances: [] } } as unknown as TeiQueryResults

                const resultsFormatter = formatResponseRows({
                    eventsInstances: events,
                    teiInstances: teiResults?.results?.instances,
                    attendanceValues: attendanceValuesByTei?.results?.instances,
                    attendanceConfig
                })

                setTableColumnState(resultsFormatter)
                setTableData(resultsFormatter);
            } catch (error) {
                showError(error)
            } finally {
                setLoading(false)
            }
        }
    }

    async function getAttendanceData(excel?: { dealingWithExcel: boolean, trackedEntityIds: { tei: string, enrollment: string }[], sDate: Date, eDate: Date }) {
        if (enrollmentTeis.enrollmentDetails?.length > 0) {
            try {
                let startDate = getDates(excel?.dealingWithExcel, excel?.dealingWithExcel ? excel.sDate : selectedDateAddNew.selectedDate ?? selectedDate ?? new Date(), true, sysInfo),
                    endDate = getDates(excel?.dealingWithExcel, excel?.dealingWithExcel ? excel.eDate : selectedDateAddNew.selectedDate ?? selectedDate ?? new Date(), false, sysInfo)

                const localData = [...tableData]
                let dataToExport: any = {}
                const attendanceValuesByTei: AttendanceFormaterProps[] = []

                if (!excel?.dealingWithExcel) setLoading(true)

                const trackedEntityIds = excel?.dealingWithExcel ? excel?.trackedEntityIds.map(x => x.tei) : enrollmentTeis.enrollmentDetails

                for (const tei of trackedEntityIds) {
                    await getEvents(startDate, endDate, school, tei, true).then((resp) => {
                        excel?.dealingWithExcel && updateProgress((progress: any) => ({
                            ...progress,
                            progress: progress.progress + (40 / trackedEntityIds.length),
                            buffer: progress.buffer + (40 / trackedEntityIds.length)
                        }))
                        attendanceValuesByTei.push(...resp?.results?.instances)
                    })
                }

                if (excel?.dealingWithExcel) {
                    for (const tei of excel.trackedEntityIds) {
                        const attendanceDetails = attendanceValuesByTei.filter((x) => x.trackedEntity === tei.tei).filter((attendance: any) => attendance.enrollment === tei.enrollment);
                        dataToExport[tei.tei] = attendanceFormater(attendanceDetails, attendanceConfig)
                    }
                    return dataToExport
                } else {
                    for (const [index, tei] of localData.entries()) {
                        const attendanceDetails = attendanceValuesByTei.filter((x) => x.trackedEntity === tei.trackedEntity).filter((attendance: any) => attendance.enrollment === tei.enrollmentId);
                        localData[index] = { ...tei, ...attendanceFormater(attendanceDetails, attendanceConfig) };
                    }
                    setTableData(localData);
                }
            } catch (error: any) {
                showError(error)
            } finally {
                if (!excel?.dealingWithExcel) setLoading(false)
            }
        }
    }

    return {
        getData,
        tableData,
        loading,
        getAttendanceData,
        setTableData
    }
}
