
import { useRecoilValue } from "recoil";
import { useState } from "react";
import { useDataEngine } from "@dhis2/app-runtime";
import { formatResponseRows } from "../../utils/table/rows/formatResponseRows";
import { useParams } from "../commons/useQueryParams";
import { HeaderFieldsState } from "../../schema/headersSchema";
import useShowAlerts from "../commons/useShowAlert";
import { getSelectedKey } from "../../utils/constants/dataStore/getSelectedKey";

type TableDataProps = Record<string, string>;

interface EventQueryProps {
    page: number
    pageSize: number
    ouMode: string
    program: string
    order: string
    programStage: string
    orgUnit: string
    filter?: string[]
    filterAttributes?: string[]
    trackedEntity?: string
}

interface TeiQueryProps {
    program: string
    pageSize: number
    ouMode: string
    trackedEntity: string
    orgUnit: string
    order: string
}

const EVENT_QUERY = ({ ouMode, page, pageSize, program, order, programStage, filter, orgUnit, filterAttributes, trackedEntity }: EventQueryProps) => ({
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
            fields: "*",
            trackedEntity
        }
    }
})

const TEI_QUERY = ({ ouMode, pageSize, program, trackedEntity, orgUnit, order }: TeiQueryProps) => ({
    results: {
        resource: "tracker/trackedEntities",
        params: {
            program,
            order,
            ouMode,
            pageSize,
            trackedEntity,
            orgUnit,
            fields: "trackedEntity,createdAt,orgUnit,attributes[attribute,value],enrollments[enrollment,status,orgUnit,enrolledAt]"
        }
    }
})

interface dataValuesProps {
    dataElement: string
    value: string
}

interface attributesProps {
    attribute: string
    value: string
}

interface EventQueryResults {
    results: {
        instances: [{
            trackedEntity: string
            dataValues: dataValuesProps[]
        }]
    }
}

interface AttendanceQueryResults {
    results: {
        instances: any
    }
}

interface TeiQueryResults {
    results: {
        instances: [{
            trackedEntity: string
            attributes: attributesProps[]
        }]
    }
}

export function useTableData() {
    const engine = useDataEngine();
    const headerFieldsState = useRecoilValue(HeaderFieldsState)
    const { urlParamiters } = useParams()
    const [loading, setLoading] = useState<boolean>(false)
    const [tableData, setTableData] = useState<TableDataProps[]>([])
    const { hide, show } = useShowAlerts()
    const school = urlParamiters().school as unknown as string
    const { getDataStoreData } = getSelectedKey()
    const attendanceConfig = getSelectedKey()?.getDataStoreData?.attendance

    async function getData(page: number, pageSize: number) {
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
            orgUnit: school
        })).catch((error) => {
            show({
                message: `${("Could not get data")}: ${error.message}`,
                type: { critical: true }
            });
            setTimeout(hide, 5000);
        })

        // Map the trackedEntityIds from the events
        const trackedEntityIds = eventsResults?.results?.instances.map((x: { trackedEntity: string }) => x.trackedEntity)

        const trackedEntityToFetch = trackedEntityIds.toString().replaceAll(",", ";")

        // Get the events from the programStage attendance for the each student
        if (trackedEntityToFetch?.length > 0) {
            for (const tei of trackedEntityIds) {
                const attendanceResults: AttendanceQueryResults = await engine.query(EVENT_QUERY({
                    ouMode: school != null ? "SELECTED" : "ACCESSIBLE",
                    page,
                    pageSize,
                    program: getDataStoreData?.program as unknown as string,
                    order: "createdAt:desc",
                    programStage: getDataStoreData?.attendance?.programStage as unknown as string,
                    filter: headerFieldsState?.dataElements,
                    filterAttributes: headerFieldsState?.attributes,
                    orgUnit: school,
                    trackedEntity: tei
                })).catch((error) => {
                    show({
                        message: `${("Could not get data")}: ${error.message}`,
                        type: { critical: true }
                    });
                    setTimeout(hide, 5000);
                })

                attendanceValuesByTei.results.instances.push(...attendanceResults?.results?.instances)
            }
        }

        // Get the list of trackedEntityIds attributes from the events
        const teiResults: TeiQueryResults = trackedEntityToFetch?.length > 0
            ? await engine.query(TEI_QUERY({
                ouMode: school != null ? "SELECTED" : "ACCESSIBLE",
                order: "created:desc",
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
            })
            : { results: { instances: [] } }

        setTableData(formatResponseRows({
            eventsInstances: eventsResults?.results?.instances,
            teiInstances: teiResults?.results?.instances,
            attendanceValues: attendanceValuesByTei?.results?.instances,
            attendanceConfig
        }));

        setLoading(false)
    }

    return {
        getData,
        tableData,
        loading
    }
}
