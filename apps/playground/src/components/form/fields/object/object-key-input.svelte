<script lang="ts">
  import { proxy } from "@/lib/svelte.svelte";

  import type { SchemaValue } from "../../schema";
  import type { UiSchema } from "../../ui-schema";
  import { computeId, type IdSchema } from "../../id-schema";
  import { getFormContext } from "../../context";
  import type { Config } from "../../config";
  import { getWidget } from "../../widgets";
  import { getUiOptions } from "../../utils";

  import { inputAttributes } from "../make-widget-attributes";

  import { getObjectContext } from "./context";
  import { generateNewKey } from "./generate-new-object-key";

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

  const id = $derived(
    computeId(idSchema ?? { $id: ctx.idPrefix }, "key-input")
  );
  const uiOptions = $derived(getUiOptions(ctx, uiSchema));
  const config: Config = $derived({
    name: `${name} Key`,
    schema: { type: "string" },
    idSchema: { $id: id },
    uiSchema,
    uiOptions,
    required: true,
  });
  const Widget = $derived(getWidget(ctx, "text", config));

  const key = proxy<string | undefined>(() => property);

  const attributes = $derived(
    inputAttributes(ctx, config, {
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
        // TODO: Check this variant to avoid warning
        // obj[newKey] = $state.snapshot(obj[property]);
        obj[newKey] = obj[property];
        delete obj[property];
      },
    })
  );
</script>

<Widget {attributes} {config} bind:value={key.value} />
