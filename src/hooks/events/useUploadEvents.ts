import { useDataEngine } from "@dhis2/app-runtime";

const postEvent: any = {
    resource: 'tracker',
    type: 'create',
    data: ({ form }: { form: any }) => form,
    params: {
        importStrategy: "CREATE_AND_UPDATE",
        async: false
    }
}

const putEvent: any = {
    resource: 'tracker',
    type: 'create',
    data: ({ form }: { form: any }) => form,
    params: {
        importStrategy: "UPDATE",
        async: false
    }
}

const useUploadEvents = () => {
    const engine = useDataEngine()

    async function uploadValues(data: any) {
        let response: any = ""

        try {
            response = await engine.mutate(postEvent, {
                variables: { form: { events: data } }
            })

            return response
        } catch (error) {
        }

    }

    async function useUpdateValues(data: any) {
        try {
            let response = await engine.mutate(putEvent, {
                variables: { form: { events: data } }
            })

            console.log(response)
        } catch (error) {
            return error
        }
    }

    return { uploadValues, useUpdateValues }
}

export default useUploadEvents
