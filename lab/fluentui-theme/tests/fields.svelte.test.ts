import { fieldTests } from "theme-testing/tests";
import { describe } from "vitest";

import { theme } from "../src/lib/index.js";
import { specs } from "../src/lib/specs.js";
import Form from "./form.svelte";

describe("fluent-ui fields", () => {
  fieldTests(theme, { specs, Form });
});
