import { test } from "vitest";

test.skip("components and widgets", () => {
  // Willow component from @svar-ui/svelte-core causes Playwright screenshot
  // timeouts in vitest browser test iframe. Skip for now.
});
