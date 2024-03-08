interface DropDownCalendarProps {
    open: boolean
    anchorEl: HTMLElement | null
    close: () => void
    setValue: ({ selectedDate }: { selectedDate: Date }) => void
    localAttendanceMode: "edit" | "view"
    setAttendanceMode: (arg: "edit" | "view") => void
}

interface CalendarProps {
    value: { selectedDate: Date }
    setValue: ({ selectedDate }: { selectedDate: Date }) => void
}

export type { DropDownCalendarProps, CalendarProps }