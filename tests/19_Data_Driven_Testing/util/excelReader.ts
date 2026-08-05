import * as path from 'path';
import ExcelJS from 'exceljs';
import type { LoginRow } from './yamlReader';

/**
 * Reads the first (or named) worksheet of an .xlsx file.
 * Row 1 must be the header row, its cell values become object keys.
 * exceljs is async, so this returns a Promise.
 */
export async function readExcel<T = Record<string, unknown>>(
    filePath: string,
    sheetName?: string
): Promise<T[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path.resolve(filePath));

    const sheet = sheetName ? workbook.getWorksheet(sheetName) : workbook.worksheets[0];
    if (!sheet) {
        throw new Error(`Sheet ${sheetName ?? '#1'} not found in ${filePath}`);
    }

    const headers: string[] = [];
    sheet.getRow(1).eachCell({ includeEmpty: true }, (cell, col) => {
        headers[col] = String(cell.value ?? '').trim();
    });

    const data: T[] = [];
    sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) return; // header
        const record: Record<string, unknown> = {};
        headers.forEach((header, col) => {
            if (!header) return;
            const value = row.getCell(col).value;
            record[header] = value ?? '';
        });
        data.push(record as T);
    });

    return data;
}

/** Same file, mapped to the shared LoginRow shape. */
export async function readLoginDataFromExcel(filePath: string): Promise<LoginRow[]> {
    const rows = await readExcel<Record<string, unknown>>(filePath, 'LoginData');

    return rows.map((r) => ({
        description: String(r.description ?? ''),
        username: String(r.username ?? ''),
        password: String(r.password ?? ''),
        // Excel gives a real boolean, but a "TRUE"/"true" string is also handled.
        shouldPass: r.shouldPass === true || String(r.shouldPass).toLowerCase() === 'true',
        expectedError: String(r.expectedError ?? ''),
    }));
}
