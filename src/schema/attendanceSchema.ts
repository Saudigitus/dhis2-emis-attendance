import { atom } from "recoil"

interface AttendanceProps {
    selectedDate: Date
}

interface EnrollmentDetailsProps {
    enrollmentDetails: string[]
}

export const SelectedDateState = atom<AttendanceProps>({
    key: "attendance-state",
    default: {
        selectedDate: new Date()
    }
})

export const EnrollmentDetailsTeisState = atom<EnrollmentDetailsProps>({
    key: "enrollmentDetailsTeis-state",
    default: {
        enrollmentDetails: []
    }
})
