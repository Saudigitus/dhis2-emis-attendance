import React from 'react'
import Item from './Item';
import { useRecoilValue } from 'recoil';
import { ProgramConfigState } from '../../schema/programSchema';
import { MenuItemContainerProps } from '../../types/menu/MenuItemTypes';
import { formatResponse } from '../../utils/table/header/formatResponse';
import { getSelectedKey } from '../../utils/commons/dataStore/getSelectedKey';

function MenuItemContainer(props: MenuItemContainerProps): React.ReactElement {
    const { dataElementId, onToggle } = props;
    const programConfigState = useRecoilValue(ProgramConfigState);
    const { getDataStoreData } = getSelectedKey()
    const registrationProgramStage = getDataStoreData.registration.programStage
    const options = formatResponse({ data: programConfigState, programStageId:registrationProgramStage})?.find(element => element.id === dataElementId)?.options?.optionSet?.options ?? [];

    return (
        <Item onToggle={onToggle} dataElementId={dataElementId} menuItems={options} />
    )
}
export default MenuItemContainer
