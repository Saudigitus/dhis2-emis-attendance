import { useRecoilValue } from "recoil";
import { ProgramConfigState } from "../../schema/programSchema";
import { getDataStoreKeys } from "../commons/dataStore/getDataStoreKeys"
import { getSelectedKey } from "../commons/dataStore/getSelectedKey"

export function generateHeaders() {
    const { registration, socioEconomics } = getDataStoreKeys()
    const programConfigState = useRecoilValue(ProgramConfigState);
    const colors = {
        [registration.programStage]: 'FCE5CD',
        [socioEconomics.programStage]: 'FFF2CC'
    }

    function getHeaders() {
        let formatedHeaders: any[] = []

        programConfigState.programStages.filter(x => {
            if (x.id == registration.programStage || x.id == socioEconomics.programStage) {

                let section: any = { name: x.displayName, headers: [], fill: colors[x.id] }

                x.programStageDataElements.map((de) => {
                    section = {
                        ...section, headers: [...section.headers, {
                            header: de.dataElement.displayName,
                            key: de.dataElement.id,
                            width: 20,
                        }]
                    }
                })

                formatedHeaders.push(section)
            }
        })

        const att = programConfigState.programTrackedEntityAttributes.filter((att) => att.displayInList).map(x => {
            return {
                header: x.trackedEntityAttribute.displayName,
                key: x.trackedEntityAttribute.id,
                width: 20,
            }
        })

        formatedHeaders.unshift({ name: 'Student profile', headers: att, fill: 'D9EAD3' })

        return formatedHeaders
    }

    return { getHeaders }
}