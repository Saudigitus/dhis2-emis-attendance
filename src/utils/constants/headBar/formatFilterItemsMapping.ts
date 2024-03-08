import { FilterDataElements } from "../../../types/dataStore/DataStoreConfig";

const formatFilterItems = (filters: FilterDataElements[]) => {
    const formattedObject: Record<string, string> = {}
    filters?.forEach(item => { formattedObject[item.dataElement] = item.code});
    return formattedObject;
}

export { formatFilterItems }