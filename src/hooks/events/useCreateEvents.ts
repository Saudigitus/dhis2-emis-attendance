import { useState } from "react";
import { format } from "date-fns";
import { useRecoilValue } from "recoil";
import useShowAlerts from "../commons/useShowAlert";
import { useDataMutation } from "@dhis2/app-runtime";
import { SelectedDateAddNewState } from "../../schema/attendanceSchema";
import { CreateEventProps } from "../../types/api/WithoutRegistrationTypes";
import { getSelectedKey } from "../../utils/commons/dataStore/getSelectedKey";

const putEvent: any = {
    resource: 'events',
    type: 'create',
    data: ({ form }: { form: any }) => form
}

const useCreateDataValues = () => {
    const [controlError, setcontrolError] = useState(true)
    const attendanceConfig = getSelectedKey()?.getDataStoreData?.attendance
    const { selectedDate } = useRecoilValue(SelectedDateAddNewState)
    const { hide, show } = useShowAlerts()

    const [mutate, response] = useDataMutation(putEvent)

    async function createValues(props: CreateEventProps) {
        const { teiDetails, dataElementId, dataElementValue, typeField, rowsData, setTableData, setselectedTerm } = props
        const dateFormated = format(new Date(selectedDate), "yyyy-MM-dd")

        const data: any = {
            events: [
                {
                    trackedEntityInstance: teiDetails.trackedEntity,
                    program: teiDetails.programId,
                    programStage: attendanceConfig.programStage,
                    orgUnit: teiDetails.orgUnitId,
                    dataValues: [
                        {
                            dataElement: dataElementId,
                            value: dataElementValue
                        }
                    ],
                    eventDate: dateFormated
                }
            ]
        }

        await mutate({ form: data }).then((x: any) => {
            if (x.httpStatusCode === 200 || x.httpStatusCode === 201) {
                const finCurrentRow = rowsData.findIndex((x: any) => x.trackedEntity === teiDetails.trackedEntity)
                const localRowData = [...rowsData]

                if (typeField === "attendance") {
                    localRowData[finCurrentRow] = { ...localRowData[finCurrentRow], [dateFormated]: {} }
                    localRowData[finCurrentRow][dateFormated] = {
                        status: dataElementValue,
                        absenceOption: undefined,
                        eventId: x.response.importSummaries[0].reference
                    }
                }
                setTableData(localRowData)
                setselectedTerm(dataElementValue)
            }
        })
    }

    if (((response?.error) != null) && controlError) {
        setcontrolError(false)

        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        const message = response?.error?.details?.response?.importSummaries?.[0]?.description || response?.error?.details?.response?.description || response?.error?.details?.message

        show({
            message,
            type: { critical: true }
        });

        setTimeout(hide, 5000);
    }

    return { createValues }
}

export default useCreateDataValues
