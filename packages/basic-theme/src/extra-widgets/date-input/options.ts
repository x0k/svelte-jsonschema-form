import type { HTMLInputAttributes } from "svelte/elements";
import "@sjsf/form/fields/extra-widgets/date-input";

declare module "@sjsf/form" {
  interface UiOptions {
    dateInput?: HTMLInputAttributes;
  }
}
