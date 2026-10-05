import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * Submits one schema through both paths and compares what the server holds.
 *
 * - `/tests/parity/json` — JS on. `connect()` sends the state as `JSON.stringify`
 *   chunks; the server reads them with `JSON.parse` and a reviver.
 * - `/tests/parity/native` — JS off. The browser posts real parts, and every
 *   value goes through `convertFormDataEntry`: `""` to `undefined`, `"on"` to
 *   `true`, `parseInt`, enum lookups, `File` to a data URL. `JSON.parse` needs
 *   none of that, so each coercion is a place the paths can disagree.
 *
 * Rows marked `test.fail` are known to diverge. The marker goes inside the test
 * body: at describe scope it leaks onto every row. Fix the row and it fails as
 * "expected to fail but passed" — then drop the marker.
 *
 * Each row submits a distinct `firstName`, since the store is shared and the
 * suite runs concurrent workers.
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

    // A blank option posts `""`. That used to fail the decode and answer 500.
    test("submits when an optional select is left on its blank option", async () => {
      await form.getByLabel("First name").fill(`${key}Select`);
      expect(await submit("Select")).toMatchObject({
        firstName: `${key}Select`,
      });
    });

    // KNOWN DIVERGENCE — the state has none of `agree: false`, `tags: []` or
    // `profile: {}`, so `JSON.stringify` drops them, while the FormData path
    // rebuilds all three. Whether they belong in the state is undecided, so this
    // records it. The additional properties keep their seeded values, since
    // clearing one is the next row and it fails on both paths.
    test("submits when the optional values are cleared", async () => {
      test.fail(
        !native,
        "the JSON path drops `agree: false`, `tags: []` and `profile: {}`, which FormData rebuilds"
      );
      await form.getByLabel("First name").fill(`${key}Cleared`);
      await form.getByLabel("Last name").fill("");
      await form.getByLabel("Nickname").fill("");
      await form.getByLabel("City").fill("");
      await form.getByLabel("Zip").fill("");
      // `agree` stays unchecked; the selects get values so this row measures the
      // cleared strings rather than the select row above.
      await form.getByLabel("Newsletter").selectOption({ label: "Yes" });
      await form.getByLabel("Color").selectOption({ label: "red" });

      expect(await submit("Cleared")).toEqual({
        firstName: `${key}Cleared`,
        "newKey::123": "seed",
        "also.333": "seed",
        agree: false,
        newsletter: true,
        color: "red",
        tags: [],
        profile: {},
      });
    });

    // KNOWN DEFECT, not a divergence — `additionalProperties` validates own keys
    // rather than guarding on `!== undefined` like `properties`, so the `undefined`
    // both paths now hold fails AJV with "must be string". Own row because it
    // blocks submission on both sides, hiding the row above.
    test("submits when an additional property is cleared", async () => {
      test.fail(
        true,
        "an `undefined` additional property fails AJV on both paths"
      );
      await form.getByLabel("First name").fill(`${key}Additional`);
      await form.getByLabel("newKey::123", { exact: true }).fill("");
      await form.getByLabel("also.333", { exact: true }).fill("");

      expect(await submit("Additional")).toEqual({
        firstName: `${key}Additional`,
        "also.333": "seed",
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
