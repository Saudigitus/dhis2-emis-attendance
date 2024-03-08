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

export type { AttendanceProps, AttendanceAddNewProps, EnrollmentDetailsProps, AttendanceModeProps }