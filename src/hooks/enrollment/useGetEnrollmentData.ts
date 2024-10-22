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
    const { school: orgUnit, schoolName } = urlParamiters()
    const { getDataStoreData } = getSelectedKey()
    const [error, setError] = useState<boolean>(false)
    const headerFieldsState = useRecoilValue(HeaderFieldsState)
    const { registration, program } = getDataStoreKeys()
    const updateProgress = useSetRecoilState(ProgressState)

    const getEnrollmentDetails = async (events: any, attendance: any[]) => {
        updateProgress((progress: any) => ({ ...progress, phase: 'details' }))

        const trackedEntityIds = events?.map((x: { trackedEntity: string }) => x.trackedEntity).join(';')

        if (Object.keys(getDataStoreData)?.length) {

            try {
                return getTei(program, trackedEntityIds)
                    .then(async (trackedEntityInstance: any) => {
                        let rows: any = []
                        let counter = 0

                        for (const tei of trackedEntityInstance?.results?.instances) {
                            counter++
                            let enrollment = events.find((x: any) => x.trackedEntity == tei?.trackedEntity)?.enrollment

                            const registrationData: any = await eventsResults(false,
                                "" as unknown as number,
                                "" as unknown as number,
                                orgUnit as unknown as string,
                                headerFieldsState.dataElements,
                                registration.programStage as string,
                                "*",
                                "SELECTED",
                                tei?.trackedEntity
                            )

                            const currEnrollment = registrationData?.find((x: any) => x.enrollment === enrollment)

                            rows = [...rows, {
                                ref: "" + counter + " ",
                                school: schoolName,
                                orgUnit: currEnrollment?.orgUnit,
                                enrollmentDate: currEnrollment?.occurredAt,
                                enrollment: enrollment,
                                studentId: tei.trackedEntity,
                                ...attributes(tei?.attributes ?? []),
                                ...dataValues(currEnrollment?.dataValues ?? []),
                                ...attendanceFormatter(attendance[tei?.trackedEntity])
                            }]

                            updateProgress((progress: any) => ({
                                ...progress,
                                progress: progress.progress + (43 / trackedEntityInstance?.results?.instances?.length),
                                buffer: progress.buffer + (40 / trackedEntityInstance.results?.instances?.length)
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