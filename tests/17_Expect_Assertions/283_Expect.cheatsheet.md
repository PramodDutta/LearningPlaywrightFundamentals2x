# Playwright `expect` Assertions — Interview Cheatsheet

Quick reference of every common `expect` assertion in Playwright. One example each. Format: **What** → **How** → **Example**.

> Auto-retrying assertions (Locator / Page / APIResponse) MUST be `await`-ed. Value assertions (numbers, strings, booleans) are synchronous — no `await`.

---

## 1. Value Assertions (non-retrying, synchronous)

### `toBe`
- **What:** Strict equality (`===`). Primitives or same reference.
- **How:** `expect(value).toBe(expected)`
```ts
expect(1 + 2).toBe(3);
```

### `toEqual`
- **What:** Deep equality. Use for objects/arrays.
- **How:** `expect(obj).toEqual(expectedObj)`
```ts
expect({ a: 1, b: 2 }).toEqual({ b: 2, a: 1 });
```

### `toStrictEqual`
- **What:** Deep equality + same type + no extra undefined props.
- **How:** `expect(obj).toStrictEqual(expectedObj)`
```ts
expect({ a: 1 }).toStrictEqual({ a: 1 });
```

### `toBeTruthy` / `toBeFalsy`
- **What:** Asserts truthy/falsy in JS sense.
- **How:** `expect(value).toBeTruthy()`
```ts
expect('hello').toBeTruthy();
expect(0).toBeFalsy();
```

### `toBeNull` / `toBeUndefined` / `toBeDefined` / `toBeNaN`
- **What:** Check `null`, `undefined`, defined, or `NaN`.
```ts
expect(null).toBeNull();
expect(undefined).toBeUndefined();
expect(42).toBeDefined();
expect(NaN).toBeNaN();
```

### `toBeGreaterThan` / `toBeLessThan` / `toBeGreaterThanOrEqual` / `toBeLessThanOrEqual`
- **What:** Numeric comparison.
```ts
expect(34).toBeGreaterThan(11);
expect(5).toBeLessThanOrEqual(5);
```

### `toBeCloseTo`
- **What:** Floating-point comparison within precision.
- **How:** `expect(num).toBeCloseTo(expected, numDigits)`
```ts
expect(0.1 + 0.2).toBeCloseTo(0.3, 5);
```

### `toContain`
- **What:** String contains substring, or array contains item.
```ts
expect('playwright').toContain('play');
expect([1, 2, 3]).toContain(2);
```

### `toContainEqual`
- **What:** Array contains an item that deep-equals expected.
```ts
expect([{ id: 1 }, { id: 2 }]).toContainEqual({ id: 1 });
```

### `toHaveLength`
- **What:** Array/string length match.
```ts
expect([1, 2, 3]).toHaveLength(3);
```

### `toMatch`
- **What:** String matches regex or substring.
```ts
expect('user@test.com').toMatch(/@/);
```

### `toMatchObject`
- **What:** Object contains subset of expected properties.
```ts
expect({ id: 1, name: 'Pramod', role: 'admin' }).toMatchObject({ role: 'admin' });
```

### `toThrow` / `toThrowError`
- **What:** Function throws an error.
```ts
expect(() => { throw new Error('boom'); }).toThrow('boom');
```

---

## 2. Locator Assertions (auto-retrying, `await` required)

### `toBeVisible` / `toBeHidden`
- **What:** Element visible / hidden in DOM.
```ts
await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
```

### `toBeEnabled` / `toBeDisabled`
- **What:** Element is enabled / disabled.
```ts
await expect(page.getByLabel('First name')).toBeEnabled();
```

### `toBeEditable`
- **What:** Input is editable (not readonly/disabled).
```ts
await expect(page.getByRole('textbox', { name: 'Email' })).toBeEditable();
```

### `toBeEmpty`
- **What:** Element has no text or no value.
```ts
await expect(page.locator('#cart')).toBeEmpty();
```

### `toBeChecked`
- **What:** Checkbox/radio is checked. Use `{ checked: false }` for unchecked.
```ts
await expect(page.getByLabel('Remember me')).toBeChecked();
```

### `toBeFocused`
- **What:** Element has keyboard focus.
```ts
await expect(page.getByLabel('Search')).toBeFocused();
```

### `toBeAttached`
- **What:** Element exists in DOM (may not be visible).
```ts
await expect(page.locator('#toast')).toBeAttached();
```

### `toBeInViewport`
- **What:** Element is within viewport bounds.
```ts
await expect(page.getByText('Footer link')).toBeInViewport();
```

