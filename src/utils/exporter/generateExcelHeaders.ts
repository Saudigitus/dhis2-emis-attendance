import { useRecoilValue } from "recoil";
import { ProgramConfigState } from "../../schema/programSchema";
import { getDataStoreKeys } from "../commons/dataStore/getDataStoreKeys"
import { useParams } from "../../hooks";

export const dfHeaders = [
    {
        "header": "Enrollment",
        "key": "enrollment",
        "width": 25
    },
    {
        "header": "Tracked Entity Id",
        "key": "studentId",
        "width": 25
    },
    {
        "header": "School UID",
        "key": "orgUnit",
        "width": 25
    }
]

export function generateHeaders() {
    const { registration } = getDataStoreKeys()
    const { urlParamiters } = useParams()
    const { sectionType } = urlParamiters()
    const programConfigState = useRecoilValue(ProgramConfigState);

    function getHeaders() {
        let formatedHeaders: any[] = []

        programConfigState.programStages.filter(x => {
            if (x.id == registration.programStage) {

                let section: any = {
                    name: x.displayName,
                    headers: [{
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
            name: (sectionType ?? '').substring(0, 1).toUpperCase() + (sectionType ?? '').substring(1, (sectionType ?? '').length) + ' profile', headers: [{
                header: 'Ref',
                key: 'ref',
                width: 25,
            }, ...att], fill: 'D9EAD3'
        })

        return formatedHeaders
    }

    function getAllowedMajorHeaders() {
        
        return [
            (sectionType ?? '').substring(0, 1).toUpperCase() + (sectionType ?? '').substring(1, (sectionType ?? '').length) + ' profile',
            programConfigState.programStages.find(x => x.id == registration.programStage)?.displayName,
            'Attendance', 'Ids'
        ]
    }

    return { getHeaders, getAllowedMajorHeaders }
}