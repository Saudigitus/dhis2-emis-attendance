import React, { useState } from 'react'
import style from "./sideBar.module.css"
import SideBarItem from './components/SideBarItem'
import SibeBarCollapseBtn from './components/SibeBarCollapseBtn';
import { sideBarData } from "../../../utils/constants/sideBar/sideBarData"
import { getDataStoreKeys } from '../../../utils/commons/dataStore/getDataStoreKeys';
import { useLocation } from 'react-router';

export default function SideBar(): React.ReactElement {
    const [collapsed, setCollapsed] = useState<boolean>(true);
    const { filterItems } = getDataStoreKeys()
    const location = useLocation()

    return (
        <aside className={collapsed ? style.SideBarContainerCollapsed : style.SideBarContainer}>
            <div className={style.SideBarMenu}>
                {
                    sideBarData(location.search, filterItems).map((element, index) => (
                        <SideBarItem key={index} title={element.title} subItems={element.subItems} />
                    ))
                }
            </div>
            <SibeBarCollapseBtn collapsed={collapsed} setCollapsed={setCollapsed} />
        </aside>
    )
}
