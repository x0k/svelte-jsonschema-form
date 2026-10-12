import { fieldSsrTests } from "theme-testing/tests/ssr";
import { expect } from "vitest";

import { theme } from "../src/lib/index.js";

fieldSsrTests(theme, {
  // fluentui's `Dropdown` builds its trigger label from a context that
  // `DropdownOption` populates in `onMount`, so SSR renders the raw option
  // value instead of the option title. Assert that the trigger rendered and is
  // wired up, rather than asserting on option text. Accepted for this lab
  // package; revisit once the upstream label resolution is fixed.
  assertOptionTextInBody: (body) => {
    expect(body).toContain('aria-haspopup="listbox"');
  },
});
