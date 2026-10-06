export { resolver } from "@sjsf/form/resolvers/basic";

export { theme } from "@sjsf/basic-theme";
import "@sjsf/basic-theme/extra-widgets/textarea-include";

export { translation } from "@sjsf/form/translations/en";

// Remote forms need the `@sjsf/sveltekit3/rf` id builder, `connect()` appends
// the `/{formId}` suffix that Kit v3 requires on every field name
export { createFormIdBuilder as idBuilder } from "@sjsf/sveltekit3/rf";

export { createFormMerger as merger } from "@sjsf/form/mergers/modern";

export { createFormValidator as validator } from "@sjsf/ajv8-validator";
