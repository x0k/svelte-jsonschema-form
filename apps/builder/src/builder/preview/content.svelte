<script lang="ts">
  import Code, { type CodeFile } from "$lib/components/code.svelte";

  import { getBuilderContext } from "../context.svelte.js";
  import { PreviewSubRouteName, type PreviewRoute } from "../model.js";
  import Form from "./form.svelte";

  const { route }: { route: PreviewRoute } = $props();

  const ctx = getBuilderContext();

  const ROUTE_FILES: Record<PreviewSubRouteName, CodeFile[]> = {
    [PreviewSubRouteName.Code]: [
      {
        title: "form.svelte",
        lang: "svelte",
        get content() {
          return ctx.formDotSvelte;
        },
      },
      {
        title: "defaults.ts",
        lang: "typescript",
        get content() {
          return ctx.formDefaults;
        },
      },
    ],
    [PreviewSubRouteName.Schema]: [
      {
        title: "schema.json",
        lang: "json",
        get content() {
          return JSON.stringify(ctx.schema, null, 2);
        },
      },
      {
        title: "ui-schema.json",
        lang: "json",
        get content() {
          return JSON.stringify(ctx.uiSchema, null, 2);
        },
      },
    ],
  };
</script>

{#if route.subRoute === undefined}
  <Form />
{:else}
  <Code files={ROUTE_FILES[route.subRoute]} />
{/if}
