interface MenuItemType {
    label: string
    value: string
}

interface MenuItemProps {
    onToggle: () => void 
    dataElementId: string
    menuItems: MenuItemType[]
}

interface MenuItemContainerProps {
    onToggle: () => void 
    dataElementId: string
}

type ComponentMapping = Record<string, React.ComponentType<any>>;

type ParamsMapping = Record<string, string>;

export type { MenuItemType, ComponentMapping, ParamsMapping, MenuItemProps, MenuItemContainerProps }
