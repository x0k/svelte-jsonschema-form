<script lang="ts" module>
  import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
  import TsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
  import CssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
  import HtmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";

  window.MonacoEnvironment = {
    getWorker(_, name) {
      switch (name) {
        case "editorWorkerService":
          return new EditorWorker({ name });
        case "javascript":
        case "typescript":
          return new TsWorker({ name });
        case "css":
        case "scss":
        case "less":
          return new CssWorker({ name });
        case "html":
        case "handlebars":
        case "razor":
          return new HtmlWorker({ name });
        default:
          throw new Error(`Unknown label ${name}`);
      }
    },
  };
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { editor } from "monaco-editor";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    model: editor.ITextModel;
    theme: string;
    editor?: editor.IStandaloneCodeEditor;
  }

  let { model, theme, editor: ed = $bindable(), ...rest }: Props = $props();

  let editorElement: HTMLDivElement;

  $effect(() => {
    model;
    if (ed === undefined) {
      return;
    }
    ed.setModel(model);
  });

  $effect(() => {
    theme;
    if (ed === undefined) {
      return;
    }
    editor.setTheme(theme);
  });

  onMount(() => {
    ed = editor.create(editorElement, {
      model,
      theme,
      fixedOverflowWidgets: true,
      wordBasedSuggestions: 'currentDocument',
      lineNumbers: "on",
      tabSize: 2,
      insertSpaces: true,
      fontSize: 16,
      minimap: {
        enabled: false,
      },
    });
    return () => {
      ed?.dispose();
    };
  });
</script>

<div bind:this={editorElement} {...rest}></div>
