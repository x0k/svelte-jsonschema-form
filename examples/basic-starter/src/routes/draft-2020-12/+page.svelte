<script lang="ts">
  import type { JSONSchema } from "json-schema-typed/draft-2020-12";
  import { createForm, BasicForm } from "@sjsf/form";

  import * as defaults from "$lib/form-defaults";

  // This adapter is intended to produce a Draft-07 schema that is
  // structurally equivalent to a Draft 2020-12 schema.
  // It has some limitations — see the usage of the `noop` function.
  import { adapt } from "./adapter";

  const schema = {
    type: "array",
    prefixItems: [
      { title: "foo", type: "string", default: "carp" },
      { title: "bar", type: "string", minLength: 3 },
    ],
    items: { title: "Additional", type: "number" },
  } as const satisfies JSONSchema;

  const form = createForm({
    ...defaults,
    // WARN: Some validation functionality is lost during schema conversion.
    // Keep this in mind on the client side and use the original schema for server-side validation.
    schema: adapt(schema),
    // Example using `Ajv2020`:
    // validator: <T,>(options: ValidatorFactoryOptions) => {
    //   const validator = defaults.validator<T>({
    //     ...options,
    //     ajv: addFormComponents(new Ajv2020(DEFAULT_AJV_CONFIG)),
    //   });
    //   // TODO: Pass the original schema parts to the `isValid` method.
    //   return {
    //     ...validator,
    //     validateFormValue(_, formValue) {
    //       return validator.validateFormValue(schema, formValue);
    //     },
    //   };
    // },
    onSubmit: console.log,
  });
</script>

<BasicForm {form} />
