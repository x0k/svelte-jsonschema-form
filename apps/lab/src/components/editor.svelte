<script lang="ts" module>
  import { initialize } from "vscode/services";
  import getLanguagesServiceOverride from "@codingame/monaco-vscode-languages-service-override";
  import getThemeServiceOverride from "@codingame/monaco-vscode-theme-service-override";
  import getTextMateServiceOverride from "@codingame/monaco-vscode-textmate-service-override";
  import getConfigurationServiceOverride, {
    updateUserConfiguration,
  } from "@codingame/monaco-vscode-configuration-service-override";
  // import getWorkbenchServiceOverride from '@codingame/monaco-vscode-workbench-service-override';
  import "@codingame/monaco-vscode-theme-defaults-default-extension";
  // import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
  // import TsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
  // import CssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
  // import HtmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";

  export type WorkerLoader = () => Worker;
  const workerLoaders: Partial<Record<string, WorkerLoader>> = {
    TextEditorWorker: () =>
      new Worker(
        new URL(
          "monaco-editor/esm/vs/editor/editor.worker.js",
          import.meta.url
        ),
        { type: "module" }
      ),
    TextMateWorker: () =>
      new Worker(
        new URL(
          "@codingame/monaco-vscode-textmate-service-override/worker",
          import.meta.url
        ),
        { type: "module" }
      ),
  };

  window.MonacoEnvironment = {
    getWorker(_, label) {
      const workerFactory = workerLoaders[label];
      if (workerFactory === undefined) {
        throw new Error(`Worker ${label} not found`);
      }
      return workerFactory();
    },
  };

  const init = initialize(
    Object.assign(
      {},
      getTextMateServiceOverride(),
      getThemeServiceOverride(),
      getLanguagesServiceOverride(),
      getConfigurationServiceOverride()
    )
  );
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import * as monaco from "monaco-editor";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    model: monaco.editor.ITextModel;
    theme: string;
    editor?: monaco.editor.IStandaloneCodeEditor;
  }

  let { model, theme, editor = $bindable(), ...rest }: Props = $props();

  let editorElement: HTMLDivElement;

  $effect(() => {
    if (editor === undefined) {
      return;
    }
    editor.setModel(model);
  });

  $effect(() => {
    if (editor === undefined) {
      return;
    }
    updateUserConfiguration(
      JSON.stringify({
        "workbench.colorTheme": theme,
      })
    );
  });

  onMount(() => {
    init.then(() => {
      editor = monaco.editor.create(editorElement, {
        model,
        theme,
        fixedOverflowWidgets: true,
        wordBasedSuggestions: "currentDocument",
        lineNumbers: "on",
        tabSize: 2,
        insertSpaces: true,
        fontSize: 16,
        bracketPairColorization: {
          enabled: true,
        },
        minimap: {
          enabled: false,
        },
      });
    });
    return () => {
      editor?.dispose();
    };
  });
</script>

<div bind:this={editorElement} {...rest}></div>
