import Excel from 'exceljs'
import { saveAs } from 'file-saver'
import { getWorkSheets } from '../../utils/exporter/getWorkSheet';
import { alinhamento, border, fill } from '../../utils/exporter/exporterConsts';

export async function ExcelGenerator(headers: any[], rows: any[]): Promise<boolean> {
    const workbook = new Excel.Workbook();
    const workSheets = getWorkSheets(headers)
    let sheet = workbook.addWorksheet('teste');
    let columns: any = [];
    let colIndex = 1;
    let counter = 0;
    
    // const headers = formatHeaderToExcelExp(workSheets[workSheet])

    headers.forEach(section => {
        section.headers.forEach((headerInfo: any) => {
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
        const mergeCount = section.headers.length;

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
        section.headers.map(() => {
            counter++

            const cell = secondRow.getCell(counter);
            cell.fill = { fgColor: { argb: section.fill }, ...fill as unknown as any }
            cell.border = border as unknown as any
            cell.font = { bold: true };
        })
    })

    rows.map(row => { sheet.addRow(row) })

    const buf = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buf]), `teste.xlsx`)
    return true
}