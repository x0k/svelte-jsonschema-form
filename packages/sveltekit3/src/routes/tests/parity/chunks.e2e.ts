import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * The `useJsonChunks` opt-in, end to end: `connect()` sends the state as
 * `JSON.stringify` chunks, and the server reads them with `JSON.parse` and a
 * reviver. Unit tests cover each side; only this proves the wire between them
 * — chunk key naming through Kit's `/{formId}` parsing and file-marker
 * resolution — actually interlocks.
 *
 * Each test submits a distinct `firstName`, since the store is shared and the
 * suite runs concurrent workers.
 */
test.describe("parity (JSON chunks)", () => {
  const route = "/tests/parity/chunks";
  let page: Page;
  let form: Locator;

  const submit = async (row: string) => {
    await form.locator('button[type="submit"]').click();
    return await (
      await page.request.get(`/tests?firstName=Chunks${row}`)
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
    await form.getByLabel("First name").fill("ChunksValue");
    await form.getByLabel("Last name").fill("Doe");
    await form.getByLabel("Age").fill("30");
    await form.getByLabel("newKey::123", { exact: true }).fill("colon-key");
    await form.getByLabel("also.333", { exact: true }).fill("dot-key");

    const submission = await submit("Value");
    expect(submission).toMatchObject({
      firstName: "ChunksValue",
      lastName: "Doe",
      age: 30,
      "newKey::123": "colon-key",
      "also.333": "dot-key",
    });
    // The JSON path keeps what the state holds: an untouched checkbox is
    // absent, not `false` as HTML conventions would answer.
    expect(submission).not.toHaveProperty("agree");
  });

  test("uploads a real File through the chunk reviver", async () => {
    await form.getByLabel("First name").fill("ChunksFile");
    // `avatar` is `format: data-url`: the state already holds a string, so it
    // rides the chunks as-is with no upload behind it.
    await form.getByLabel("Avatar").setInputFiles({
      name: "avatar.png",
      mimeType: "image/png",
      buffer: Buffer.from([1, 2, 3, 4]),
    });
    // `attachment` is untyped and holds a raw `File`: the replacer must emit
    // a marker plus a file part, and the reviver must resolve them.
    await form.getByLabel("Attachment", { exact: true }).setInputFiles({
      name: "attachment.bin",
      mimeType: "application/octet-stream",
      buffer: Buffer.from([5, 6, 7, 8]),
    });

    const submission = await submit("File");
    expect(submission).toMatchObject({
      firstName: "ChunksFile",
      avatar: "data:image/png;name=avatar.png;base64,AQIDBA==",
    });
    // The record holds Kit's lazy file, whose enumerable data props survive
    // the JSON transport. Name, size and type prove the right file arrived;
    // a dropped marker resolves to `null`, which matches nothing here.
    expect(submission.attachment).toMatchObject({
      name: "attachment.bin",
      size: 4,
      type: "application/octet-stream",
    });
  });
});
