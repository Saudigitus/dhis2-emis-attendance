interface MultipleButtonsProps {
    code: string
    type: string
    Component: any
    disabled?: boolean
}

interface ButtonProps {
    id: string
    selectedTerm: any
    items: MultipleButtonsProps[]
    setSelectedTerm: any
}

export type { MultipleButtonsProps, ButtonProps }
