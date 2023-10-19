import { atom } from "recoil"

interface AttendanceProps {
    selectedDate: Date
}

interface AttendanceAddNewProps {
    selectedDate: Date
}

interface EnrollmentDetailsProps {
    enrollmentDetails: string[]
}

interface AttendanceModeProps {
    attendanceMode: "edit" | "view"
}

export const SelectedDateState = atom<AttendanceProps>({
    key: "attendanceViewEvents-state",
    default: {
        selectedDate: new Date()
    }
})

export const SelectedDateAddNewState = atom<AttendanceAddNewProps>({
    key: "attendanceAddNewEvents-state",
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

export const AttendanceModeState = atom<AttendanceModeProps>({
    key: "attendanceMode-state",
    default: {
        attendanceMode: "view"
    }
})
