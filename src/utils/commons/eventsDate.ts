import { format } from "date-fns";

export function getDate(apiVersion: string, selectedDate: Date): string {
    const pattern = /^2\.40/;

    if (pattern.test(apiVersion))
        return format(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1), "yyyy-MM-dd")
    else
        return format(new Date(selectedDate), "yyyy-MM-dd")
}