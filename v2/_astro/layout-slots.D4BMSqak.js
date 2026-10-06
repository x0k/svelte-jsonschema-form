const n=`<script lang="ts">
  import { overrideByRecord } from "@sjsf/form/lib/resolver";
  import {
    createForm,
    BasicForm,
    type Schema,
    type UiSchemaRoot,
  } from "@sjsf/form";

  import * as defaults from "$lib/form-defaults";

  import Layout from "./layout.svelte";

  const schema = {
    type: "object",
    title: "Basic form",
    properties: {
      hello: {
        title: "Hello",
        type: "string",
      },
    },
    required: ["hello"],
  } as const satisfies Schema;

  const uiSchema: UiSchemaRoot = {
    "ui:options": {
      myLayoutSlots: {
        "object-field-meta": {
          afterLayout: greeting,
        },
      },
    },
  };

  const form = createForm({
    ...defaults,
    theme: overrideByRecord(defaults.theme, { layout: Layout }),
    schema,
    uiSchema,
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} />
{#snippet greeting()}
  <p>
    Hi, in this example you can see how you can add text and any other content
    to a form.
  </p>
  <p>
    Of course you can use \`nullField\` to create text fields, but this changes
    the data model, which may not be acceptable in some situations.
  </p>
{/snippet}

<style>
  p {
    margin: 0;
  }
</style>
`,e=`<script lang="ts" module>
  import type { Snippet } from "svelte";
  import { getFormContext, uiOptionNestedProps, type Config } from "@sjsf/form";
  import type { LayoutType } from "@sjsf/form/fields/components";

  declare module "@sjsf/form" {
    interface UiOptions {
      myLayoutSlots: {
        [L in LayoutType]?: Partial<{
          beforeLayout: Snippet<[Config]>;
          afterLayout: Snippet<[Config]>;
          beforeContent: Snippet<[Config]>;
          afterContent: Snippet<[Config]>;
        }>;
      };
    }
  }
<\/script>

<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";

  import { theme } from "$lib/form-defaults";

  const { children, config, errors, type }: ComponentProps["layout"] = $props();

  const ctx = getFormContext();

  const OriginalLayout = $derived(theme("layout", config));

  const { afterContent, afterLayout, beforeContent, beforeLayout } = $derived(
    uiOptionNestedProps("myLayoutSlots", (data) => data[type])({}, config, ctx)
  );
<\/script>

{@render beforeLayout?.(config)}
<OriginalLayout {config} {errors} {type}>
  {@render beforeContent?.(config)}
  {@render children()}
  {@render afterContent?.(config)}
</OriginalLayout>
{@render afterLayout?.(config)}
`,t={files:{"src/routes/+page.svelte":n,"src/routes/layout.svelte":e}};export{t as layer};
