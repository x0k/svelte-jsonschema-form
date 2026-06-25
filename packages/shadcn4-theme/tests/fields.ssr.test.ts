import { fieldSsrTests } from "theme-testing/tests/ssr";

import * as components from "../src/lib/components/ui/index.js";
import { theme } from "../src/lib/theme/index.js";
import { THEME_CONTEXT } from "../src/lib/theme/internal.js";

fieldSsrTests(theme, {
  context: new Map([[THEME_CONTEXT, { components }]]),
});
