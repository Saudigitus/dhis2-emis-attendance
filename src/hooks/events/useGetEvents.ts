import {format} from "date-fns";
import {type AttendanceQueryResults, type EventQueryProps} from "../../types/api/WithoutRegistrationTypes";
import {useDataEngine} from "@dhis2/app-runtime";
import useShowAlerts from "../commons/useShowAlert";
import {getEvents} from "../../../.d2/shell/src/D2App/hooks/events/useGetEvents";
import {getSelectedKey} from "../../utils/commons/dataStore/getSelectedKey";

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
            occurredBefore: format(new Date(selectedDate), "yyyy-MM-dd"),
            fields: "event,trackedEntity,occurredAt,dataValues[dataElement,value]"
        })).catch((error) => {
            show({
                message: `${("Could not get data")}: ${error.message}`,
                type: {critical: true}
            });
            setTimeout(hide, 5000);
        }) as unknown as AttendanceQueryResults
    }

    return {getEvents}
}
