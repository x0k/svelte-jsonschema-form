import { widgetTests } from "theme-testing/snapshots/widget-tests";

import { theme } from "../src/index.js";
import { specs } from "../src/specs.js";
import Form from "./form.svelte";

widgetTests(theme, specs, { Form });
