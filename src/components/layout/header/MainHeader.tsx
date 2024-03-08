import React from 'react'
import HeaderItem from './HeaderItem'
import { useParams } from '../../../hooks'
import style from "./mainHeader.module.css"
import { headBarData } from '../../../utils/constants/headBar/headBarData'
import { getSelectedKey } from '../../../utils/commons/dataStore/getSelectedKey'
import { ProgramConfig } from '../../../types/programConfig/ProgramConfig'
import { ProgramStageDataElements } from '../../../types/programStageConfig/ProgramStageConfig'
import { ProgramConfigState } from '../../../schema/programSchema'
import { useRecoilValue } from 'recoil'

export default function MainHeader(): React.ReactElement {
    const { urlParamiters } = useParams();
    const selectedOptions = urlParamiters();
    const { getDataStoreData } = getSelectedKey();
    const programConfig : ProgramConfig = useRecoilValue(ProgramConfigState)
    const programStageDataElements : ProgramStageDataElements[] | any = programConfig?.programStages?.find((programStage: any) => programStage.id === getDataStoreData.registration.programStage)?.programStageDataElements

    return (
        <nav className={style.MainHeaderContainer}>
            {headBarData({ selectedOptions, dataStoreData:getDataStoreData, programStageDataElements}).map(haderItem => (
                <HeaderItem key={haderItem.id} id={haderItem.id} dataElementId={haderItem.dataElementId} component={haderItem.component} placeholder={haderItem.placeholder} label={haderItem.label} value={haderItem.value} selected={haderItem.selected}/>
            ))}
        </nav>
    )
}
