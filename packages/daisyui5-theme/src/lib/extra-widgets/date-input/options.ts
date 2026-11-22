import type { Options } from "vanilla-calendar-pro";
import "@sjsf/form/fields/extra-widgets/date-input";
import "@sjsf/basic-theme/extra-widgets/date-input.svelte";

declare module "@sjsf/form" {
  interface UiOptions {
    daisyui5DateInputOptions?: Options;
  }
}
