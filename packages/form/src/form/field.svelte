<script lang="ts" module>
  type JsonPrimitive = string | number | boolean | null;
  type JsonValue = JsonPrimitive | JsonObject | JsonArray;
  type JsonObject = { [key: string]: JsonValue };
  type JsonArray = readonly JsonValue[];

  type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...0[]];

  type IsTuple<T> = T extends readonly any[]
    ? number extends T["length"]
      ? false
      : true
    : false;

  type Indices<T extends readonly any[]> = Exclude<keyof T, keyof any[]>;

  type DeepPaths<T, D extends number = 10> = [D] extends [never]
    ? never
    : T extends JsonPrimitive
      ? never
      : T extends readonly any[]
        ? IsTuple<T> extends true
          ? // Handle tuples
            {
              [K in Indices<T>]: K extends `${number}`
                ? T[K] extends JsonPrimitive
                  ? K
                  : T[K] extends JsonValue
                    ? K | `${K}.${DeepPaths<T[K], Prev[D]>}`
                    : never
                : never;
            }[Indices<T>]
          : // Handle arrays
            T extends readonly (infer U)[]
            ? U extends JsonPrimitive
              ? `${number}`
              : U extends JsonValue
                ? `${number}` | `${number}.${DeepPaths<U, Prev[D]>}`
                : never
            : never
        : T extends object
          ? // Handle objects
            {
              [K in keyof T]: K extends string | number
                ? T[K] extends JsonPrimitive
                  ? `${K}`
                  : T[K] extends JsonValue
                    ? `${K}` | `${K}.${DeepPaths<T[K], Prev[D]>}`
                    : never
                : never;
            }[keyof T]
          : never;
</script>

<script lang="ts" generics="T, V extends Validator">
  import { isObject } from "@/lib/object.js";
  import { getSchemaDefinitionByPath, type Validator } from "@/core/index.js";

  import {
    getFieldComponent,
    retrieveSchema,
    retrieveTranslate,
    retrieveUiOption,
    setFormContext,
    uiTitleOption,
    type FormInternalContext,
  } from "./context/index.js";
  import type { FormState } from "./create-form.svelte.js";
  import type { FieldValue } from "./model.js";
  import { getUiSchemaByPath, type UiSchema } from "./ui-schema.js";
  import { pathToId } from "./id.js";
  import type { Config } from "./config.js";

  interface Props {
    form: FormState<T, V>;
    name: DeepPaths<T> | "";
    required?: boolean;
    uiSchema?: UiSchema;
  }

  const {
    form,
    name,
    required = false,
    uiSchema: uiSchemaOverride,
  }: Props = $props();

  const ctx = form.context as FormInternalContext<V>;

  const valuePath = $derived(name === "" ? [] : name.split("."));

  const id = $derived(pathToId(valuePath, ctx));

  const ref: { value: FieldValue } = $derived.by(() => {
    const pLen = valuePath.length;
    if (pLen === 0) {
      return ctx;
    }
    let node = ctx.value;
    let i = -1;
    const lastIndex = pLen - 1;
    while (isObject(node) && ++i < lastIndex) {
      // @ts-expect-error
      node = node[valuePath[i]];
    }
    if (i !== lastIndex) {
      console.error("Current form state", $state.snapshot(ctx.value));
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

  const schema = $derived.by(() => {
    const def = getSchemaDefinitionByPath(ctx.schema, ctx.schema, valuePath);
    return def === undefined || typeof def === "boolean" ? {} : def;
  });

  const retrievedSchema = $derived(retrieveSchema(ctx, schema, ref.value));

  const uiSchema = $derived(
    uiSchemaOverride ??
      getUiSchemaByPath(ctx.uiSchemaRoot, ctx.uiSchema, valuePath) ??
      {}
  );

  const config: Config = $derived({
    id,
    title: uiTitleOption(ctx, uiSchema) ?? retrievedSchema.title ?? "",
    schema: retrievedSchema,
    uiSchema,
    required,
  });

  const Field = $derived(getFieldComponent(ctx, config));

  setFormContext(ctx);
</script>

<Field
  type="field"
  bind:value={ref.value as undefined}
  {config}
  uiOption={(opt) => retrieveUiOption(ctx, config, opt)}
  translate={retrieveTranslate(ctx, config)}
/>
