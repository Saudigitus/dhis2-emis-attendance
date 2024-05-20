import { unavailableSchoolDays } from "../../constants/attendance/unavailableSchoolDays";
import { format } from "date-fns";

export function generateAttendanceDays() {
    const { unavailableDays } = unavailableSchoolDays()

    const getValidDays = (date: Date) => {
        let validDays = []
        let counter = 0

        do {
            let currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - counter)

            if (!unavailableDays(currentDate)) validDays.unshift({ schoolDay: true, date: format(currentDate, "yyyy-MM-dd") })
            else validDays.unshift({ schoolDay: false, date: format(currentDate, "yyyy-MM-dd") })

            counter++
        } while (validDays.length < 5)

        return validDays
    }

    return { getValidDays }
}