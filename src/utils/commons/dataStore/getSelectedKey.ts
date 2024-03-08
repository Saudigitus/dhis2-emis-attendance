import { useRecoilValue } from "recoil";
import { useParams } from "../../../hooks";
import { DataStoreState } from "../../../schema/dataStoreSchema"
import { DataStoreRecord } from "../../../types/dataStore/DataStoreConfig";

export const getSelectedKey = () => {
    const { useQuery } = useParams()
    const emisConfig = useRecoilValue(DataStoreState);

    const getDataStoreData: DataStoreRecord = emisConfig?.length > 0 ? emisConfig?.find((dataStore: DataStoreRecord) => dataStore.key === useQuery().get("sectionType")) ?? {} as unknown as DataStoreRecord : {} as unknown as DataStoreRecord

    return { getDataStoreData }
}
