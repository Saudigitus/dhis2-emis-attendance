import Excel from 'exceljs'
import { saveAs } from 'file-saver'
import { getWorkSheets } from '../../utils/exporter/getWorkSheet';
import { alignment, border, dataValidation, fill, lock } from '../../utils/exporter/exporterConsts';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { ProgressState } from '../../schema/linearProgress';
import { dfHeaders } from '../../utils/exporter/generateExcelHeaders';
import { unavailableSchoolDays } from '../../utils/constants/attendance/unavailableSchoolDays';
import { ProgramConfigState } from '../../schema/programSchema';
import { getMetaData } from '../../utils/exporter/getMetadata';
import { getSelectedKey } from '../../utils/commons/dataStore/getSelectedKey';
import metadataHeaders from '../../utils/constants/exportTemplate/metadataHeaders.json'

export function gererateFile() {
    const { getDataStoreData } = getSelectedKey()
    const password = '#saudigitus_SEMIS_Attendance#'
    const program = useRecoilValue(ProgramConfigState)
    const { unavailableDays } = unavailableSchoolDays()
    const updateProgress = useSetRecoilState(ProgressState)
    const metadata = getMetaData(program, getDataStoreData)

    async function ExcelGenerator(headers: any[], rows: any[], filters: string) {

        const workbook = new Excel.Workbook();
        const workSheets = getWorkSheets(headers.find(x => x.name === 'Attendance').headers)
        const regex = /^\d{4}-\d{2}-\d{2}$/
        let sheet: any = {};

        Object.keys(workSheets).map((workSheet) => {
            let columns: any = [], colIndex = 1, counter = 0

            sheet = workbook.addWorksheet(workSheet)

            headers.forEach(section => {
                (section.name == 'Attendance' ? workSheets[workSheet] : section.headers).forEach((headerInfo: any) => {
                    columns.push({
                        header: section.name,
                        key: headerInfo.key,
                        width: headerInfo.width,
                        subHeader: headerInfo.header,
                    });
                });
            });

            sheet.columns = columns;

            // Add the subheaders to the second row
            let secondRow = sheet.getRow(2);
            secondRow.values = columns.map((col: any) => col.subHeader);

            // Merge cells in the first row for headers with multiple subheaders 
            headers.forEach(section => {
                const mergeCount = (section.name == 'Attendance' ? workSheets[workSheet] : section.headers).length;

                if (mergeCount > 1) {
                    sheet.mergeCells(1, colIndex, 1, colIndex + mergeCount - 1);
                }

                const cell = sheet.getCell(1, colIndex);
                cell.fill = { fgColor: { argb: section.fill }, ...fill as unknown as any }
                cell.border = border as unknown as any
                cell.font = { bold: true };
                cell.alignment = alignment as unknown as any;

                colIndex += mergeCount;
            });

            headers.map((section) => {
                (section?.name == 'Attendance' ? workSheets[workSheet] : section.headers).map(() => {
                    counter++

                    const cell = secondRow.getCell(counter);
                    cell.fill = { fgColor: { argb: section.fill }, ...fill as unknown as any }
                    cell.border = border as unknown as any
                    cell.font = { bold: true };
                })
            })

            rows.map(row => sheet.addRow(row))

            const headerRow = sheet.getRow(2);
            headerRow.eachCell((headerCell: any, colIndex: number) => {
                const columnHeader = headerCell.value;
                const colKey = sheet.getColumn(colIndex)._key
                const index = dfHeaders.findIndex(x => x.key === colKey)

                if (index !== -1 || colKey === 'dataElements') {
                    const col = sheet.getColumn(colIndex)
                    col.hidden = true
                }

                if (regex.test(columnHeader as string)) {
                    sheet.eachRow((row: any) => {
                        const cell = row.getCell(colIndex);
                        cell.dataValidation = { ...dataValidation, formulae: ['"' + filters + '"'] };
                    });
                }
            });

            sheet.eachRow({ includeEmpty: true }, (row: any) => {
                row.eachCell({ includeEmpty: true }, (cell: any) => {
                    if (regex.test(cell._column._key) && cell._row._number > 2) {
                        if (unavailableDays(new Date(cell._column._key))) {

                            cell.dataValidation = null
                            cell.value = 'Non School Day'
                            cell.fill = { fgColor: { argb: 'f8f9fa' }, ...fill as unknown as any }
                            cell.border = border as unknown as any
                            cell.font = { size: 10 };

                        } else cell.protection = { locked: false };
                    } else if (cell._row._number > 2) {
                        cell.fill = { fgColor: { argb: 'f8f9fa' }, ...fill as unknown as any }
                        cell.border = border as unknown as any
                    }
                });
            });

            sheet.protect(password, lock);
        })

        sheet = workbook.addWorksheet('Metadata')
        sheet.columns = metadataHeaders
        metadata.map((row: any) => sheet.addRow(row))
        sheet.protect(password, lock)

        const buf = await workbook.xlsx.writeBuffer()
        saveAs(new Blob([buf]), `teste.xlsx`)
        updateProgress({ progress: 100 })
    }

    return { ExcelGenerator }
}