import { format } from "date-fns"
import { getDate } from "./eventsDate"

export function getDates(exporting = false, date: any, start: boolean, sysInfo = ""): string {
    let formatedDate: string

    if (exporting || !start) {
        if (!start) formatedDate = format(new Date(date.getFullYear(), date.getMonth(), date.getDate()), "yyyy-MM-dd")
        else formatedDate = getDate(sysInfo, date)
    }
    else formatedDate = format(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 5), "yyyy-MM-dd")

    return formatedDate
}
