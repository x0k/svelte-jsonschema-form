import { arrayFieldTests } from "theme-testing/snapshots/array-field-tests";

import { theme } from "../src/index.js";
import Form from "./form.svelte";

arrayFieldTests(theme, { Form });
