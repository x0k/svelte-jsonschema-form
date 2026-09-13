import { test } from "@playwright/test";

import { defineFormTests } from "../form-e2e-helpers.js";

// STUB: `connect()` is stubbed until the sveltekit3 package is available; re-enable with kit-3-migration
test.skip(true, "@sjsf/sveltekit is stubbed until sveltekit3");

defineFormTests({
  name: "connect() with enhance",
  route: "/tests/enhanced",
});
