import { useRecoilValue } from "recoil";
import { useLocation } from "react-router-dom";
import { InstanceAppState } from "../../schema/instanceAppsSchema";
import { formatMenuData } from "../../utils/commons/formatMenuData";
import { sideBarData } from "../../utils/constants/sideBar/sideBarData";
import { getDataStoreKeys } from "../../utils/commons/dataStore/getDataStoreKeys";

const useMenuData = () => {
    const location = useLocation()
    const { filterItems } = getDataStoreKeys()
    const instanceApps = useRecoilValue(InstanceAppState)

    return {
        menuData: formatMenuData(sideBarData(location.search, filterItems), instanceApps)
    }
}

export { useMenuData }