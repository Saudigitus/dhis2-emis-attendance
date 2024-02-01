export interface ProgramStageConfig {
    autoGenerateEvent: boolean
    displayName: string
    id: string
    executionDateLabel?: string
    programStageDataElements: [
        {
            displayInReports: boolean
            compulsory: boolean
            dataElement: {
                displayName: string
                id: string
                valueType: string
                optionSet: {
                    id: string
                    options: [{
                        value: string
                        label: string
                    }]
                }
            }
        }
    ]
}
