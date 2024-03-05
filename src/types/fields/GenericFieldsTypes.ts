import { CustomAttributeProps } from "../variables/AttributeColumns"

interface GenericFieldsProps {
    disabled: boolean
    required: string | boolean
    type?: string
    optionSet?: CustomAttributeProps["options"]
}

export type {GenericFieldsProps}
