import React, { useState } from 'react'
import SideBarItem from './SideBarItem'
import style from "./sideBar.module.css"
import SibeBarCollapseBtn from './SibeBarCollapseBtn';
import { sideBarData } from "../../../utils/constants/sideBar/sideBarData"
import { getSelectedKey } from '../../../utils/commons/dataStore/getSelectedKey';

export default function SideBar(): React.ReactElement {
    const [collapsed, setCollapsed] = useState<boolean>(true);
    const academicYear = getSelectedKey().getDataStoreData.defaults.currentAcademicYear;

    return (
        <aside className={collapsed ? style.SideBarContainerCollapsed : style.SideBarContainer}>
            <div className={style.SideBarMenu}>
                {
                    sideBarData(academicYear).map((element, index) => (
                        <SideBarItem key={index} title={element.title} subItems={element.subItems} />
                    ))
                }
            </div>
            <SibeBarCollapseBtn collapsed={collapsed} setCollapsed={setCollapsed} />
        </aside>
    )
}
