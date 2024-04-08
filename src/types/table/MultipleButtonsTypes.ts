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
    disabled?: boolean
}

export type {MultipleButtonsProps, ButtonProps}
