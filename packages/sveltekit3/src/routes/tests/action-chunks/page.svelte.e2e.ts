import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * The form-action `useJsonChunks` opt-in, end to end: the request sends the
 * state as `JSON.stringify` chunks, and the handler reads them with
 * `JSON.parse` and a reviver. Unit tests cover each side with a mocked fetch
 * and hand-built `FormData`; only this proves the two agree — the client and
 * server have separate `createDefaultReplacer` implementations, the exact
 * asymmetry that once broke the remote path.
 *
 * Each test submits a distinct `firstName`, since the store is shared and the
 * suite runs concurrent workers.
 */
test.describe("form actions with useJsonChunks", () => {
  const route = "/tests/action-chunks";
  let page: Page;
  let form: Locator;

  const submit = async (row: string) => {
    await form.locator('button[type="submit"]').click();
    return await (
      await page.request.get(`/tests?firstName=ActionChunks${row}`)
    ).json();
  };

  test.beforeEach(async ({ page: p }) => {
    page = p;
    await page.goto(route);
    // Clicking before hydration leaves the form with its native submit, so the
    // page reloads instead of enhancing and the assertions race it.
    await page.waitForLoadState("networkidle");
    form = page.locator("form").first();
  });

  test("round-trips the state through JSON chunks", async () => {
    await form.getByLabel("First name").fill("ActionChunksValue");

    const submission = await submit("Value");
    expect(submission).toMatchObject({ firstName: "ActionChunksValue" });
  });

  test("uploads a real File through the chunk reviver", async () => {
    await form.getByLabel("First name").fill("ActionChunksFile");
    // Untyped: the state holds a raw `File`, so the replacer must emit a
    // marker plus a file part, and the reviver must resolve them.
    await form.getByLabel("Attachment", { exact: true }).setInputFiles({
      name: "attachment.bin",
      mimeType: "application/octet-stream",
      buffer: Buffer.from([5, 6, 7, 8]),
    });

    const submission = await submit("File");
    // A resolved file arrives as an exactly-empty object — the JSON transport
    // cannot carry the bytes' type. `toMatchObject` would also accept `null`
    // here, which is what a dropped marker resolves to, so this is strict.
    expect(submission).toEqual({
      firstName: "ActionChunksFile",
      attachment: {},
    });
  });
});
