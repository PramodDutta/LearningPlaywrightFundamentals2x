# Data-driven Playwright tests: sync vs async data sources

## Problem
Playwright collects tests synchronously, so a data source that can only be read
asynchronously (MySQL, exceljs) cannot generate one `test()` per data row.

## Approach
1. Split data sources by read style.
   - Sync (`fs.readFileSync`): JSON, CSV, YAML. Read at module top level, then
     `for (const row of rows) test(...)`. One test per row, full parallelism,
     per-row reporting.
   - Async (mysql2, exceljs): read in `test.beforeAll`, then a single `test()`
     that loops rows with `await test.step(...)`. Steps still show per row in
     the HTML report.
2. Give every reader the same output shape (`LoginRow`), so specs stay identical
   apart from the loader. Map DB snake_case (`should_pass`) to camelCase there.
3. Gate anything needing external infra: `test.skip(!process.env.MYSQL_HOST, ...)`
   in `beforeAll` so the suite is green on a machine without a DB.
4. Binary fixtures (.xlsx) get a committed generator script
   (`util/generateExcel.js`, plain CJS, `node <file>`), so the sheet is
   reproducible and reviewable instead of an opaque blob.

## Judgment calls (not done, and why)
- No `globalSetup` dumping MySQL/Excel to JSON so specs could import it
  synchronously. It works and gives real per-row tests, but it adds a build step
  and a stale-cache failure mode. Noted in a spec comment as the upgrade path.
- No top-level `await` / ESM spec files. Project is CJS; switching module systems
  for one feature is not worth it.
- Used `exceljs`, not the `xlsx` package: `xlsx` on npm is unmaintained with an
  open prototype-pollution CVE.
- Left the assertions commented out, matching the existing 297/298 specs. Those
  demo pages do not return the expected errors yet.

## Reusable rule
Test-collection is synchronous: if the data cannot be read synchronously, do not
fake per-row tests, load in `beforeAll` and use `test.step` per row, or move the
read into `globalSetup` and import its JSON output.
