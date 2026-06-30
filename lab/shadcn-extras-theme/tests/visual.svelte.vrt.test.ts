import { expect, test } from "vitest";
import { render } from "vitest-browser-svelte";
import { page } from "vitest/browser";

import Page from "../src/routes/+page.svelte";

test("components and widgets", async () => {
  await page.viewport(1400, 900);
  const { container } = await render(Page, { props: { showCode: false } });
  await document.fonts.ready;
  await page.viewport(1400, document.body.scrollHeight);
  const mask = Array.from(
    container.querySelectorAll('[data-slot="command"]')
  ).map((el) => page.elementLocator(el));
  await expect(page).toMatchScreenshot({
    screenshotOptions: { mask },
  });
});
