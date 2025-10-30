<script lang="ts" generics="I, O, P extends JsonPaths<I>">
  import type { Snippet } from "svelte";
  import { DEV } from "esm-env";

  import type { Ref } from '@/lib/svelte.svelte.js';
  import type { JsonPaths } from "@/lib/types.js";
  import { isObject } from "@/lib/object.js";
  import { getSchemaDefinitionByPath, isSchemaObjectValue } from "@/core/index.js";

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
  import type { Config } from "./config.js";
  import type { ComponentProps } from "./components.js";
  import type { FoundationalFieldType } from "./fields.js";
  import {
    FORM_MERGER,
    FORM_PATHS_TRIE_REF,
    FORM_SCHEMA,
    FORM_UI_SCHEMA,
    FORM_UI_SCHEMA_ROOT,
    FORM_VALIDATOR,
    FORM_VALUE,
    internalRegisterFieldPath,
  } from "./internals.js";

  interface Props {
    form: FormState<I, O>;
    path: P;
    required?: boolean;
    uiSchema?: UiSchema;
    render?: Snippet<
      [
        Omit<ComponentProps[FoundationalFieldType], "value"> & {
          valueRef: Ref<FieldValue>;
        },
      ]
    >;
  }

  const {
    form,
    path: providedPath,
    required: requiredOverride,
    uiSchema: uiSchemaOverride,
    render,
  }: Props = $props();

  if (DEV) {
    $effect(() => {
      if (providedPath.length === 0 && render === undefined) {
        console.warn('Use `<Content />` instead of `<Field name="" />`');
      }
    });
  }

  const path = $derived(
    internalRegisterFieldPath(form[FORM_PATHS_TRIE_REF], providedPath)
  );

  const valueRef: Ref<FieldValue> = $derived.by(() => {
    if (path.length === 0) {
      return {
        get current() {
          return form[FORM_VALUE];
        },
        set current(v) {
          form[FORM_VALUE] = v;
        },
      };
    }
    let node = form[FORM_VALUE];
    let i = -1;
    const lastIndex = path.length - 1;
    while (isObject(node) && ++i < lastIndex) {
      // @ts-expect-error
      node = node[path[i]];
    }
    if (i !== lastIndex) {
      console.error("Current form state", $state.snapshot(form[FORM_VALUE]));
      throw new Error(
        `Path "[${path.join(", ")}]" is not populated or invalid, check current form state`
      );
    }
    const lastKey = path[lastIndex]!;
    return {
      get current() {
        //@ts-expect-error
        return node[lastKey];
      },
      set current(v) {
        //@ts-expect-error
        node[lastKey] = v;
      },
    };
  });

  const parentSchema = $derived.by(() => {
    const len = path.length;
    if (len < 2) {
      return form[FORM_SCHEMA];
    }
    const def = getSchemaDefinitionByPath(
      form[FORM_VALIDATOR],
      form[FORM_MERGER],
      form[FORM_SCHEMA],
      form[FORM_SCHEMA],
      path.slice(0, -1),
      valueRef.current
    );
    return def === undefined || typeof def === "boolean" ? {} : def;
  });

  const schema = $derived.by(() => {
    if (path.length === 0) {
      return form[FORM_SCHEMA];
    }
    let val: FieldValue = valueRef.current;
    const parentPath = path.slice(0, -1)
    for (let i = 0; i < parentPath.length && val !== undefined; i++) {
      const p = parentPath[i]!;
      if (typeof p === 'number') {
        val = Array.isArray(val) ? val[p] : undefined
      } else {
        val = isSchemaObjectValue(val) ? val[p] : undefined
      }
    }
    const def = getSchemaDefinitionByPath(
      form[FORM_VALIDATOR],
      form[FORM_MERGER],
      form[FORM_SCHEMA],
      parentSchema,
      path.slice(-1),
      val
    );
    return def === undefined || typeof def === "boolean" ? {} : def;
  });

  const retrievedSchema = $derived(
    retrieveSchema(form, schema, valueRef.current)
  );

  const uiSchema = $derived(
    uiSchemaOverride ??
      getUiSchemaByPath(
        form[FORM_UI_SCHEMA_ROOT],
        form[FORM_UI_SCHEMA],
        path
      ) ??
      {}
  );

  const required = $derived.by(() => {
    if (requiredOverride !== undefined) {
      return requiredOverride;
    }
    if (path.length === 0) {
      return false;
    }
    const property = path[path.length - 1]!;
    const { required, items, minItems } = parentSchema;
    if (Array.isArray(required)) {
      return required.includes(property as string);
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
    path,
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
    bind:value={valueRef.current as undefined}
    {config}
    {uiOption}
    {translate}
  />
{/if}
