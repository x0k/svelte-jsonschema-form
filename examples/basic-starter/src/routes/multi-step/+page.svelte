<script lang="ts">
  import type { Ref } from "@sjsf/form/lib/svelte.svelte";
  import {
    Content,
    Form,
    createForm,
    setFormContext,
    type Schema,
    type UiSchemaRoot,
  } from "@sjsf/form";
  import { createFocusOnFirstError } from "@sjsf/form/focus-on-first-error";

  import * as defaults from "$lib/form-defaults";

  import MultiStepField, { setStepperContext } from "./multi-step-field.svelte";

  let step = $state.raw(0);
  const stepperCtx: Ref<number> = {
    get current() {
      return step;
    },
    set current(v) {
      step = v;
    },
  };
  setStepperContext(stepperCtx);

  const schema: Schema = {
    type: "array",
    items: [
      {
        title: "Page 1",
        type: "object",
        properties: {
          label: {
            type: "string",
            title: "Label",
          },
        },
        required: ["label"],
      },
      {
        title: "Page 2",
        type: "object",
        properties: {
          otherField: {
            type: "string",
            title: "Other Label",
            minLength: 3,
          },
        },
        required: ["otherField"],
      },
      {
        title: "Page 3",
        type: "object",
        properties: {
          number: {
            type: "number",
            title: "Some number",
            minimum: 5,
            maximum: 150,
          },
        },
        required: ["number"],
      },
    ],
  };

  const uiSchema = {
    "ui:components": {
      tupleField: MultiStepField,
    },
  } satisfies UiSchemaRoot;

  const form = createForm({
    ...defaults,
    schema,
    uiSchema,
    onSubmit: (data) => {
      console.log(data);
      form.reset();
      stepperCtx.current = 0;
    },
    onSubmitError(result, e, form) {
      if (result.errors.length === 0) {
        return;
      }
      step = result.errors[0].path[0] as number;
      createFocusOnFirstError()(result, e, form);
    },
  });
  setFormContext(form);
</script>

<Form attributes={{ novalidate: true }}>
  <Content />
</Form>
