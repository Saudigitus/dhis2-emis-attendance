import { HeadBarTypes } from "../../../types/headBar/HeadBarTypes"
import { HeadBarDataProps } from "../../../types/utils/ConstantsTypes"
import { headBarDataElements } from "./headBarDataElements"

function headBarData({ selectedOptions, dataStoreData, programStageDataElements }: HeadBarDataProps): HeadBarTypes[] {
    return [
        {
            id: "c540ac7c",
            label: "School",
            value: selectedOptions?.schoolName ?? "Select a school",
            placeholder: "Search for organisation unit",
            component: "orgUnitTree",
            selected: Boolean(selectedOptions?.school),
        },
        ...headBarDataElements(selectedOptions, dataStoreData, programStageDataElements),
        {
            id: "j2e9b216",
            label: "Academic Year",
            value: selectedOptions?.academicYear ?? "Select academic year",
            placeholder: "Search for academic year",
            dataElementId: dataStoreData?.registration?.academicYear ?? "",
            component: "menuItemContainer",
            selected: Boolean(selectedOptions?.academicYear),
        }
    ]
}
export { headBarData }
