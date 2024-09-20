import { getSelectedKey } from "../../utils/commons/dataStore/getSelectedKey";
import useGetSectionTypeLabel from "./useGetSectionTypeLabel";
import { useParams } from "./useQueryParams";

export function useDisableBulkOperations() {
    const { useQuery } = useParams()
    const { getDataStoreData } = getSelectedKey()
    const { sectionName } = useGetSectionTypeLabel()

    function disable() {
        for (const filter of getDataStoreData?.filters?.dataElements) {
            if (!useQuery().get(filter.code)) return true
        }

        return false
    }

    function getFileName() {
        let name = "SEMIS - " + sectionName.substring(0, 1).toUpperCase() + sectionName.substring(1, sectionName.length) + " Attendance"
        for (const filter of getDataStoreData?.filters?.dataElements) {
            name += ' - ' + useQuery().get(filter.code)
        }

        return name
    }

    return { disable, getFileName }
}