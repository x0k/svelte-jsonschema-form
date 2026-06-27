import { fieldTests } from "theme-testing/tests";

import { theme } from "../src/index.js";
import { specs } from "../src/specs.js";
import Form from "./form.svelte";

fieldTests(theme, {
  specs,
  Form,
});
