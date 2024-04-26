import { atom } from "recoil"
import { type AttendanceAddNewProps, type AttendanceModeProps, type AttendanceProps } from "../types/attendance/AttendanceTypes"

export const SelectedDateState = atom<AttendanceProps>({
    key: "attendanceViewEvents-state",
    default: {
        selectedDate: null
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
