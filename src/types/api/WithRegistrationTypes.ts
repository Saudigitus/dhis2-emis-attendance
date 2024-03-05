interface TeiQueryProps {
    program: string
    pageSize: number
    ouMode: string
    trackedEntity: string
    orgUnit: string
    order: string
}

interface AttributesProps {
    attribute: string
    value: string
}

interface TeiQueryResults {
    results: {
        instances: [{
            trackedEntity: string
            attributes: AttributesProps[]
            enrollments: [{
                enrollment: string
                orgUnit: string
                program: string
            }]
        }]
    }
}


export type { TeiQueryProps, TeiQueryResults, AttributesProps }
