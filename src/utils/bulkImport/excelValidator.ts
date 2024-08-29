import { utils } from "xlsx";

export function excelValidate(sheetNames: any[], sheets: any) {
    const regex = /^\d{4}-\d{2}-\d{2}$/
    const regexSheetName = /^(January|February|March|April|May|June|July|August|September|October|November|December)-\d{4}$/;
    let validation_summary: any = {}
    let invalidSheetNames: string[] = []
    let sheetsWithInvaliHEaders: string[] = []
    let invalid = false

    function checkMajorHeaders(majorHeaders: string[]) {
        const allowedValues = ['Student profile', 'Enrollment details', 'Attendance'];

        if (majorHeaders.length !== 3) return false;

        // Create a Set to ensure uniqueness and check if all values are allowed
        const uniqueValues = new Set(majorHeaders);
        // Check if the Set has exactly 3 unique values and all of them are allowed
        return uniqueValues.size === 3 && [...uniqueValues].every(value => allowedValues.includes(value));
    }

    for (const sheetName of sheetNames) {
        validation_summary[sheetName] = { new: [], invalid: [] }
        /**
         * Validate sheet names to ensure that the user uploads the downloaded file without new or renamed sheets
         */
        if (!regexSheetName.test(sheetName)) {
            invalidSheetNames.push(sheetName)
            continue
        }

        const rawData = utils.sheet_to_json(sheets[sheetName], { header: 1, raw: false, dateNF: 'yyyy-mm-dd', defval: "" }) as unknown as Array<any>;
        const majorHeaders = rawData[0]?.filter((x: string) => x != '')
        const attendanceHeadersLength = rawData[1]?.filter((x: string) => regex.test(x)).length

        /**
         * Check if there are only three major headers : Student profile, Enrollment details and Attendance
         */
        if (!checkMajorHeaders(majorHeaders)) {
            sheetsWithInvaliHEaders.push(sheetName)
            continue
        }

        /**
         * Looks for empty attendance cells in each sheet
         */
        for (let j = 2; j < rawData.length; j++) {
            for (let i = rawData[j].length - 1; i >= (rawData[j].length - attendanceHeadersLength); i--) {

                if (!rawData[j][i]) {
                    invalid = true
                    const index = validation_summary[sheetName].invalid.findIndex((x: any) => x.ref == j + 1)

                    if (index == -1) validation_summary[sheetName].invalid = [...validation_summary[sheetName].invalid, { school: rawData[j][4], name: `${rawData[j][1]} ${rawData[j][2]}`, columns: 1, ref: j + 1 }]
                    else validation_summary[sheetName].invalid[index] = {
                        ...validation_summary[sheetName].invalid[index],
                        columns: (validation_summary[sheetName].invalid[index].columns + 1)
                    }
                } else {
                    const index = validation_summary[sheetName].new.findIndex((x: any) => x.ref == j + 1)

                    if (index == -1) validation_summary[sheetName].new = [...validation_summary[sheetName].new, { school: rawData[j][4], name: `${rawData[j][1]} ${rawData[j][2]}`, columns: 1, ref: j + 1 }]
                    else validation_summary[sheetName].new[index] = {
                        ...validation_summary[sheetName].new[index],
                        columns: (validation_summary[sheetName].new[index].columns + 1)
                    }
                }
            }
        }

    }

    return { invalid: invalid, summary: validation_summary, sheetsWithInvaliHEaders: sheetsWithInvaliHEaders, invalidSheetNames: invalidSheetNames }
}