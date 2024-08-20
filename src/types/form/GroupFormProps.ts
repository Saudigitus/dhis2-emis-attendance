import { CustomAttributeProps } from "../variables/AttributeColumns"

interface GroupFormProps {
    name: string
    description?: string
    fields: CustomAttributeProps[]
    disabled: boolean
    trackedEntity?: string
    setValue?: (args: any) => void
    value?: any[]
}

export type { GroupFormProps }