### `toHaveText`
- **What:** Exact text match (string or regex). Array for multiple elements.
```ts
await expect(page.locator('h1')).toHaveText('Welcome');
```

### `toContainText`
- **What:** Element text contains substring.
```ts
await expect(page.locator('.alert')).toContainText('success');
```

### `toHaveValue`
- **What:** Input has given value.
```ts
await expect(page.getByLabel('Email')).toHaveValue('test@test.com');
```

### `toHaveValues`
- **What:** Multi-select has given selected values.
```ts
await expect(page.locator('#langs')).toHaveValues(['en', 'fr']);
```

### `toHaveAttribute`
- **What:** Element has attribute with value.
```ts
await expect(page.getByLabel('Email')).toHaveAttribute('type', 'email');
```

### `toHaveClass`
- **What:** Element has class (string, regex, or array).
```ts
await expect(page.locator('button')).toHaveClass(/btn-primary/);
```

### `toHaveCount`
- **What:** Locator matches N elements.
```ts
await expect(page.locator('footer a')).toHaveCount(16);
```

### `toHaveCSS`
- **What:** Element has computed CSS property.
```ts
await expect(page.locator('button')).toHaveCSS('background-color', 'rgb(255, 0, 0)');
```

### `toHaveId`
- **What:** Element has given `id`.
```ts
await expect(page.getByLabel('First name')).toHaveId('first-name');
```

### `toHaveJSProperty`
- **What:** Element has JS DOM property with value.
```ts
await expect(page.locator('#video')).toHaveJSProperty('paused', true);
```

### `toHaveScreenshot`
- **What:** Visual regression — element/page matches stored snapshot.
```ts
await expect(page.locator('.hero')).toHaveScreenshot('hero.png');
```

### `toHaveAccessibleName` / `toHaveAccessibleDescription` / `toHaveRole`
- **What:** A11y tree assertions.
```ts
await expect(page.getByRole('button')).toHaveAccessibleName('Submit');
await expect(page.locator('button')).toHaveRole('button');
```

---

## 3. Page Assertions

### `toHaveTitle`
- **What:** Page `<title>` matches.
```ts
await expect(page).toHaveTitle(/Playwright/);
```

### `toHaveURL`
- **What:** Page URL matches.
```ts
await expect(page).toHaveURL('https://playwright.dev/');
```

### `toHaveScreenshot` (page-level)
- **What:** Full-page visual snapshot.
```ts
await expect(page).toHaveScreenshot('home.png', { fullPage: true });
```

---

## 4. API Response Assertions

### `toBeOK`
- **What:** Response status is 2xx.
```ts
const res = await request.get('/api/users');
await expect(res).toBeOK();
```

---

## 5. Modifiers

### `.not`
- **What:** Negate any assertion.
```ts
await expect(page.locator('#error')).not.toBeVisible();
expect('hello').not.toContain('bye');
```

### `expect.soft`
- **What:** Records failure but continues test. Useful for multiple checks.
```ts
await expect.soft(input).toBeVisible();
await expect.soft(input).toHaveValue('');
```

### `expect.poll`
- **What:** Re-runs a function until assertion passes or timeout.
```ts
await expect.poll(async () => (await api.get('/jobs')).status, { timeout: 10_000 }).toBe(200);
```

### `expect.toPass`
- **What:** Retries an entire block until it passes.
```ts
await expect(async () => {
  const res = await page.request.get('/health');
  expect(res.status()).toBe(200);
}).toPass({ timeout: 10_000 });
```

### `expect.configure`
- **What:** Custom expect with preset timeout/soft.
```ts
const slowExpect = expect.configure({ timeout: 30_000 });
await slowExpect(page.locator('#late')).toBeVisible();
```

---

## 6. Common Interview Q&A

| Q | A |
|---|---|
| Difference between `toBe` and `toEqual`? | `toBe` = strict `===` (primitives/ref). `toEqual` = deep equality (objects/arrays). |
| Why `await` Locator assertions? | They auto-retry until pass or timeout. Without `await`, no wait happens. |
| Soft vs hard assertion? | Soft records failure but continues. Hard stops test on first failure. |
| `expect.poll` vs `expect.toPass`? | `poll` re-runs one function; `toPass` retries a whole block of assertions. |
| `toHaveText` vs `toContainText`? | `toHaveText` = exact match. `toContainText` = substring match. |
| Default assertion timeout? | 5 seconds. Configurable via `expect.configure` or `playwright.config.ts`. |

---

**Tip:** All Locator/Page assertions auto-retry. Never wrap them in `try/catch` for retry logic — use `expect.toPass`.