<script lang="ts">
  import Code, { type CodeFile } from "$lib/components/code.svelte";

  import { getBuilderContext } from "../context.svelte.js";
  import { PreviewSubRouteName, type PreviewRoute } from "../model.js";
  import Form from "./form.svelte";

  const { route }: { route: PreviewRoute } = $props();

  const ctx = getBuilderContext();

  const ROUTE_FILES: Record<PreviewSubRouteName, () => CodeFile[]> = {
    [PreviewSubRouteName.Code]: () => {
      const files: CodeFile[] = [
        {
          title: "form.svelte",
          get content() {
            return ctx.formDotSvelte;
          },
        },
        {
          title: "defaults.ts",
          get content() {
            return ctx.formDefaults;
          },
        },
        {
          title: "install.sh",
          get content() {
            return ctx.installSh;
          },
        },
      ];
      if (ctx.appCss.length > 0) {
        files.push({
          title: "app.css",
          get content() {
            return ctx.appCss;
          },
        });
      }
      return files;
    },
    [PreviewSubRouteName.Schema]: () => [
      {
        title: "schema.json",
        get content() {
          return ctx.highlight("json", JSON.stringify(ctx.schema, null, 2));
        },
      },
      {
        title: "ui-schema.json",
        get content() {
          return ctx.highlight(
            "json",
            JSON.stringify(ctx.uiSchema ?? {}, null, 2)
          );
        },
      },
    ],
  };
</script>

{#if route.subRoute === undefined}
  <Form />
{:else}
  <Code files={ROUTE_FILES[route.subRoute]()} />
{/if}
