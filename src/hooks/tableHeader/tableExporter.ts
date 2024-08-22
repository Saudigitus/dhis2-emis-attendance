import Excel from 'exceljs'
import { saveAs } from 'file-saver'
import { getWorkSheets } from '../../utils/exporter/getWorkSheet';
import { alinhamento, border, dataValidation, fill, lock } from '../../utils/exporter/exporterConsts';

export async function ExcelGenerator(headers: any[], rows: any[]): Promise<boolean> {
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
            cell.alignment = alinhamento as unknown as any;

            colIndex += mergeCount;
        });

        headers.map((section) => {
            (section.name == 'Attendance' ? workSheets[workSheet] : section.headers).map(() => {
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
            if (regex.test(columnHeader as string)) {
                sheet.eachRow((row: any) => {
                    const cell = row.getCell(colIndex);
                    cell.dataValidation = dataValidation;
                });
            }
        });

        sheet.eachRow({ includeEmpty: true }, (row: any) => {
            row.eachCell({ includeEmpty: true }, (cell: any) => {
                if (regex.test(cell._column._key) && cell._row._number > 2) {
                    cell.protection = { locked: false };
                }
            });
        });

        sheet.protect('#saudigitus_SEMIS_app', lock);
    })

    const buf = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buf]), `teste.xlsx`)
    return true
}