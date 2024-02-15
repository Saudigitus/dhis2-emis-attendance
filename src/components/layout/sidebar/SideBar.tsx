import React, { useState } from 'react'
import style from "./SideBar.module.css"
import SideBarItem from './SideBarItem'
import { sideBarData } from "../../../utils/constants/sideBar/sideBarData"
import SibeBarCollapseBtn from './SibeBarCollapseBtn';
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
