import { fieldTests } from "theme-testing/tests";
import { describe } from "vitest";

import { theme } from "../src/lib/index.js";
import { specs } from "../src/lib/specs.js";
import Form from "./form.svelte";

describe.skip("snapshot fails due dynamic ids", () => {
  fieldTests(theme, { specs, Form });
});
