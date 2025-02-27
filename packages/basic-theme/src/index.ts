import { fromRecord } from "@sjsf/form/lib/resolver";
import { createTheme } from "@sjsf/form";

import { definitions } from "./definitions.js";

export * as components from "./components/exports.js";
export * as widgets from "./widgets/exports.js";

export const themeResolver = fromRecord(definitions);

export const theme = createTheme(themeResolver);
