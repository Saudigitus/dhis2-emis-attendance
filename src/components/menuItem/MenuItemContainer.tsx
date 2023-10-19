import React from 'react'
import Item from './Item';
import { useRecoilValue } from 'recoil';
import { ProgramConfigState } from '../../schema/programSchema';
import { formatResponse } from '../../utils/table/header/formatResponse';

function MenuItemContainer({ dataElementId, onToggle }: { dataElementId: string, onToggle: () => void }): React.ReactElement {
    const programConfigState = useRecoilValue(ProgramConfigState);
    console.log(programConfigState);
    const options = formatResponse(programConfigState)?.find(element => element.id === dataElementId)?.options.optionSet.options ?? [];

    console.log(options, 'options');

    return (
        <Item onToggle={onToggle} dataElementId={dataElementId} menuItems={options} />
    )
}
export default MenuItemContainer
