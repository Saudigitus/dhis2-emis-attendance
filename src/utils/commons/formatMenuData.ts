import { InstanceAppType } from "../../types/instance/InstanceAppsTypes";
import { SideBarItemProps, SideBarSubItemProps } from "../../types/sideBar/SideBarTypes";

export function formatMenuData(menuData: SideBarItemProps[], appsList: InstanceAppType[]): SideBarItemProps[] {
    menuData?.filter((menuItem: SideBarItemProps) => !menuItem.displayInMenu)?.map((menuItem: SideBarItemProps) => {
        menuItem?.subItems?.map((menuSubItem: SideBarSubItemProps) => {
            menuSubItem.displayInMenu = Boolean(appsList?.find((app) => app.key === menuSubItem.appName))
        })
    })


    menuData?.filter((menuItem: SideBarItemProps) => !menuItem.displayInMenu)?.map((menuItem: SideBarItemProps) => {
        menuItem.displayInMenu = !Boolean(menuItem?.subItems?.every((menuSubItem: SideBarSubItemProps) => !menuSubItem.displayInMenu))
    })

    return menuData
}