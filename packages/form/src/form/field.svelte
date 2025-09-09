<script lang="ts" generics="T, V extends Validator, N extends JsonPaths<T>">
  import type { Snippet } from "svelte";
  import { DEV } from "esm-env";

  import type { JsonPaths } from "@/lib/types.js";
  import { isObject } from "@/lib/object.js";
  import { getSchemaDefinitionByPath, type Validator } from "@/core/index.js";

  import {
    getFieldComponent,
    retrieveSchema,
    retrieveTranslate,
    retrieveUiOption,
    setFormContext,
    uiTitleOption,
    type FormState,
  } from "./state/index.js";
  import type { FieldValue } from "./model.js";
  import {
    getUiSchemaByPath,
    type UiOption,
    type UiSchema,
  } from "./ui-schema.js";
  import { pathToId } from "./id.js";
  import type { Config } from "./config.js";
  import type { ComponentProps } from "./components.js";
  import type { FoundationalFieldType } from "./fields.js";
  import {
    FORM_SCHEMA,
    FORM_UI_SCHEMA,
    FORM_UI_SCHEMA_ROOT,
    FORM_VALUE,
  } from "./internals.js";

  interface Props {
    form: FormState<T, V>;
    name: N;
    required?: boolean;
    uiSchema?: UiSchema;
    render?: Snippet<
      [
        Omit<ComponentProps[FoundationalFieldType], "value"> & {
          valueRef: { value: FieldValue };
        },
      ]
    >;
  }

  const {
    form,
    name,
    required: requiredOverride,
    uiSchema: uiSchemaOverride,
    render,
  }: Props = $props();

  if (DEV) {
    $effect(() => {
      if (name === "" && render === undefined) {
        console.warn('Use `<Content />` instead of `<Field name="" />`');
      }
    });
  }

  const valuePath = $derived(name === "" ? [] : name.split("."));

  const id = $derived(pathToId(valuePath, form));

  const valueRef: { value: FieldValue } = $derived.by(() => {
    if (valuePath.length === 0) {
      return {
        get value() {
          return form[FORM_VALUE];
        },
        set value(v) {
          form[FORM_VALUE] = v;
        },
      };
    }
    let node = form[FORM_VALUE];
    let i = -1;
    const lastIndex = valuePath.length - 1;
    while (isObject(node) && ++i < lastIndex) {
      // @ts-expect-error
      node = node[valuePath[i]];
    }
    if (i !== lastIndex) {
      console.error("Current form state", $state.snapshot(form[FORM_VALUE]));
      throw new Error(
        `Path "${name}" is not populated or invalid, check current form state`
      );
    }
    const lastKey = valuePath[lastIndex]!;
    return {
      get value() {
        //@ts-expect-error
        return node[lastKey];
      },
      set value(v) {
        //@ts-expect-error
        node[lastKey] = v;
      },
    };
  });

  const parentSchema = $derived.by(() => {
    const len = valuePath.length;
    if (len < 2) {
      return form[FORM_SCHEMA];
    }
    const def = getSchemaDefinitionByPath(
      form[FORM_SCHEMA],
      form[FORM_SCHEMA],
      valuePath.slice(0, -1)
    );
    return def === undefined || typeof def === "boolean" ? {} : def;
  });

  const schema = $derived.by(() => {
    if (valuePath.length === 0) {
      return form[FORM_SCHEMA];
    }
    const def = getSchemaDefinitionByPath(
      form[FORM_SCHEMA],
      parentSchema,
      valuePath.slice(-1)
    );
    return def === undefined || typeof def === "boolean" ? {} : def;
  });

  const retrievedSchema = $derived(
    retrieveSchema(form, schema, valueRef.value)
  );

  const uiSchema = $derived(
    uiSchemaOverride ??
      getUiSchemaByPath(
        form[FORM_UI_SCHEMA_ROOT],
        form[FORM_UI_SCHEMA],
        valuePath
      ) ??
      {}
  );

  const required = $derived.by(() => {
    if (requiredOverride !== undefined) {
      return requiredOverride;
    }
    if (valuePath.length === 0) {
      return false;
    }
    const property = valuePath[valuePath.length - 1]!;
    const { required, items, minItems } = parentSchema;
    if (Array.isArray(required)) {
      return required.includes(property);
    }
    const num = Number(property);
    if (Number.isInteger(num) && num >= 0) {
      if (minItems !== undefined) {
        return num < minItems;
      }
      if (Array.isArray(items)) {
        return num < items.length;
      }
    }
    return false;
  });

  const config: Config = $derived({
    id,
    title: uiTitleOption(form, uiSchema) ?? retrievedSchema.title ?? "",
    schema: retrievedSchema,
    uiSchema,
    required,
  });
  const translate = $derived(retrieveTranslate(form, config));
  const uiOption: UiOption = (opt) => retrieveUiOption(form, config, opt);

  setFormContext(form);
</script>

{#if render}
  {@render render({
    type: "field",
    config,
    translate,
    uiOption,
    valueRef,
  })}
{:else}
  {@const Field = getFieldComponent(form, config)}
  <Field
    type="field"
    bind:value={valueRef.value as undefined}
    {config}
    {uiOption}
    {translate}
  />
{/if}
