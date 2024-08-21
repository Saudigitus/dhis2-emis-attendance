import { format } from "date-fns";

export function getWorkSheets(dates: any[]) {
    const regex = /^\d{4}-\d{2}-\d{2}$/
    const headersToFormat = dates.filter(date => regex.test(date?.displayName))
    const attributes = dates.filter(att => !regex.test(att?.displayName))
    const groupedDates: any = {};

    headersToFormat.forEach(dateStr => {
        const date = new Date(dateStr.header);
        const yearMonth = `${format(date, 'MMMM')}-${date.getFullYear()}`;

        if (!groupedDates[yearMonth]) {
            groupedDates[yearMonth] = [...attributes];
        }

        groupedDates[yearMonth].push(dateStr);
    });

    return groupedDates;
}

