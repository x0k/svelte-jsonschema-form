<script lang="ts" generics="T, V extends Validator">
  import { isObject } from "@/lib/object.js";
  import { getSchemaDefinitionByPath, type Validator } from "@/core/index.js";

  import { setFormContext, type FormInternalContext } from "./context/index.js";
  import type { FormState } from "./create-form.svelte.js";
  import type { FieldValue } from "./model.js";
  import { getUiSchemaByPath, type UiSchema } from "./ui-schema.js";
  import { pathToId } from "./id.js";
  import Content from "./content.svelte";

  interface Props {
    form: FormState<T, V>;
    name: string;
    required?: boolean;
    uiSchema?: UiSchema;
  }

  const { form, name, required, uiSchema }: Props = $props();

  const ctx = form.context as FormInternalContext<V>;

  const valuePath = $derived(name === "" ? [] : name.split("."));
  const rootId = $derived(pathToId(valuePath, ctx));
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

  const nextUiSchema = $derived(
    uiSchema ??
      getUiSchemaByPath(ctx.uiSchemaRoot, ctx.uiSchema, valuePath) ??
      {}
  );

  setFormContext(
    Object.setPrototypeOf(
      {
        get value() {
          return ref.value;
        },
        set value(v) {
          ref.value = v;
        },
        get rootId() {
          return rootId;
        },
        get uiSchema() {
          return nextUiSchema;
        },
      } satisfies Pick<FormInternalContext<V>, "rootId" | "uiSchema" | "value">,
      ctx
    )
  );
</script>

<Content {name} {required} {schema} />
