import { fieldSsrTests } from "theme-testing/tests/ssr";
import { describe } from "vitest";

import * as defaultUi from "../src/lib/default-ui/index.js";
import * as newYorkUi from "../src/lib/new-york-ui/index.js";
import { theme } from "../src/lib/theme/index.js";
import { THEME_CONTEXT } from "../src/lib/theme/internal.js";

describe("default-ui", () => {
  fieldSsrTests(theme, {
    context: new Map([[THEME_CONTEXT, { components: defaultUi }]]),
  });
});

describe("new-york-ui", () => {
  fieldSsrTests(theme, {
    context: new Map([[THEME_CONTEXT, { components: newYorkUi }]]),
  });
});
