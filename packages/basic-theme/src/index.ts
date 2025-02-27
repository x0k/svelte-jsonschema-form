import { fromRecord } from "@sjsf/form/lib/resolver";
import { createTheme } from "@sjsf/form";

import { definitions } from "./definitions.js";

export const themeResolver = fromRecord(definitions);

export const theme = createTheme(themeResolver);
