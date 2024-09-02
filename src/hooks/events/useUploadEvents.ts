import { useDataEngine, useDataMutation } from "@dhis2/app-runtime";

const postEvent: any = {
    resource: 'events',
    type: 'create',
    data: ({ form }: { form: any }) => form
}

const putEvent: any = {
    resource: 'events',
    type: 'update',
    id: ({ id }: { id: any }) => id,
    data: ({ form }: { form: any }) => form
}

const useUploadEvents = () => {
    const engine = useDataEngine()

    // const [mutate, response] = useDataMutation(postEvent)
    const [upate, responseUpdate] = useDataMutation(putEvent)

    async function uploadValues(data: any) {
        let response: any = ""

        try {
            response = await engine.mutate(postEvent, {
                variables: { form: { events: data } }
            })

            return response
        } catch (error) {

            console.log(response, error)
        }


    }

    async function useUpdateValues(data: any, id: string) {
        try {
            return await upate({ form: data, id: id }).then((x: any) => {
                return x
            })
        } catch (error) {
            return error
        }
    }

    return { uploadValues, useUpdateValues, responseUpdate: responseUpdate }
}

export default useUploadEvents
