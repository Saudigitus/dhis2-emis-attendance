import {enrollmentStatus} from "../../../types/variables/AttributeColumns";

export function checkCanceled(status: string): boolean {
    console.log(enrollmentStatus.CANCELLED, status)
    return enrollmentStatus.CANCELLED === status
}
