import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * Submits one schema through both paths and compares what the server holds.
 *
 * - `/tests/parity/parts` — JS on. `connect()` copies the visible form's parts
 *   into a hidden form submitted through Kit's remote machinery.
 * - `/tests/parity/native` — JS off. The browser posts real parts with a full
 *   reload. Every value goes through `convertFormDataEntry`: `""` to
 *   `undefined`, `"on"` to `true`, `parseInt`, enum lookups, `File` to a data
 *   URL.
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
        "tag-one": "seed",
      });
    });

    // A blank option posts `""`. That used to fail the decode and answer 500.
    test("submits when an optional select is left on its blank option", async () => {
      await form.getByLabel("First name").fill(`${key}Select`);
      expect(await submit("Select")).toMatchObject({
        firstName: `${key}Select`,
      });
    });

    // Cleared strings arrive as `""` and are dropped; an unchecked checkbox
    // sends nothing and the server answers `false`; an object whose inputs all
    // render arrives as `{}`. All three are server-side reconstruction
    // conventions both paths share, since both submit the same parts. The
    // additional properties keep their seeded values, since clearing one is a
    // later row and it fails on both paths.
    test("submits when the optional values are cleared", async () => {
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
        "tag-one": "seed",
        newsletter: true,
        color: "red",
        profile: {},
        agree: false,
      });
    });

    // An untouched optional checkbox sends nothing on either path, and the
    // server answers `false` — HTML's convention, kept by both sides.
    test("reports an untouched optional checkbox", async () => {
      await form.getByLabel("First name").fill(`${key}Untouched`);
      await form.getByLabel("Newsletter").selectOption({ label: "Yes" });
      await form.getByLabel("Color").selectOption({ label: "red" });

      expect(await submit("Untouched")).toEqual({
        firstName: `${key}Untouched`,
        lastName: "Doe",
        "newKey::123": "seed",
        "also.333": "seed",
        "tag-one": "seed",
        newsletter: true,
        color: "red",
        agree: false,
        profile: {},
      });
    });

    // KNOWN DEFECT, not a divergence — `additionalProperties` validates own keys
    // rather than guarding on `!== undefined` like `properties`, so the `undefined`
    // both paths now hold fails AJV with "must be string". Own row because it
    // blocks submission on both sides, hiding the row above.
    // Both rows assert the shared defect: the key is kept holding `undefined`,
    // so neither path submits. Written as `toBeNull` rather than the payload it
    // should carry, because that is what makes them guards — drop the key again
    // and the submission succeeds, so the payload no longer matches.
    test("does not submit when an additional property is cleared", async () => {
      await form.getByLabel("First name").fill(`${key}Additional`);
      await form.getByLabel("newKey::123", { exact: true }).fill("");
      await form.getByLabel("also.333", { exact: true }).fill("");

      expect(await submit("Additional")).toBeNull();
    });

    // Reaches the parser through `patternProperties` rather than
    // `additionalProperties` — a separate branch of `parseObject`.
    test("does not submit when a pattern property is cleared", async () => {
      await form.getByLabel("First name").fill(`${key}Pattern`);
      await form.getByLabel("tag-one", { exact: true }).fill("");

      expect(await submit("Pattern")).toBeNull();
    });
  });
}

defineParityTests({
  name: "parity (enhanced submission)",
  route: "/tests/parity/parts",
  key: "ParityParts",
});

defineParityTests({
  name: "parity (FormData path)",
  route: "/tests/parity/native",
  native: true,
  key: "ParityNative",
});
