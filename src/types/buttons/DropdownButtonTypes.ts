import { FlyoutOptionsProps } from "../menu/FlyoutMenuTypes"

interface DropdownButtonProps {
    name: string
    icon?: React.ReactNode
    options: FlyoutOptionsProps[]
    disabled: boolean
  
}

export type { DropdownButtonProps }