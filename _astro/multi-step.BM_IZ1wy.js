const e=`<script lang="ts">
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
<\/script>

<Form attributes={{ novalidate: true }}>
  <Content />
</Form>
`,n=`<script lang="ts" module>
  import { createContext } from "svelte";

  export const [getStepperContext, setStepperContext] =
    createContext<Ref<number>>();
<\/script>

<script lang="ts">
  import { isSchemaObject } from "@sjsf/form/lib/json-schema";
  import type { Ref } from "@sjsf/form/lib/svelte.svelte";
  import {
    getChildPath,
    getFieldComponent,
    getFormContext,
    retrieveTranslate,
    retrieveUiOption,
    retrieveUiSchema,
    uiTitleOption,
    type FieldValue,
    type ComponentProps,
    validate,
    updateErrors,
  } from "@sjsf/form";

  let { config, value = $bindable() }: ComponentProps["tupleField"] = $props();

  const ctx = getFormContext();
  const stepperCtx = getStepperContext();

  const stepSchemas = $derived.by(() => {
    const items = config.schema.items;
    return Array.isArray(items) && items.every(isSchemaObject) ? items : [];
  });
  const stepUiSchemas = $derived.by(() => {
    const items = config.uiSchema.items ?? {};
    return (Array.isArray(items) ? items : stepSchemas.map(() => items)).map(
      (s) => {
        const retrieved = retrieveUiSchema(ctx, s);
        return {
          ...retrieved,
          "ui:options": {
            ...retrieved["ui:options"],
            hideTitle: true,
          },
        };
      }
    );
  });
  const stepTitles = $derived(
    stepUiSchemas.map(
      (s, i) => uiTitleOption(ctx, s) ?? stepSchemas[i].title ?? \`Step \${i + 1}\`
    )
  );

  const stepConfig = $derived({
    path: getChildPath(ctx, config.path, stepperCtx.current),
    required: true,
    schema: stepSchemas[stepperCtx.current],
    uiSchema: stepUiSchemas[stepperCtx.current],
    title: stepTitles[stepperCtx.current],
  });
  const StepComponent = $derived(getFieldComponent(ctx, stepConfig));
<\/script>

<div class="stepper-header">
  {#each stepTitles as title, i}
    <button
      type="button"
      data-active={i === stepperCtx.current}
      onclick={() => {
        if (i < stepperCtx.current) {
          stepperCtx.current = i;
        }
      }}>{title}</button
    >
  {/each}
</div>

<StepComponent
  config={stepConfig}
  translate={retrieveTranslate(ctx, stepConfig)}
  type="field"
  uiOption={(opt) => retrieveUiOption(ctx, stepConfig, opt)}
  bind:value={
    () => value?.[stepperCtx.current] as undefined,
    (v) => {
      if (value) {
        value[stepperCtx.current] = v;
      } else {
        const arr = new Array<FieldValue>(stepSchemas.length);
        arr[stepperCtx.current] = v;
        value = arr;
      }
    }
  }
/>

<div class="stepper-buttons">
  <button
    type="button"
    data-active={stepperCtx.current > 0}
    onclick={() => {
      stepperCtx.current--;
    }}
  >
    Back
  </button>
  <button
    type="button"
    data-active={stepperCtx.current < stepSchemas.length - 1}
    onclick={() => {
      const { errors } = validate(ctx);
      const s = stepperCtx.current;
      const currentErrors = errors?.filter((e) => e.path[0] === s);
      if (currentErrors?.length) {
        updateErrors(ctx, currentErrors);
      } else {
        stepperCtx.current++;
      }
    }}
  >
    Continue
  </button>
  <button
    type="submit"
    data-active={stepperCtx.current === stepSchemas.length - 1}
  >
    Submit
  </button>
</div>

<style>
  .stepper-header {
    display: flex;
    gap: 1rem;
    > button {
      all: unset;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-grow: 1;
      border: 1px solid black;
      border-radius: 10px;
      padding: 0.5rem;
      cursor: pointer;
    }
    > [data-active="true"] {
      font-weight: bold;
    }
  }
  .stepper-buttons {
    display: flex;
    gap: 1rem;
    > button {
      flex-grow: 1;
      padding: 0.5rem;
    }
    > [data-active="false"] {
      display: none;
    }
  }
</style>
`,t={files:{"src/routes/+page.svelte":e,"src/routes/multi-step-field.svelte":n}};export{t as layer};
