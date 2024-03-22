import { useState } from "react";
import { format } from "date-fns";
import { useDataEngine } from "@dhis2/app-runtime";
import useShowAlerts from "../commons/useShowAlert";
import { useRecoilState, useRecoilValue } from "recoil";
import { useParams } from "../commons/useQueryParams";
import { HeaderFieldsState } from "../../schema/headersSchema";
import { TableDataState } from "../../schema/tableColumnsSchema";
import { getSelectedKey } from '../../utils/commons/dataStore/getSelectedKey';
import { formatResponseRows } from "../../utils/table/rows/formatResponseRows";
import { SelectedDateState } from "../../schema/attendanceSchema";
import { attendanceFormater } from './../../utils/table/rows/formatResponseRows';
import { AttendanceQueryResults, EventQueryProps, EventQueryResults } from "../../types/api/WithoutRegistrationTypes";
import { TeiQueryProps, TeiQueryResults } from "../../types/api/WithRegistrationTypes";
import { AttendanceFormaterProps } from "../../types/utils/table/FormatRowsDataTypes";
import { EnrollmentDetailsTeisState } from "../../schema/enrollmentDetailsSchema";

type TableDataProps = Record<string, string>;


const EVENT_QUERY = ({ ouMode, page, pageSize, program, order, programStage, filter, orgUnit, filterAttributes, trackedEntity, occurredAfter, occurredBefore, fields = "*" }: EventQueryProps) => ({
    results: {
        resource: "tracker/events",
        params: {
            order,
            page,
            pageSize,
            ouMode,
            program,
            programStage,
            orgUnit,
            filter,
            filterAttributes,
            fields,
            trackedEntity,
            occurredAfter,
            occurredBefore
        }
    }
})

const TEI_QUERY = ({ ouMode, pageSize, program, trackedEntity, orgUnit }: TeiQueryProps) => ({
    results: {
        resource: "tracker/trackedEntities",
        params: {
            program,
            ouMode,
            pageSize,
            trackedEntity,
            orgUnit,
            fields: "trackedEntity,createdAt,orgUnit,attributes[attribute,value],enrollments[enrollment,orgUnit,program]"
        }
    }
})

