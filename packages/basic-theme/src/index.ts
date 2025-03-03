import { createTheme } from "@sjsf/form";

import { definitions } from "./definitions.js";

export * as components from "./components/exports.js";
export * as widgets from "./widgets/exports.js";

export const theme = createTheme(definitions);
