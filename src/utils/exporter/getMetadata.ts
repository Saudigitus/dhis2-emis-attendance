import { type ProgramConfig } from "../../types/programConfig/ProgramConfig";
import { type DataStoreRecord } from "../../types/dataStore/DataStoreConfig";

export function getMetaData(programConfig: ProgramConfig, dataStoreData: DataStoreRecord) {

    let metaDataArray: any = [
        { programId: programConfig.id, programName: programConfig.displayName, id: "ref", name: "Ref", valueType: "TEXT" },
        { id: "orgUnitName", name: "School", valueType: "TEXT" },
        { id: "orgUnit", name: "School UID", valueType: "TEXT" },
    ]

    programConfig.programStages.filter(x => x.id == dataStoreData.attendance.programStage || x.id == dataStoreData.registration.programStage)
        .map((pStage) => {
            pStage.programStageDataElements.map((de) => {
                const options = de?.dataElement?.optionSet?.options?.map(option => option.label).join(' | ') ?? ""
                metaDataArray.push({ id: de.dataElement.id, name: de.dataElement.displayName, valueType: de.dataElement.valueType, options: options })
            })
        })

    programConfig.programTrackedEntityAttributes.map((att) => {
        const options = att?.trackedEntityAttribute?.optionSet?.options?.map(option => option.label).join(' | ') ?? ""
        metaDataArray.push({ id: att?.trackedEntityAttribute.id, name: att?.trackedEntityAttribute.displayName, valueType: att?.trackedEntityAttribute.valueType, options: options })
    })

    return metaDataArray
}