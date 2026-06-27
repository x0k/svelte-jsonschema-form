import { fieldTests } from "theme-testing/tests";
import { describe } from "vitest";

import * as defaultUi from "../src/lib/default-ui/index.js";
import * as newYorkUi from "../src/lib/new-york-ui/index.js";
import { specs } from "../src/lib/specs.js";
import { theme } from "../src/lib/theme/index.js";
import { THEME_CONTEXT } from "../src/lib/theme/internal.js";
import Form from "./form.svelte";

describe("default-ui", () => {
  fieldTests(theme, {
    specs,
    Form,
    context: new Map([[THEME_CONTEXT, { components: defaultUi }]]),
  });
});

describe("new-york-ui", () => {
  fieldTests(theme, {
    specs,
    Form,
    context: new Map([[THEME_CONTEXT, { components: newYorkUi }]]),
  });
});
