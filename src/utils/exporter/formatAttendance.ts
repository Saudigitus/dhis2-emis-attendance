export function attendanceFormatter(data: any) {
    const localData: any = {}

    if (data != null) Object.keys(data).map((header: any) => {
        localData[header] = data[header].status
    })

    return localData
}