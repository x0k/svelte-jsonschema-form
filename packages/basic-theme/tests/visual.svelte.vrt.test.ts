import { expect, test } from "vitest";
import { render } from "vitest-browser-svelte";
import { page } from "vitest/browser";

import App from "../src/app.svelte";

test("components and widgets", async () => {
  await page.viewport(1400, 900);
  await render(App, { props: { showCode: false } });
  await document.fonts.ready;
  await page.viewport(1400, document.body.scrollHeight);
  await expect(page).toMatchScreenshot();
});
