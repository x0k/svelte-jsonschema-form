<script lang="ts">
  import { Pane, PaneGroup, PaneResizer } from "paneforge";
  import type * as monaco from "monaco-editor";

  import { THEME_TITLES, THEMES } from "./shared/index.js";
  import { createEditorState } from "./editor.svelte.js";
  import { themeManager } from "./theme.svelte.js";
  import Dropdown from "./components/dropdown.svelte";
  import Editor from "./components/editor.svelte";
  import CreateProject from "./containers/create-project.svelte";
  import {
    LabService,
    SubPage,
    type ProjectsService,
  } from "./services/lab.svelte.js";
  import { FsService } from "./services/fs.js";

  interface Props {
    projectsService: ProjectsService;
  }

  const { projectsService }: Props = $props();

  let editor = $state<monaco.editor.IStandaloneCodeEditor>();
  function editorResize() {
    editor?.layout(undefined, true);
  }
  const editorState = createEditorState();

  const labService = new LabService(projectsService);
  const fsService = new FsService();

  $effect(() => {
    if (labService.currentProject === undefined) {
      return;
    }
    fsService.registerProjectFiles(labService.currentProject);
    return () => {
      fsService.disposeProjectFiles();
    };
  });
</script>

<svelte:window onresize={editorResize} />
<div class="app">
  {#if labService.delayed}
    <progress class="z-1000 progress progress-primary w-full absolute"
    ></progress>
  {/if}
  <header class="flex p-2 items-center gap-2 z-50">
    <h1 class="text-3xl font-bold">Lab</h1>
    <button
      class="btn btn-ghost"
      onclick={() => labService.openSubPage(SubPage.Create)}
    >
      Create
    </button>
    <Dropdown
      class="dropdown-center ml-auto"
      bind:value={themeManager.theme}
      options={THEMES}
    >
      {#snippet label(theme)}
        {THEME_TITLES[theme]}
      {/snippet}
    </Dropdown>
  </header>
  <PaneGroup
    direction="horizontal"
    class="flex h-full w-full data-[direction=vertical]:flex-col"
  >
    <Pane defaultSize={50} onResize={editorResize}>
      <Editor
        bind:editor
        theme={themeManager.editorTheme}
        class="h-full w-full"
        model={editorState.activeTab.model}
      />
    </Pane>
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
<dialog class="modal" open={labService.currentSubPage === SubPage.Create}>
  <div class="modal-box">
    {#if labService.currentProject}
      <button
        onclick={() => labService.closeSubPage()}
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button
      >
    {/if}
    <h3 class="text-lg font-bold">Projects</h3>
    <CreateProject
      createProject={(s) => {
        labService.createProject(s);
      }}
    />
    <h3 class="text-lg font-bold my-4">Recent projects</h3>
    {#if labService.loading}
      <p>Loading...</p>
    {:else if labService.recentProjects.length === 0}
      <p>You don't have any projects yet</p>
    {:else}
      <table class="table table-sm">
        <tbody>
          {#each labService.recentProjects as p (p.id)}
            <tr
              class="cursor-pointer hover:bg-base-200"
              onclick={() => labService.openProject(p.id)}
            >
              <td class="w-full">{p.title}</td>
              <td class="min-w-25 text-center"
                >{p.updatedAt.toLocaleString()}</td
              >
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</dialog>

<style>
  .app {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto minmax(0, 1fr);
    height: 100%;
  }
</style>
