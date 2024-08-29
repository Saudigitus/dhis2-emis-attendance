import { useRecoilValue } from "recoil";
import { ProgramConfigState } from "../../schema/programSchema";
import { getDataStoreKeys } from "../commons/dataStore/getDataStoreKeys"

export const dfHeaders = [
    {
        "header": "enrollment",
        "key": "enrollment",
        "width": 20
    },
    {
        "header": "studentId",
        "key": "studentId",
        "width": 20
    }
]

export function generateHeaders() {
    const { registration } = getDataStoreKeys()
    const programConfigState = useRecoilValue(ProgramConfigState);

    function getHeaders() {
        let formatedHeaders: any[] = []

        programConfigState.programStages.filter(x => {
            if (x.id == registration.programStage) {

                let section: any = { name: x.displayName, headers: [...dfHeaders], fill: 'FCE5CD' }

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