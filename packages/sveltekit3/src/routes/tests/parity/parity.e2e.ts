import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * Submits one schema through both submission paths and compares what the server
 * ends up holding.
 *
 * - `/tests/parity/json` — JavaScript on. `connect()` serializes the state with
 *   `JSON.stringify` into hidden inputs; the server reads them back with
 *   `JSON.parse` and a reviver (`rf/server/server.ts`).
 * - `/tests/parity/native` — JavaScript off. The browser posts real parts and
 *   the server runs every value through `convertFormDataEntry`, which coerces:
 *   `""` to `undefined`, `"on"` to `true`, `parseInt`, `parseFloat`, enum
 *   lookups, `File` to a data URL.
 *
 * `JSON.parse` needs none of those coercions, so each one is a place the two
 * paths can disagree for the same form. These tests assert what both paths
 * *should* produce, so a divergence fails on one side and names the field.
 *
 * Rows known to diverge are marked with `test.fail` inside the test body, which
 * scopes the marker to that row alone — at describe scope it leaks onto every
 * test in the group. Fix the divergence and the row fails as "expected to fail
 * but passed", at which point the marker comes off.
 *
 * Every row submits a distinct `firstName`, because the submission store is
 * shared across the routes and the suite runs several workers at once: the
 * reader picks a submission by its `firstName`, so a repeated key hands one test
 * another test's payload.
 */
export function defineParityTests({
  name,
  route,
  native = false,
  key,
}: {
  name: string;
  route: string;
  native?: boolean;
  key: string;
}) {
  let page: Page;
  let form: Locator;

  const submit = async (row: string) => {
    await form.locator('button[type="submit"]').click();
    if (native) {
      await page.waitForURL(`**${route}**`);
    }
    return await (
      await page.request.get(`/tests?firstName=${key}${row}`)
    ).json();
  };

  test.describe(name, () => {
    test.beforeEach(async ({ page: p }) => {
      page = p;
      await page.goto(route);
      // Clicking before hydration leaves the form with its native submit, so the
      // page reloads instead of enhancing and the assertions race it.
      await page.waitForLoadState("networkidle");
      form = page.locator("form").first();
    });

    test("submits every field", async () => {
      await form.getByLabel("First name").fill(`${key}Fields`);
      await form.getByLabel("Last name").fill("Doe");
      await form.getByLabel("Age").fill("30");
      await form.getByLabel("Score").fill("1.5");
      await form.getByLabel("Agree").check();
      await form.getByLabel("Newsletter").selectOption({ label: "Yes" });
      await form.getByLabel("Color").selectOption({ label: "green" });
      await form.getByLabel("Nickname").fill("nick");
      await form.getByLabel("City").fill("Berlin");
      await form.getByLabel("Zip").fill("10115");
      await form.getByLabel("Avatar").setInputFiles({
        name: "avatar.png",
        mimeType: "image/png",
        buffer: Buffer.from([1, 2, 3, 4]),
      });
      await form.locator('[data-type="array-item-add"]').click();
      await form
        .locator('[data-layout="array-items"] input[type="text"]')
        .first()
        .fill("alpha");
      await form.locator('[data-type="array-item-add"]').click();
      await form
        .locator('[data-layout="array-items"] input[type="text"]')
        .nth(1)
        .fill("beta");
      await form.getByLabel("newKey::123", { exact: true }).fill("colon-key");
      await form.getByLabel("also.333", { exact: true }).fill("dot-key");

      expect(await submit("Fields")).toEqual({
        firstName: `${key}Fields`,
        lastName: "Doe",
        age: 30,
        score: 1.5,
        agree: true,
        newsletter: true,
        color: "green",
        tags: ["alpha", "beta"],
        nickname: "nick",
        profile: { city: "Berlin", zip: "10115" },
        avatar: "data:image/png;name=avatar.png;base64,AQIDBA==",
        "newKey::123": "colon-key",
        "also.333": "dot-key",
      });
    });

    // KNOWN DIVERGENCE — an untouched optional `<select>`.
    //
    // It posts `value=""`. `createEnumItemDecoder` finds no match and throws,
    // which `validate()` turns into a pathless `unexpected-error` rather than a
    // field issue, and Kit cannot render that for a native POST: the response is
    // a 500 and the user gets an error page instead of the form back. The JSON
    // path never sends the key, so it is unaffected — which means a form with
    // any optional select is unsubmittable without JavaScript.
    test("submits when an optional select is left on its blank option", async () => {
      test.fail(
        native,
        "an untouched optional select 500s the whole no-JS submission"
      );
      await form.getByLabel("First name").fill(`${key}Select`);
      expect(await submit("Select")).toMatchObject({
        firstName: `${key}Select`,
      });
    });

    // KNOWN DIVERGENCE — clearing an optional value.
    //
    // Clearing an additional property leaves `null` in the state, which the JSON
    // path carries into the validator and rejects, so the whole submission is
    // refused; the FormData path drops the empty value first and accepts. The
    // same user action therefore either succeeds or fails depending on whether
    // JavaScript is on.
    test("submits when the optional values are cleared", async () => {
      test.fail(
        !native,
        'clearing an additional property becomes null and fails "must be string"'
      );
      await form.getByLabel("First name").fill(`${key}Cleared`);
      await form.getByLabel("Last name").fill("");
      await form.getByLabel("Nickname").fill("");
      await form.getByLabel("City").fill("");
      await form.getByLabel("Zip").fill("");
      await form.getByLabel("newKey::123", { exact: true }).fill("");
      await form.getByLabel("also.333", { exact: true }).fill("");
      // `agree` stays unchecked, and the selects get real values so this row
      // measures the cleared strings rather than the select divergence above.
      await form.getByLabel("Newsletter").selectOption({ label: "Yes" });
      await form.getByLabel("Color").selectOption({ label: "red" });

      expect(await submit("Cleared")).toEqual({
        firstName: `${key}Cleared`,
        agree: false,
        newsletter: true,
        color: "red",
        tags: [],
        profile: {},
      });
    });
  });
}

defineParityTests({
  name: "parity (JSON path)",
  route: "/tests/parity/json",
  key: "ParityJson",
});

defineParityTests({
  name: "parity (FormData path)",
  route: "/tests/parity/native",
  native: true,
  key: "ParityNative",
});
