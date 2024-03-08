interface AttendanceProps {
    selectedDate: Date
}

interface AttendanceAddNewProps {
    selectedDate: Date
}

interface EnrollmentDetailsProps {
    enrollmentDetails: string[]
}

interface AttendanceModeProps {
    attendanceMode: "edit" | "view"
}

interface SchoolCalendar {
    classPeriods: [
        {
            description: string
            endDate: string
            startDate: string
        }
    ],
    holidays: [
        {
            date: any
            event: string
        }
    ],
    weekDays: {
        friday: boolean,
        monday: boolean,
        saturday: boolean,
        sunday: boolean,
        thursday: boolean,
        tuesday: boolean,
        wednesday: boolean
    }
}

export type { AttendanceProps, AttendanceAddNewProps, EnrollmentDetailsProps, AttendanceModeProps, SchoolCalendar }