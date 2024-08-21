import { useState } from 'react'
import { format } from 'date-fns';
import { useRecoilValue } from 'recoil';
import { useGetTei, useGetEvents, useParams, useShowAlerts } from '../../hooks';
import { getSelectedKey } from '../../utils/commons/dataStore/getSelectedKey';
import { attributes, dataValues } from '../../utils/table/rows/formatResponseRows';
import { HeaderFieldsState } from '../../schema/headersSchema';
import { getDataStoreKeys } from '../../utils/commons/dataStore/getDataStoreKeys';

export function useGetEnrollmentData() {
    const { getTei } = useGetTei()
    const { eventsResults } = useGetEvents()
    const { urlParamiters } = useParams()
    const { show } = useShowAlerts()
    const { school: orgUnit } = urlParamiters()
    const { getDataStoreData } = getSelectedKey()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const [excelData, setExcellData] = useState<any>([])
    const headerFieldsState = useRecoilValue(HeaderFieldsState)
    const { registration, socioEconomics, program } = getDataStoreKeys()

    const getEnrollmentDetails = (events: any) => {
        const trackedEntityIds = events?.map((x: { trackedEntity: string }) => x.trackedEntity).join(';')

        setLoading(true)

        if (Object.keys(getDataStoreData)?.length) {

            try {
                getTei(program, orgUnit as string, trackedEntityIds)
                    .then(async (trackedEntityInstance: any) => {
                        let socioEconomicData: any = {}
                        let rows: any = []

                        for (const tei of trackedEntityInstance?.results?.instances) {
                            let enrollment = events.find((x: any) => x.trackedEntity == tei?.trackedEntity)?.enrollment

                            const registrationData: any = await eventsResults(false,
                                "" as unknown as number,
                                "" as unknown as number,
                                orgUnit as unknown as string,
                                headerFieldsState.dataElements,
                                registration.programStage as string,
                                "*",
                                "",
                                tei?.trackedEntity
                            )

                            if (socioEconomics) {
                                socioEconomicData = await eventsResults(false,
                                    "" as unknown as number,
                                    "" as unknown as number,
                                    orgUnit as unknown as string,
                                    [],
                                    socioEconomics?.programStage as string,
                                    "*",
                                    "",
                                    tei?.trackedEntity
                                )
                            }

                            rows = [...rows, {
                                enrollmentDate: registrationData?.find((x: any) => x.enrollment === enrollment)?.occurredAt,
                                ...attributes(tei?.attributes ?? []),
                                ...dataValues(registrationData?.find((x: any) => x.enrollment === enrollment)?.dataValues ?? []),
                                ...dataValues(socioEconomicData?.find((x: any) => x.enrollment === enrollment)?.dataValues ?? []),
                            }]
                        }
                        setExcellData(rows)
                    })
            }

            catch (error: any) {
                setError(true)
                show({
                    message: `${("Could not get selected enrollment details")}: ${error.message}`,
                    type: { critical: true }
                });
            }

            finally {
                setLoading(false)
            }
        }
    }

    return { getEnrollmentDetails, excelData, loading, error }
}