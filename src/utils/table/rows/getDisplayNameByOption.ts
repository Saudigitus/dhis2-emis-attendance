import { DefaultProps } from "../../../types/utils/table/FormatRowsDataTypes"

export function getDisplayName({ attribute, value }: DefaultProps): string {
    if ((attribute.options?.optionSet?.options) != null) {
        for (const op of attribute.options?.optionSet?.options || []) {
            if (op.value === value) return op.label
        }
    }
    return value
}
