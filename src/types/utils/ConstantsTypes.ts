import { DataStoreRecord } from "../dataStore/DataStoreConfig";
import { SelectedOptionsTypes } from "../headBar/HeadBarTypes";

interface HeadBarDataProps {
    selectedOptions: SelectedOptionsTypes
    dataStoreData: DataStoreRecord
}

interface SideBarDataProps {
    locationParms : string
}

type SideBarDataRouteProps = {
    location: string 
    sectionType: string
}


export type { HeadBarDataProps, SideBarDataProps, SideBarDataRouteProps }