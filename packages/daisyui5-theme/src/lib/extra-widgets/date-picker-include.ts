import { clientOnly } from "@sjsf/form/lib/env";

import { definitions } from "../definitions.js";

export type * as __preserveDatePickerTypes from "./date-picker.svelte";

declare module "../definitions.js" {
  interface ExtraWidgets {
    datePickerWidget: {};
  }
}

definitions.datePickerWidget = clientOnly(() => import("./date-picker.svelte"));
