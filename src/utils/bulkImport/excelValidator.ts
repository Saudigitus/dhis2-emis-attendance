import { utils } from "xlsx";

export function excelValidate(sheetNames: any[], sheets: any, allowedValues: any[]) {
    const regex = /^\d{4}-\d{2}-\d{2}$/
    const regexSheetName = /^(January|February|March|April|May|June|July|August|September|October|November|December)-\d{4}$/;
    let validation_summary: any = { new: [], invalid: [], invalidSheets: [] }
    let invalid = false

    function checkMajorHeaders(majorHeaders: string[]) {
        if (majorHeaders.length !== 4) return false;

        // Create a Set to ensure uniqueness and check if all values are allowed
        const uniqueValues = new Set(majorHeaders);
        // Check if the Set has exactly 3 unique values and all of them are allowed
        return uniqueValues.size === 4 && [...uniqueValues].every(value => allowedValues.includes(value));
    }

    for (const sheetName of sheetNames) {
        /**
         * Validate sheet names to ensure that the user uploads the downloaded file without new or renamed sheets
         */
        if (!regexSheetName.test(sheetName) && sheetName !== 'Metadata') {
            invalid = true
            validation_summary.invalidSheets = [...validation_summary.invalidSheets, { sheet: sheetName, description: "You either renamed or added this sheet into you excel file" }]
            continue
        }

        const rawData = utils.sheet_to_json(sheets[sheetName], { header: 1, raw: false, dateNF: 'yyyy-mm-dd', defval: "" }) as unknown as Array<any>;
        const majorHeaders = rawData[0]?.filter((x: string) => x != '')
        const attendanceHeadersLength = rawData[1]?.filter((x: string) => regex.test(x)).length

        /**
         * Check if there are only three major headers : Student profile, Enrollment details and Attendance
         */
        if (!checkMajorHeaders(majorHeaders) && sheetName !== 'Metadata') {
            invalid = true
            validation_summary.invalidSheets = [...validation_summary.invalidSheets, { sheet: sheetName, description: "This sheet contains invalid headers" }]
            continue
        }

        /**
         * Looks for empty attendance cells in each sheet
         */

        for (let j = 2; j < rawData.length; j++) {
            for (let i = rawData[j].length - 1; i >= (rawData[j].length - attendanceHeadersLength); i--) {

                if (!rawData[j][i]) {
                    const index = validation_summary.invalid.findIndex((x: any) => (x.ref == rawData[j][0] && x.sheet == sheetName))

                    if (index == -1)
                        validation_summary.invalid = [...validation_summary.invalid, { sheet: sheetName, school: rawData[j][8], name: `${rawData[j][2]} ${rawData[j][3]}`, columns: 1, ref: rawData[j][0] }]
                    else validation_summary.invalid[index] = {
                        ...validation_summary.invalid[index],
                        columns: (validation_summary.invalid[index].columns + 1)
                    }
                } else if (rawData[j][i] != 'Non School Day') {
                    const index = validation_summary.new.findIndex((x: any) => x.ref == rawData[j][0])

                    if (index == -1) validation_summary.new = [...validation_summary.new, { sheet: sheetName, school: rawData[j][8], name: `${rawData[j][2]} ${rawData[j][3]}`, columns: 1, ref: rawData[j][0] }]
                    else validation_summary.new[index] = {
                        ...validation_summary.new[index],
                        columns: (validation_summary.new[index].columns + 1)
                    }
                }
            }
        }

    }

    return { summary: validation_summary }
}