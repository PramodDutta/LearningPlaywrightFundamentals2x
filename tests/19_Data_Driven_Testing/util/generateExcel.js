/**
 * Generates test-data/login-data.xlsx from the same rows used by CSV/JSON/YAML.
 * Run:  node tests/19_Data_Driven_Testing/util/generateExcel.js
 */
const path = require('path');
const ExcelJS = require('exceljs');

const rows = [
    ['valid credentials', 'admin@gamil.com', 'admin123', true, ''],
    ['invalid password', 'admin@gamil.com', 'wrongpass', false, 'Invalid credentials'],
    ['empty username', '', 'admin123', false, 'Username is required'],
    ['empty password', 'admin@gamil.com', '', false, 'Password is required'],
    ['locked account', 'locked_user@gamil.com', 'pass123', false, 'Account is locked'],
    ['special chars', 'admin@gamil.com', 'p@$$w0rd!', true, ''],
    ["SQL injection attempt", "admin' OR '1'='1", 'password', false, 'Invalid credentials'],
];

(async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('LoginData');

    sheet.addRow(['description', 'username', 'password', 'shouldPass', 'expectedError']);
    sheet.getRow(1).font = { bold: true };
    rows.forEach((r) => sheet.addRow(r));
    sheet.columns.forEach((c) => (c.width = 24));

    const out = path.join(__dirname, '..', 'test-data', 'login-data.xlsx');
    await workbook.xlsx.writeFile(out);
    console.log(`Wrote ${rows.length} rows -> ${out}`);
})();
