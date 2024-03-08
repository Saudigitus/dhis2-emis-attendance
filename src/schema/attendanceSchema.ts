import { atom } from "recoil"
import { AttendanceAddNewProps, AttendanceModeProps, AttendanceProps, EnrollmentDetailsProps } from "../types/attendance/AttendanceTypes"

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


export const AttendanceModeState = atom<AttendanceModeProps>({
    key: "attendanceMode-state",
    default: {
        attendanceMode: "view"
    }
})
