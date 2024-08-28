import { utils } from "xlsx";

export function excelValidate(sheetNames: any[], sheets: any) {
    const regex = /^\d{4}-\d{2}-\d{2}$/
    const regexSheetName = /^(January|February|March|April|May|June|July|August|September|October|November|December)-\d{4}$/;

    function checkMajorHeaders(majorHeaders: string[]) {
        const allowedValues = ['Student profile', 'Enrollment details', 'Attendance'];

        if (majorHeaders.length !== 3) return false;

        // Create a Set to ensure uniqueness and check if all values are allowed
        const uniqueValues = new Set(majorHeaders);
        // Check if the Set has exactly 3 unique values and all of them are allowed
        return uniqueValues.size === 3 && [...uniqueValues].every(value => allowedValues.includes(value));
    }

    for (const sheetName of sheetNames) {
        let invalid = false

        /**
         * Validate sheet names to ensure that the user uploads the downloaded file without new or renamed sheets
         */
        if (!regexSheetName.test(sheetName)) return { invalid: true, msg: `You either renamed or added new sheet into you excel file, "${sheetName}" is invalid!` }

        const rawData = utils.sheet_to_json(sheets[sheetName], { header: 1, raw: false, dateNF: 'yyyy-mm-dd', defval: "" }) as unknown as Array<any>;
        const majorHeaders = rawData[0]?.filter((x: string) => x != '')
        const attendanceHeadersLength = rawData[1]?.filter((x: string) => regex.test(x)).length
        let empty_cells: any[] = []

        /**
         * Check if there are only three major headers : Student profile, Enrollment details and Attendance
         */
        if (!checkMajorHeaders(majorHeaders)) return { invalid: true, sheet: sheetName, msg: "There are invalid headers in sheet " + sheetName }

        /**
         * Looks for empty attendance cells in each sheet
         */
        for (let j = 2; j < rawData.length; j++) {
            for (let i = rawData[j].length - 1; i >= (rawData[j].length - attendanceHeadersLength); i--) {
                if (!rawData[j][i]) {
                    invalid = true
                    const index = empty_cells.findIndex(x => x.row == j + 1)

                    if (index == -1) empty_cells = [...empty_cells, { name: `${rawData[j][1]} ${rawData[j][2]}`, columns: 1, row: j + 1 }]
                    else empty_cells[index] = { ...empty_cells[index], columns: (empty_cells[index].columns + 1) }
                }
            }
        }

        if (invalid) return { invalid: invalid, sheet: sheetName, invalidData: empty_cells, msg: "There are empty attendance cells" }
    }

}