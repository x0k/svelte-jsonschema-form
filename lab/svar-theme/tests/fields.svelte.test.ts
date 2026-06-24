import { fieldTests } from "theme-testing/tests";

import { theme } from "../src/lib/index.js";
import { specs } from "../src/lib/specs.js";
import Form from "./form.svelte";

fieldTests(theme, { specs, Form });
