import { getSelectedKey } from "../../commons/dataStore/getSelectedKey"

export const useAttendanceConst = () => {
    const { getDataStoreData } = getSelectedKey()

    function attendanceConst(key: "present" | "late" | "absent") {
        return getDataStoreData.attendance.statusOptions.find((option) => option.key === key)?.code
    }

    return {
        attendanceConst,
    }
}
