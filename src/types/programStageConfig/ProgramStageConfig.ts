import { OptionsProps } from "../variables/AttributeColumns"
interface ProgramStageDataElements {
    displayInReports: boolean
    compulsory: boolean
    dataElement: {
        displayInReports: boolean | undefined
        displayName: string
        id: string
        valueType: string
        optionSet: {
            id: string
            options: OptionsProps[]
        }
    }
}
interface ProgramStageConfig {
    autoGenerateEvent: boolean
    displayName: string
    id: string
    executionDateLabel?: string
    programStageDataElements: ProgramStageDataElements[]
}

export type { ProgramStageConfig, ProgramStageDataElements }