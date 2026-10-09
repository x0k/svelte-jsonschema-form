<script lang="ts">
  import {
    BasicForm,
    validate,
    type ValidatorFactoryOptions,
  } from "@sjsf/form";

  import {
    createMeta,
    createAdditionalPropertyKeyValidator,
    setupSvelteKitForm,
  } from "#lib/client/index.js";
  import { createFormIdBuilder } from "#lib/id-builder.js";

  import type { PageData, ActionData } from "./$types.js";
  import * as defaults from "./form-defaults.js";
  import { ERROR_TYPE_OBJECTS } from "./model.js";

  const meta = createMeta<ActionData, PageData>().form2;
  const { form, request } = setupSvelteKitForm(meta, {
    ...defaults,
    idBuilder: createFormIdBuilder,
    idPrefix: "form2",
    schema: {
      title: "Parent",
      additionalProperties: {
        title: "Child",
        type: "object",
        additionalProperties: {
          title: "value",
          type: "string",
        },
      },
    },
    onInvalid: console.warn,
    validator: <T>(options: ValidatorFactoryOptions) =>
      Object.assign(
        defaults.validator<T>(options),
        createAdditionalPropertyKeyValidator({
          error({ type, values }) {
            return `The presence of these ${ERROR_TYPE_OBJECTS[type]} ("${values.join('", "')}") is prohibited`;
          },
        })
      ),
  });
</script>

<BasicForm
  {form}
  method="POST"
  action="?/second"
  onsubmit={(e) => {
    e.preventDefault();
    void validate(form, {
      onValid: (value) => {
        void request.run(value, e);
      },
    });
  }}
/>
