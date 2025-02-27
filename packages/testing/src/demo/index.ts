import "@sjsf/legacy-fields/exports";
import "@sjsf/legacy-fields/extra-widgets/multi-select";
import "@sjsf/legacy-fields/extra-widgets/textarea";
import "@sjsf/legacy-fields/extra-widgets/date-picker";
import "@sjsf/legacy-fields/extra-widgets/radio-buttons";
import "@sjsf/legacy-fields/extra-widgets/range";
import "@sjsf/legacy-fields/extra-widgets/switch";

export * from "./ajv-validator";
export * as widgets from "./widgets";
export * as components from "./components";
export { translation } from "./translation";
export { default as Form } from "./form.svelte";
export { default as ComponentsAndWidgets } from "./components-and-widgets.svelte";
export { default as AllIcons } from "./all-icons.svelte";
