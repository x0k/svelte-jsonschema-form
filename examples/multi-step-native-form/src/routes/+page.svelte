<script lang="ts">
  import { extendByRecord } from "@sjsf/form/lib/resolver";
  import { isSchemaObjectValue } from "@sjsf/form/core";
  import {
    setFormContext,
    Content,
    SubmitButton,
    type ComponentType,
    pathToId,
  } from "@sjsf/form";
  import { createMeta, setupSvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/form-defaults";

  import type { ActionData, PageData } from "./$types";
  import HiddenField from "./hidden-field.svelte";

  const meta = createMeta<ActionData, PageData>().form;

  const PRIMITIVE_FIELDS = new Set<ComponentType>([
    "stringField",
    "numberField",
    "integerField",
    "booleanField",
    "nullField",
  ]);

  const { form } = setupSvelteKitForm(meta, {
    ...defaults,
    theme: extendByRecord(defaults.theme, { hiddenField: HiddenField }),
    resolver: (ctx) => {
      const original = defaults.resolver(ctx);
      return (config) => {
        const type = original(config);
        if (PRIMITIVE_FIELDS.has(type)) {
          const step = (
            isSchemaObjectValue(ctx.value) ? (ctx.value.__step ?? 0) : 0
          ).toString();
          const prefix = pathToId([step], ctx);
          if (!config.id.startsWith(prefix)) {
            return "hiddenField";
          }
        }
        return type;
      };
    },
    onSubmit: console.log,
  });
  setFormContext(form.context);
</script>

<form
  novalidate
  method="POST"
  style="display: flex; flex-direction: column; gap: 1rem;"
>
  <Content />
  <SubmitButton />
</form>