export function useTableData() {
    const engine = useDataEngine();
    const headerFieldsState = useRecoilValue(HeaderFieldsState)
    const [enrollmentTeis, setEnrollmentTeis] = useRecoilState(EnrollmentDetailsTeisState)
    const [tableColumnState, setTableColumnState] = useRecoilState(TableDataState)
    const { selectedDate } = useRecoilValue(SelectedDateState)
    const { urlParamiters } = useParams()
    const [loading, setLoading] = useState<boolean>(false)
    const [tableData, setTableData] = useState<TableDataProps[]>([])
    const { hide, show } = useShowAlerts()
    const school = urlParamiters().school as unknown as string
    const { getDataStoreData } = getSelectedKey()
    const attendanceConfig = getSelectedKey()?.getDataStoreData?.attendance

    async function getData(page: number, pageSize: number) {
        if (school !== null) {
            setLoading(true)
            const attendanceValuesByTei: AttendanceQueryResults = {
                results: {
                    instances: []
                }
            }

            // Get the events from the programStage registration
            const eventsResults: EventQueryResults = await engine.query(EVENT_QUERY({
                ouMode: school != null ? "SELECTED" : "ACCESSIBLE",
                page,
                pageSize,
                program: getDataStoreData?.program as unknown as string,
                order: "createdAt:desc",
                programStage: getDataStoreData?.registration?.programStage as unknown as string,
                filter: headerFieldsState?.dataElements,
                filterAttributes: headerFieldsState?.attributes,
                orgUnit: school,
                fields: "trackedEntity"
            })).catch((error) => {
                show({
                    message: `${("Could not get data")}: ${error.message}`,
                    type: { critical: true }
                });
                setTimeout(hide, 5000);
            }) as unknown as EventQueryResults

            // Map the trackedEntityIds from the events
            const trackedEntityIds = eventsResults?.results?.instances.map((x: { trackedEntity: string }) => x.trackedEntity)
            setEnrollmentTeis({ enrollmentDetails: trackedEntityIds })
            const trackedEntityToFetch = trackedEntityIds.toString().replaceAll(",", ";")

            // Get the events from the programStage attendance for the each student
            if (trackedEntityToFetch?.length > 0) {
                for (const tei of trackedEntityIds) {
                    const attendanceResults: AttendanceQueryResults = await engine.query(EVENT_QUERY({
                        ouMode: school != null ? "SELECTED" : "ACCESSIBLE",
                        program: getDataStoreData?.program as unknown as string,
                        programStage: getDataStoreData?.attendance?.programStage as unknown as string,
                        orgUnit: school,
                        trackedEntity: tei,
                        occurredAfter: format(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 5), "yyyy-MM-dd"),
                        occurredBefore: format(new Date(selectedDate), "yyyy-MM-dd"),
                        fields: "event,trackedEntity,occurredAt,dataValues[dataElement,value]"
                    })).catch((error) => {
                        show({
                            message: `${("Could not get data")}: ${error.message}`,
                            type: { critical: true }
                        });
                        setTimeout(hide, 5000);
                    }) as unknown as AttendanceQueryResults

                    attendanceValuesByTei.results.instances.push(...attendanceResults?.results?.instances)
                }
            }

            // Get the list of trackedEntityIds attributes from the events
            const teiResults: TeiQueryResults = trackedEntityToFetch?.length > 0
                ? await engine.query(TEI_QUERY({
                    ouMode: school != null ? "SELECTED" : "ACCESSIBLE",
                    pageSize,
                    program: getDataStoreData?.program as unknown as string,
                    orgUnit: school,
                    trackedEntity: trackedEntityToFetch
                })).catch((error) => {
                    show({
                        message: `${("Could not get data")}: ${error.message}`,
                        type: { critical: true }
                    });
                    setTimeout(hide, 5000);
                }) as unknown as TeiQueryResults
                : { results: { instances: [] } } as unknown as TeiQueryResults

            const resultsFormatter = formatResponseRows({
                eventsInstances: eventsResults?.results?.instances,
                teiInstances: teiResults?.results?.instances,
                attendanceValues: attendanceValuesByTei?.results?.instances,
                attendanceConfig
            })

            setTableColumnState(resultsFormatter)
            setTableData(resultsFormatter);

            setLoading(false)
        }
    }

    async function getAttendanceData() {
        if (enrollmentTeis.enrollmentDetails?.length > 0) {
            const localData = [...tableData]
            setLoading(true)
            const attendanceValuesByTei: AttendanceFormaterProps[] = []

            const trackedEntityIds = enrollmentTeis.enrollmentDetails

            for (const tei of trackedEntityIds) {
                const attendanceResults: AttendanceQueryResults = await engine.query(EVENT_QUERY({
                    ouMode: school != null ? "SELECTED" : "ACCESSIBLE",
                    program: getDataStoreData?.program as unknown as string,
                    programStage: getDataStoreData?.attendance?.programStage as unknown as string,
                    orgUnit: school,
                    trackedEntity: tei,
                    occurredAfter: format(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 5), "yyyy-MM-dd"),
                    occurredBefore: format(new Date(selectedDate), "yyyy-MM-dd"),
                    fields: "event,trackedEntity,occurredAt,dataValues[dataElement,value]"
                })).catch((error) => {
                    show({
                        message: `${("Could not get data")}: ${error.message}`,
                        type: { critical: true }
                    });
                    setTimeout(hide, 5000);
                }) as unknown as AttendanceQueryResults

                attendanceValuesByTei.push(...attendanceResults?.results?.instances)
            }

            for (let [index, tei] of localData.entries()) {
                const attendanceDetails = attendanceValuesByTei.filter((x) => x.trackedEntity === tei.trackedEntity);
                localData[index] = { ...tei, ...attendanceFormater(attendanceDetails, attendanceConfig) };
            }

            setTableData(localData);
            setLoading(false)
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
