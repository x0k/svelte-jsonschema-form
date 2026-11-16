import { fieldTests, requiredCheckboxTests } from "theme-testing/tests";

import * as components from "../src/lib/components/ui/index.js";
import { theme } from "../src/lib/theme/index.js";
import { THEME_CONTEXT } from "../src/lib/theme/internal.js";
import Form from "./form.svelte";

const context = new Map([[THEME_CONTEXT, { components }]]);

fieldTests(theme, {
  context,
  Form,
});

requiredCheckboxTests(theme, { context, Form });
