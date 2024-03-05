interface MultipleButtonsProps {
    code: string
    type: string
    Component: any
}

interface ButtonProps {
    id: string
    selectedTerm: any
    items: MultipleButtonsProps[]
    setSelectedTerm: any
}

export type { MultipleButtonsProps, ButtonProps }