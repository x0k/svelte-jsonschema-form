<script lang="ts">
  import {
    Content,
    Root,
    createForm,
    reset,
    setFormContext,
    validate,
    type FailureValidationResult,
    type Schema,
    type UiSchemaRoot,
  } from "@sjsf/form";
  import { createFocusOnFirstError } from "@sjsf/form/focus-on-first-error";
  import type { Ref } from "@sjsf/form/lib/svelte.svelte";

  import * as defaults from "$lib/sjsf/defaults";

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
    onValid: (data) => {
      console.log(data);
      reset(form);
      stepperCtx.current = 0;
    },
  });
  setFormContext(form);

  const focusOnFirstError = createFocusOnFirstError({ form });

  function focusStep<R>(focus: (result: FailureValidationResult) => R) {
    return (result: FailureValidationResult) => {
      if (result.errors.length === 0) {
        return;
      }
      step = result.errors[0].path[0] as number;
      return focus(result);
    };
  }
</script>

<form
  onsubmit={(e) => {
    e.preventDefault();
    void validate(form, {
      onInvalid: focusStep(focusOnFirstError(e)),
    });
  }}
  novalidate
>
  <Root>
    <Content />
  </Root>
</form>
