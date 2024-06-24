import { useEffect, useState } from "react";
import { useDataEngine } from "@dhis2/app-runtime";
import useShowAlerts from "../commons/useShowAlert";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useParams } from "../commons/useQueryParams";
import { HeaderFieldsState } from "../../schema/headersSchema";
import { TableDataState } from "../../schema/tableColumnsSchema";
import { getSelectedKey } from '../../utils/commons/dataStore/getSelectedKey';
import { formatResponseRows, attendanceFormater } from "../../utils/table/rows/formatResponseRows";
import { SelectedDateState } from "../../schema/attendanceSchema";
import { type AttendanceQueryResults } from "../../types/api/WithoutRegistrationTypes";
import { type TeiQueryProps, type TeiQueryResults } from "../../types/api/WithRegistrationTypes";
import { type AttendanceFormaterProps } from "../../types/utils/table/FormatRowsDataTypes";
import { EnrollmentDetailsTeisState } from "../../schema/enrollmentDetailsSchema";
import { useGetEvents } from "../events/useGetEvents";

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
    const { urlParamiters } = useParams()
    const [loading, setLoading] = useState<boolean>(false)
    const [tableData, setTableData] = useState<TableDataProps[]>([])
    const {
        hide,
        show
    } = useShowAlerts()
    const school = urlParamiters().school as unknown as string
    const { getDataStoreData } = getSelectedKey()
    const attendanceConfig = getSelectedKey()?.getDataStoreData?.attendance
    const {
        getEvents,
        eventsResults
    } = useGetEvents()

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
                const events = await eventsResults(page, pageSize, school, headerFieldsState)

                const attendanceValuesByTei: AttendanceQueryResults = {
                    results: { instances: [] }
                }

                // Map trackedEntityIds from the events
                const trackedEntityIds = events?.map((x: { trackedEntity: string }) => x.trackedEntity)
                setEnrollmentTeis({ enrollmentDetails: trackedEntityIds })
                const trackedEntityToFetch = trackedEntityIds?.join(';')

                // Get events from the programStage attendance for each student
                for (const tei of trackedEntityIds) {
                    const attendanceResults: AttendanceQueryResults = await getEvents(selectedDate ?? new Date(), school, tei)
                    attendanceValuesByTei.results.instances.push(...attendanceResults?.results?.instances)
                }
                // Get the list of trackedEntityIds attributes from the events
                const teiResults: TeiQueryResults = trackedEntityToFetch?.length > 0
                    ? await engine.query(TEI_QUERY({
                        //ouMode: school != null ? "SELECTED" : "ACCESSIBLE",
                        pageSize,
                        program: getDataStoreData?.program as unknown as string,
                        //orgUnit: school,
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

    async function getAttendanceData(date?: any) {
        if (enrollmentTeis.enrollmentDetails?.length > 0) {
            try {
                const localData = [...tableData]
                setLoading(true)
                const attendanceValuesByTei: AttendanceFormaterProps[] = []

                const trackedEntityIds = enrollmentTeis.enrollmentDetails

                for (const tei of trackedEntityIds) {
                    const attendanceResults: AttendanceQueryResults = await getEvents(date ?? selectedDate, school, tei)
                    attendanceValuesByTei.push(...attendanceResults?.results?.instances)
                }

                for (const [index, tei] of localData.entries()) {
                    const attendanceDetails = attendanceValuesByTei.filter((x) => x.trackedEntity === tei.trackedEntity).filter((attendance: any) => attendance.enrollment === tei.enrollmentId);
                    localData[index] = { ...tei, ...attendanceFormater(attendanceDetails, attendanceConfig) };
                }

                setTableData(localData);
            } catch (error: any) {
                showError(error)
            } finally {
                setLoading(false)
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
