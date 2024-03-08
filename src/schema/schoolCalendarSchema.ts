import { atom } from "recoil"
import { SchoolCalendar } from "../types/attendance/AttendanceTypes"

export const SchoolCalendarSate = atom<SchoolCalendar>({
    key: "schoolCalendar-state",
    default: undefined
})