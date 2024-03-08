import { atom } from "recoil"
import { EnrollmentDetailsProps } from "../types/attendance/AttendanceTypes"

export const EnrollmentDetailsTeisState = atom<EnrollmentDetailsProps>({
    key: "enrollmentDetailsTeis-state",
    default: {
        enrollmentDetails: []
    }
})