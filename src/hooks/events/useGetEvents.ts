import {
    type AttendanceQueryResults,
    type EventQueryProps,
} from "../../types/api/WithoutRegistrationTypes";
import { useDataEngine } from "@dhis2/app-runtime";
import useShowAlerts from "../commons/useShowAlert";
import { getSelectedKey } from "../../utils/commons/dataStore/getSelectedKey";
import { FormatResponseRowsProps } from "../../types/utils/table/FormatRowsDataTypes";

const EVENT_QUERY = (queryProps: EventQueryProps) => ({
    results: {
        resource: "tracker/events",
        params: {
            ...queryProps
        }
    }
})
export function useGetEvents() {
    const engine = useDataEngine();
    const { hide, show } = useShowAlerts()
    const { getDataStoreData } = getSelectedKey()

    async function getEvents(startDate: string, endDate: string, school: string, tei: string): Promise<AttendanceQueryResults> {
        return engine.query(EVENT_QUERY({
            ouMode: school != null ? "SELECTED" : "ACCESSIBLE",
            program: getDataStoreData?.program as unknown as string,
            order: getDataStoreData.defaults.defaultOrder || "occurredAt:desc",
            programStage: getDataStoreData?.attendance?.programStage as unknown as string,
            orgUnit: school,
            trackedEntity: tei,
            occurredAfter: startDate,
            occurredBefore: endDate,
            fields: "event,trackedEntity,occurredAt,enrollment,dataValues[dataElement,value]"
        })).catch((error) => {
            show({
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                message: `${("Could not get data")}: ${error.message}`,
                type: { critical: true }
            });
            setTimeout(hide, 5000);
        }) as unknown as AttendanceQueryResults
    }

    async function eventsResults(paging: boolean, page: number, pageSize: number, orgUnit: string, headerFieldsState: any, programStage: string, fields: string, ouMode = "ACCESSIBLE", trackedEntity?: any): Promise<FormatResponseRowsProps["eventsInstances"]> {
        // Get the events from the programStage registration
        return await engine.query(EVENT_QUERY({
            ouMode,
            page,
            pageSize,
            program: getDataStoreData?.program as unknown as string,
            order: getDataStoreData.defaults.defaultOrder || "occurredAt:desc",
            programStage: programStage as unknown as string,
            filter: headerFieldsState?.dataElements,
            filterAttributes: headerFieldsState?.attributes,
            ...(trackedEntity ? { trackedEntity: trackedEntity } : {}),
            orgUnit,
            fields,
            paging
        })).then((resp: any) => {
            return resp.results?.instances
        })
    }

    return { getEvents, eventsResults }
}
