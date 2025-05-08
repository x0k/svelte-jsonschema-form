<script lang="ts">
  import { editor } from "monaco-editor";
  import { onMount } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    model: editor.ITextModel;
  }

  const { model, ...rest }: Props = $props();

  let editorElement: HTMLDivElement;
  let ed: editor.IStandaloneCodeEditor | undefined;

  $effect(() => {
    model;
    if (ed === undefined) {
      return;
    }
    ed.setModel(model);
  });

  onMount(() => {
    ed = editor.create(editorElement, {
      model,
      theme: "vs-dark",
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
