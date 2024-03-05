import { DataStoreRecord } from "../dataStore/DataStoreConfig";
import { SelectedOptionsTypes } from "../headBar/HeadBarTypes";
import { ProgramStageDataElements } from "../programStageConfig/ProgramStageConfig";

interface HeadBarDataProps {
    selectedOptions: SelectedOptionsTypes
    dataStoreData: DataStoreRecord
    programStageDataElements: ProgramStageDataElements[]
}

interface SideBarDataProps {
    locationParms : string
}

type SideBarDataRouteProps = {
    location: string 
    sectionType: string
}


export type { HeadBarDataProps, SideBarDataProps, SideBarDataRouteProps }