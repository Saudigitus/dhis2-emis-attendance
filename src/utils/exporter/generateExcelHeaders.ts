import { useRecoilValue } from "recoil";
import { ProgramConfigState } from "../../schema/programSchema";
import { getDataStoreKeys } from "../commons/dataStore/getDataStoreKeys"

export const dfHeaders = [
    {
        "header": "enrollment",
        "key": "enrollment",
        "width": 25
    },
    {
        "header": "studentId",
        "key": "studentId",
        "width": 25
    }
]

export function generateHeaders() {
    const { registration } = getDataStoreKeys()
    const programConfigState = useRecoilValue(ProgramConfigState);

    function getHeaders() {
        let formatedHeaders: any[] = []

        programConfigState.programStages.filter(x => {
            if (x.id == registration.programStage) {

                let section: any = {
                    name: x.displayName,
                    headers: [...dfHeaders, {
                        header: 'School',
                        key: 'school',
                        width: 25,
                    }],
                    fill: 'FCE5CD'
                }

                x.programStageDataElements.map((de) => {
                    section = {
                        ...section, headers: [...section.headers, {
                            header: de?.dataElement.displayName,
                            key: de?.dataElement.id,
                            width: 25,
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
                width: 25,
            }
        })

        formatedHeaders.unshift({
            name: 'Student profile', headers: [{
                header: 'Ref',
                key: 'ref',
                width: 25,
            }, ...att], fill: 'D9EAD3'
        })

        return formatedHeaders
    }

    return { getHeaders }
}