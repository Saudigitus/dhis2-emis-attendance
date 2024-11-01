interface SideBarItemProps {
    title: string
    displayInMenu?: boolean
    subItems: SideBarSubItemProps[]
}

interface SideBarItemTitleProps {
    title: string
}

interface SideBarSubItemProps {
    label: string
    displayInMenu?: boolean
    showBadge: boolean
    icon: string
    disabled: boolean
    route: string
    appName: string
    pathName: string
}

interface SideBarCollapseProps {
    collapsed: boolean
    setCollapsed: (collapsed: boolean) => void
}
export type { SideBarItemProps, SideBarItemTitleProps, SideBarSubItemProps, SideBarCollapseProps }
