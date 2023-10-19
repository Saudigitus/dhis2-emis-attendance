import { useSearchParams } from "react-router-dom"
import { useRecoilState } from "recoil"
import { AttendanceModeState } from "../../schema/attendanceSchema"

export const useAttendanceMode = () => {
    const [attendanceMode, setattendanceModeState] = useRecoilState(AttendanceModeState)
    const [searchParams] = useSearchParams()

    function setAttendanceMode(mode: "edit" | "view") {
        setattendanceModeState({ attendanceMode: mode })
    }

    function setInitialAttendanceMode() {
        if (!searchParams.has("attendanceMode")) {
            setattendanceModeState({ attendanceMode: "view" })
        }
    }

    return {
        attendanceMode: attendanceMode.attendanceMode,
        setAttendanceMode,
        setInitialAttendanceMode
    }
}
