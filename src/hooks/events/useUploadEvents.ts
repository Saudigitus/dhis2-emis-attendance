import { useDataMutation } from "@dhis2/app-runtime";
import { ImportStatsSchema } from "../../schema/importStatsSchema";
import { useSetRecoilState } from "recoil";

const postEvent: any = {
    resource: 'tracker',
    type: 'create',
    data: ({ form }: any) => form,
    params: ({ params }: any) => params
}

const putEvent: any = {
    resource: 'tracker',
    type: 'create',
    data: ({ form }: any) => form,
    params: ({ params }: any) => params
}

const useUploadEvents = () => {
    const setStats = useSetRecoilState(ImportStatsSchema)
    const params = {
        async: false,
        atomicMode: "OBJECT",
        reportMode: "FULL"
    }

    function importSummary(summary: any) {
        setStats((prevStats: any) => ({
            ...prevStats,
            statsCount: {
                ignored: summary?.stats?.ignored ? summary?.stats?.ignored + prevStats.statsCount?.ignored : prevStats.statsCount?.ignored,
                created: summary?.stats?.created ? summary?.stats?.created + prevStats.statsCount?.created : prevStats.statsCount?.created,
                updated: summary?.stats?.updated ? summary?.stats?.updated + prevStats.statsCount?.updated : prevStats.statsCount?.updated,
                total: summary?.stats?.total ? summary?.stats?.total + prevStats.statsCount?.total : prevStats.statsCount?.total,
            }
        }))

        if (summary?.validationReport?.errorReports) {
            setStats((prevStats) => ({
                ...prevStats,
                errorDetails: [
                    ...prevStats.errorDetails,
                    ...summary?.validationReport?.errorReports
                ]
            }))
        }
    }

    const [mutate,] = useDataMutation(postEvent, {
        onComplete(data) {
            importSummary(data)
        },
    })

    const [update,] = useDataMutation(putEvent, {
        onComplete(data) {
            importSummary(data)
        },
    })

    async function uploadValues(data: any, importMode: string) {
        return await mutate({ form: { events: data }, params: { ...params, importStrategy: "CREATE_AND_UPDATE", importMode } })
    }

    async function useUpdateValues(data: any, importMode: string) {
        return await update({ form: { events: data }, params: { ...params, importStrategy: "UPDATE", importMode } })
    }

    return { uploadValues, useUpdateValues }
}

export default useUploadEvents
