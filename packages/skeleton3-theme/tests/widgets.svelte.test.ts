import { widgetTests } from "testing/snapshots/widget-tests";

import { theme } from "../src/lib/index.js";
import { specs } from "../src/lib/specs.js";

widgetTests(theme, specs);
