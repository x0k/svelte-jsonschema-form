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
