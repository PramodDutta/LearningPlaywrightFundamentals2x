# Playwright `test` API Cheatsheet (v1.5x+)

## Test Functions & Modifiers

| Function | Description | Example |
|---|---|---|
| `test()` | Create a test case | `test('Login', async ({ page }) => {})` |
| `test.only()` | Run only this test | `test.only('Login', async () => {})` |
| `test.skip()` | Skip the test | `test.skip('Not ready', async () => {})` |
| `test.fixme()` | Mark broken, skip execution | `test.fixme('Bug-101')` |
| `test.fail()` | Expect the test to fail | `test.fail('Known issue')` |
| `test.fail.only()` | Run only this expected-to-fail test | `test.fail.only()` |
| `test.slow()` | Triple the timeout | `test.slow()` |
| `test.setTimeout()` | Custom timeout (ms) | `test.setTimeout(60000)` |
| `test.step()` | Named reporting step | `await test.step('Login', async () => {})` |

## Suites

| Function | Description | Example |
|---|---|---|
| `test.describe()` | Group tests | `test.describe('Login Suite', () => {})` |
| `test.describe.only()` | Run only this group | `test.describe.only(...)` |
| `test.describe.skip()` | Skip the group | `test.describe.skip(...)` |
| `test.describe.fixme()` | Mark whole group fixme | `test.describe.fixme(...)` |
| `test.describe.parallel()` | Run group in parallel | `test.describe.parallel(...)` |
| `test.describe.serial()` | Run group serially, stop on first failure | `test.describe.serial(...)` |
| `test.describe.configure()` | Set mode / retries / timeout | `test.describe.configure({ mode: 'parallel' })` |

## Hooks

| Hook | Runs |
|---|---|
| `test.beforeAll()` | Once before all tests in scope |
| `test.beforeEach()` | Before every test |
| `test.afterEach()` | After every test |
| `test.afterAll()` | Once after all tests in scope |

Order: `beforeAll` -> (`beforeEach` -> test -> `afterEach`) x N -> `afterAll`.
Scope = file, or the `describe` block it sits in. Nested describes run outer hooks first.

## Fixtures & Metadata

| Function | Description | Example |
|---|---|---|
| `test.use()` | Apply fixture options | `test.use({ viewport: { width: 1280, height: 720 } })` |
| `test.extend()` | Create custom fixtures | `const test = base.extend({...})` |
| `test.info()` | Runtime test info | `test.info().title` |

## Conditional Modifiers

Call inside the test body, condition first.

| Function | Purpose | Example |
|---|---|---|
| `test.skip(condition)` | Skip if true | `test.skip(browserName === 'webkit')` |
| `test.fail(condition)` | Expect failure if true | `test.fail(browserName === 'firefox')` |
| `test.fixme(condition)` | Skip known broken | `test.fixme(isMobile)` |
| `test.slow(condition)` | Triple timeout if true | `test.slow(browserName === 'chromium')` |

## `test.info()` Properties

| Property | Description |
|---|---|
| `.title` | Test title |
| `.status` | Final status |
| `.expectedStatus` | Expected result |
| `.retry` | Current retry number (0 = first run) |
| `.workerIndex` | Worker ID |
| `.project` | Current project |
| `.outputDir` | Output directory |
| `.attachments` | Test attachments |
| `.errors` | Errors encountered |
| `.config` | Test configuration |

## `test.step()` Example

```ts
test('Checkout', async ({ page }) => {
  await test.step('Open Website', async () => {
    await page.goto('https://example.com');
  });

  await test.step('Login', async () => {
    // login code
  });

  await test.step('Verify Dashboard', async () => {
    // assertions
  });
});
```
