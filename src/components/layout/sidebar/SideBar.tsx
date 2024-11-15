import React, { useState } from 'react'
import style from "./sideBar.module.css"
import SideBarItem from './components/SideBarItem'
import { useMenuData } from '../../../hooks/menu/useMenuData';
import SibeBarCollapseBtn from './components/SibeBarCollapseBtn';

export default function SideBar(): React.ReactElement {
    const { menuData: sideBarData} = useMenuData()
    const [collapsed, setCollapsed] = useState<boolean>(true);

    return (
        <aside className={collapsed ? style.SideBarContainerCollapsed : style.SideBarContainer}>
            <div className={style.SideBarMenu}>
                {
                    sideBarData?.filter((element) => element.displayInMenu).map((element, index) => (
                        <SideBarItem key={index} title={element.title} subItems={element.subItems} />
                    ))
                }
            </div>
            <SibeBarCollapseBtn collapsed={collapsed} setCollapsed={setCollapsed} />
        </aside>
    )
}
