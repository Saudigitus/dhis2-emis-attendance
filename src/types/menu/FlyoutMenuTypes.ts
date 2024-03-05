interface FlyoutOptionsProps {
    label: string
    divider: boolean
    onClick: () => void
}

interface FlyoutMenuProps {
    options: FlyoutOptionsProps[]
}

export type { FlyoutOptionsProps, FlyoutMenuProps }
