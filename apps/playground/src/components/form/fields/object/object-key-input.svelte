<script lang="ts">
  import { createTransformation } from "@/lib/svelte.svelte";
  import { noop } from "@/lib/function";

  import type { SchemaValue } from "../../schema";
  import type { UiSchema } from "../../ui-schema";
  import { computeId, type IdSchema } from "../../id-schema";
  import { getFormContext } from "../../context";
  import { getUiOptions, getWidget } from "../../utils";

  import { inputAttributes, makeAttributes } from "../utils";

  import { getObjectContext } from "./context";
  import { generateNewKey } from "./utils";

  const {
    property,
    name,
    uiSchema,
    idSchema,
  }: {
    property: string;
    name: string;
    uiSchema: UiSchema;
    idSchema: IdSchema<SchemaValue> | undefined;
  } = $props();

  const ctx = getFormContext();
  const objCtx = getObjectContext();

  const Widget = $derived(getWidget(ctx, "text", uiSchema));

  const uiOptions = $derived(getUiOptions(ctx, uiSchema));

  const key = createTransformation<string | undefined>({
    transform: () => property,
  });

  const attributes = $derived.by(() => {
    const id = computeId(idSchema ?? { $id: ctx.idPrefix }, "key-input");
    return makeAttributes(
      ctx,
      {
        id,
        name: id,
        required: true,
        onfocus: noop,
        onblur: () => {
          if (!key.value || key.value === property) {
            return;
          }
          const obj = objCtx.value;
          if (obj === undefined) {
            console.warn("Object value is undefined");
            return;
          }
          const newKey = generateNewKey(key.value, objCtx.newKeySeparator, obj);
          obj[newKey] = obj[property];
          delete obj[property];
        },
      },
      inputAttributes(uiOptions?.input)
    );
  });
</script>

<Widget {attributes} label={`${name} Key`} bind:value={key.value} />
