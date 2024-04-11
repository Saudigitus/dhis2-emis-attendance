import {enrollmentStatus} from "../../../types/variables/AttributeColumns";

export function checkCanceled(status: string): boolean {
    return enrollmentStatus.CANCELLED === status
}
