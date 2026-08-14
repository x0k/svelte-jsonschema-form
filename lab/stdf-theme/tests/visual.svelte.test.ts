import { test } from "vitest";

test.skip("components and widgets", () => {
  // STDF components require Canvas and popup measurements in the browser,
  // causing Playwright screenshot timeouts in vitest browser test iframe.
  // Skip for now.
});
