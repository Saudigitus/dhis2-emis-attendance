import React, { useState } from 'react'
import classNames from 'classnames'
import { SimpleSearch } from '../../search'
import style from "./mainHeader.module.css"
import { DropdownButton, FlyoutMenu } from "@dhis2/ui"
import info from "../../../assets/images/headbar/info.svg"
import { HeadBarTypes } from '../../../types/headBar/HeadBarTypes'
import { componentMapping } from '../../../utils/commons/componentMapping'
import { useDataElementsParamMapping, useParams } from '../../../hooks'
import HeaderResetItemValue from './HeaderResetItemValue'

export default function HeaderItem(props: HeadBarTypes): React.ReactElement {
    const { label, value, placeholder, component, dataElementId, id, selected } = props;
    const { remove } = useParams()
    const paramsMapping = useDataElementsParamMapping()
    const [openDropDown, setOpenDropDown] = useState<boolean>(false);
    const onToggle = () => { setOpenDropDown(!openDropDown) }
    const Component = (component != null) ? componentMapping[component] : null;

    const onReset = () => {
        if(dataElementId)
            remove(paramsMapping[dataElementId as unknown as keyof typeof paramsMapping])
        else
            if(id === "c540ac7c") {
                remove("school");
                remove("schoolName");
            }
    }

    return (
        <DropdownButton
            open={openDropDown}
            onClick={onToggle}
            className={classNames(style.HeaderItemContainer, style[id])}
            component={
                < FlyoutMenu >
                    <SimpleSearch id={id} placeholder={placeholder}>
                        {(Component != null) && <Component dataElementId={dataElementId} onToggle={onToggle} />}
                    </SimpleSearch>
                </FlyoutMenu >
            }
        >
            <h5>{label} <span>{value}</span></h5>
            {selected && <HeaderResetItemValue onReset={onReset}/> }
            <img src={info} />
        </DropdownButton >
    )
}
