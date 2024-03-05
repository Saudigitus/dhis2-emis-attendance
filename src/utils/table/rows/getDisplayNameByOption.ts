
interface defaultProps {
    attribute: {
        id: string
        options?: {
            optionSet: {
                id: string
                options: [{
                    value: string
                    label: string
                }]
            }
        }
    }
    value: string | any
}

export function getDisplayName({ attribute, value }: defaultProps): string {
    if ((attribute.options?.optionSet?.options) != null) {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        for (const op of attribute.options?.optionSet?.options || []) {
            if (op.value === value) return op.label
        }
    }
    return value
}
