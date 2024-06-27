import { format } from "date-fns";
import {
    type AttendanceQueryResults, type DataValuesProps,
    type EventQueryProps,
} from "../../types/api/WithoutRegistrationTypes";
import { useDataEngine } from "@dhis2/app-runtime";
import useShowAlerts from "../commons/useShowAlert";
import { getSelectedKey } from "../../utils/commons/dataStore/getSelectedKey";
import { FormatResponseRowsProps } from "../../types/utils/table/FormatRowsDataTypes";

export const EVENT_QUERY = ({ ouMode, page, pageSize, program, order, programStage, filter, orgUnit, filterAttributes, trackedEntity, occurredAfter, occurredBefore, fields = "*" }: EventQueryProps) => ({
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
export function useGetEvents() {
    const engine = useDataEngine();
    const { hide, show } = useShowAlerts()
    const { getDataStoreData } = getSelectedKey()

    async function getEvents(selectedDate: any, school: string, tei: string): Promise<AttendanceQueryResults> {
        return engine.query(EVENT_QUERY({
            ouMode: school != null ? "SELECTED" : "ACCESSIBLE",
            program: getDataStoreData?.program as unknown as string,
            programStage: getDataStoreData?.attendance?.programStage as unknown as string,
            orgUnit: school,
            trackedEntity: tei,
            occurredAfter: format(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 5), "yyyy-MM-dd"),
            occurredBefore: format(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1), "yyyy-MM-dd"),
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

    async function eventsResults(page: number, pageSize: number, school: string, headerFieldsState: any): Promise<FormatResponseRowsProps["eventsInstances"]> {
        // Get the events from the programStage registration
        return await engine.query(EVENT_QUERY({
            ouMode: school != null ? "SELECTED" : "ACCESSIBLE",
            page,
            pageSize,
            program: getDataStoreData?.program as unknown as string,
            order: "occurredAt:desc",
            programStage: getDataStoreData?.registration?.programStage as unknown as string,
            filter: headerFieldsState?.dataElements,
            filterAttributes: headerFieldsState?.attributes,
            orgUnit: school,
            fields: "trackedEntity,enrollment,orgUnit,program"
        })).then((resp: any) => {
            return resp.results?.instances
        })
    }
    return { getEvents, eventsResults }
}
