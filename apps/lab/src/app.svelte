<script lang="ts">
  import Editor from "@/components/editor.svelte";

  import { createEditorState } from "./editor.svelte.js";
  import { Pane, PaneGroup, PaneResizer } from "paneforge";

  const editorState = createEditorState();
</script>

<div class="app">
  <header>Lab</header>
  <PaneGroup
    direction="horizontal"
    class="flex h-full w-full data-[direction=vertical]:flex-col"
  >
    <Pane defaultSize={50}>One</Pane>
    <PaneResizer
      class="bg-secondary/20 focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 data-[direction=vertical]:h-px data-[direction=vertical]:w-full data-[direction=vertical]:after:left-0 data-[direction=vertical]:after:h-1 data-[direction=vertical]:after:w-full data-[direction=vertical]:after:-translate-y-1/2 data-[direction=vertical]:after:translate-x-0 [&[data-direction=vertical]>div]:rotate-90"
    />
    <Pane defaultSize={50}>
      <PaneGroup
        direction="vertical"
        class="flex h-full w-full data-[direction=vertical]:flex-col"
      >
        <Pane defaultSize={50}>Two</Pane>
        <PaneResizer
          class="bg-secondary/20 focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 data-[direction=vertical]:h-px data-[direction=vertical]:w-full data-[direction=vertical]:after:left-0 data-[direction=vertical]:after:h-1 data-[direction=vertical]:after:w-full data-[direction=vertical]:after:-translate-y-1/2 data-[direction=vertical]:after:translate-x-0 [&[data-direction=vertical]>div]:rotate-90"
        />
        <Pane defaultSize={50}>Three</Pane>
      </PaneGroup>
    </Pane>
  </PaneGroup>
</div>

<style>
  .app {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto minmax(0, 1fr);
    height: 100%;
  }
</style>
