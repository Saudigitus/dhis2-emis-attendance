import { useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useGetTei, useGetEvents, useParams, useShowAlerts } from '../../hooks';
import { getSelectedKey } from '../../utils/commons/dataStore/getSelectedKey';
import { attributes, dataValues } from '../../utils/table/rows/formatResponseRows';
import { HeaderFieldsState } from '../../schema/headersSchema';
import { getDataStoreKeys } from '../../utils/commons/dataStore/getDataStoreKeys';
import { attendanceFormatter } from '../../utils/exporter/formatAttendance';
import { ProgressState } from '../../schema/linearProgress';

export function useGetEnrollmentData() {
    const { getTei } = useGetTei()
    const { eventsResults } = useGetEvents()
    const { urlParamiters } = useParams()
    const { show } = useShowAlerts()
    const { school: orgUnit } = urlParamiters()
    const { getDataStoreData } = getSelectedKey()
    const [error, setError] = useState<boolean>(false)
    const headerFieldsState = useRecoilValue(HeaderFieldsState)
    const { registration, program } = getDataStoreKeys()
    const updateProgress = useSetRecoilState(ProgressState)

    const getEnrollmentDetails = async (events: any, attendance: any[]) => {
        const trackedEntityIds = events?.map((x: { trackedEntity: string }) => x.trackedEntity).join(';')

        if (Object.keys(getDataStoreData)?.length) {

            try {
                return getTei(program, orgUnit as string, trackedEntityIds)
                    .then(async (trackedEntityInstance: any) => {
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

                            rows = [...rows, {
                                enrollmentDate: registrationData?.find((x: any) => x.enrollment === enrollment)?.occurredAt,
                                ...attributes(tei?.attributes ?? []),
                                ...dataValues(registrationData?.find((x: any) => x.enrollment === enrollment)?.dataValues ?? []),
                                ...attendanceFormatter(attendance[tei?.trackedEntity])
                            }]

                            updateProgress((progress: any) => ({
                                buffer: progress.buffer + (40 / trackedEntityInstance?.results?.instances?.length), progress: progress.progress + (40 / trackedEntityInstance?.results?.instances?.length)
                            }))
                        }

                        return rows
                    })
            }

            catch (error: any) {
                setError(true)
                show({
                    message: `${("Could not get selected enrollment details")}: ${error.message}`,
                    type: { critical: true }
                });
            }
        }
        return []
    }

    return { getEnrollmentDetails, error }
}