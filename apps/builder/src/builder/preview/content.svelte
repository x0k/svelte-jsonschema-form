<script lang="ts">
  import FileIcon from "@lucide/svelte/icons/file";
  import { isRecordEmpty } from "@sjsf/form/lib/object";
  import DeviconPlainCss from "~icons/devicon-plain/css";
  import DeviconPlainHtml from "~icons/devicon-plain/html5";
  import DeviconPlainJavascript from "~icons/devicon-plain/javascript";
  import DeviconPlainSvelte from "~icons/devicon-plain/svelte";
  import DeviconPlainTypescript from "~icons/devicon-plain/typescript";
  import MdiCodeJson from "~icons/mdi/code-json";

  import Code, { type CodeFile } from "$lib/components/code.svelte";

  import { getBuilderContext } from "../context.svelte.js";
  import { PreviewSubRouteName, type PreviewRoute } from "../model.js";
  import Form from "./form.svelte";

  const { route }: { route: PreviewRoute } = $props();

  const ctx = getBuilderContext();

  const EXTENSION_ICONS: Record<string, typeof DeviconPlainSvelte> = {
    svelte: DeviconPlainSvelte,
    ts: DeviconPlainTypescript,
    js: DeviconPlainJavascript,
    css: DeviconPlainCss,
    json: MdiCodeJson,
    html: DeviconPlainHtml,
  };

  const ROUTE_FILES: Record<PreviewSubRouteName, () => CodeFile[]> = {
    [PreviewSubRouteName.Code]: () => {
      return ctx.files.map(({ title, extension, htmlContent, filepath }) => {
        const Icon = EXTENSION_ICONS[extension] ?? FileIcon;
        return {
          Icon,
          title,
          content: htmlContent,
          filepath,
        };
      });
    },
    [PreviewSubRouteName.Schema]: () => {
      const files = [
        {
          Icon: MdiCodeJson,
          title: "schema.json",
          filepath: "",
          get content() {
            return ctx.highlight("json", JSON.stringify(ctx.schema, null, 2));
          },
        },
      ];
      if (ctx.uiSchema && !isRecordEmpty(ctx.uiSchema)) {
        files.push({
          Icon: MdiCodeJson,
          title: "ui-schema.json",
          filepath: "",
          get content() {
            return ctx.highlight(
              "json",
              JSON.stringify(ctx.uiSchema ?? {}, null, 2)
            );
          },
        });
      }
      return files;
    },
  };
</script>

{#if route.subRoute === undefined}
  <Form />
{:else}
  <Code files={ROUTE_FILES[route.subRoute]()} />
{/if}
