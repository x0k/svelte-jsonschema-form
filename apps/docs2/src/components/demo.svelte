<script lang="ts">
  import {
    type PlaygroundTheme,
    PLAYGROUND_SJSF_THEMES,
    PLAYGROUND_SJSF_THEME_STYLES,
    PLAYGROUND_SJSF_GLOBAL_THEME_STYLES,
    playgroundThemes,
  } from "meta/playground";
  import { themeOrSubThemeTitle } from "meta";
  import { SANDBOX_PLATFORMS, sandboxPlatformLabel } from "meta/sandbox";
  import { openDemo, type DemosValidator } from "meta/demos";
  import type { CodegenIconSet } from "meta/codegen";

  import Eye from "@lucide/svelte/icons/eye";
  import CodeXml from "@lucide/svelte/icons/code-xml";
  import Palette from "@lucide/svelte/icons/palette";
  import Zap from "@lucide/svelte/icons/zap";

  import { defaults, setDefaultsContext } from "@/lib/demo";
  import { type DemoName, DEMOS } from "@/lib/demo.generated";
  import { highlighterPromise, type SupportedLanguage } from "@/lib/shiki";
  import { themeManager } from "@/theme.svelte";

  import { ShadowHost } from "./shadow";
  import CodeView from "./code.svelte";

  interface DemoProps {
    name: DemoName;
    theme?: PlaygroundTheme;
    validator?: DemosValidator["name"];
    icons?: CodegenIconSet;
  }

  const { name, theme, validator = "ajv8", icons }: DemoProps = $props();

  let state = $state({
    view: "preview" as "preview" | "code",
    picker: null as null | "themes" | "sandboxes",
  });

  let selectedTheme = $derived(theme ?? "basic");

  setDefaultsContext(
    Object.setPrototypeOf(
      {
        get theme() {
          return PLAYGROUND_SJSF_THEMES[selectedTheme];
        },
      },
      defaults
    )
  );

  const globalStyles = $derived(
    PLAYGROUND_SJSF_GLOBAL_THEME_STYLES[selectedTheme]
  );

  const themeList = $derived(
    Array.from(playgroundThemes()).map((t) => ({
      id: t,
      title: themeOrSubThemeTitle(t),
    }))
  );

  const { Component, files: extraFiles } = $derived(
    (await DEMOS[name]()).default
  );

  const codeFiles = $derived(
    Object.entries(extraFiles).map(([path, content]) => ({
      title: path.split("/").pop() ?? path,
      lang: getLanguage(path),
      content,
    }))
  );

  function getLanguage(path: string): SupportedLanguage {
    if (path.endsWith(".svelte")) return "svelte";
    if (path.endsWith(".ts") || path.endsWith(".js")) return "typescript";
    if (path.endsWith(".json")) return "json";
    if (path.endsWith(".css")) return "css";
    return "typescript";
  }
</script>

<svelte:head>
  {@html `<style>${globalStyles}</style>`}
</svelte:head>

<div class="preview-panel">
  <!-- Toolbar -->
  <div class="preview-toolbar">
    <div class="toolbar-group toolbar-left">
      <button
        class="toolbar-btn"
        class:active={state.view === "preview"}
        onclick={() => {
          state.picker = null;
          state.view = "preview";
        }}
        title="Preview"
      >
        <Eye size={16} />
      </button>
      <button
        class="toolbar-btn"
        class:active={state.view === "code"}
        onclick={() => {
          state.picker = null;
          state.view = "code";
        }}
        title="Code"
      >
        <CodeXml size={16} />
      </button>
    </div>
    <div class="toolbar-group toolbar-right">
      {#if theme === undefined}
        <button
          class="toolbar-btn"
          class:active={state.picker === "themes"}
          onclick={() => {
            state.picker = state.picker === "themes" ? null : "themes";
          }}
          title="Themes"
        >
          <Palette size={16} />
        </button>
      {/if}
      <button
        class="toolbar-btn"
        class:active={state.picker === "sandboxes"}
        onclick={() => {
          state.picker = state.picker === "sandboxes" ? null : "sandboxes";
        }}
        title="Sandboxes"
      >
        <Zap size={16} />
      </button>
    </div>
  </div>

  <!-- Theme pills -->
  {#if state.picker === "themes"}
    <div class="pills-panel">
      {#each themeList as t (t.id)}
        <button
          class="pill"
          class:active={selectedTheme === t.id}
          onclick={() => {
            selectedTheme = t.id;
          }}
        >
          {t.title}
        </button>
      {/each}
    </div>
  {/if}

  <!-- Sandbox pills -->
  {#if state.picker === "sandboxes"}
    <div class="pills-panel">
      {#each SANDBOX_PLATFORMS as platform (platform)}
        <button
          class="pill"
          onclick={async () => {
            await openDemo({
              name: "example",
              themeOrSubTheme: selectedTheme,
              validator,
              icons,
              extraFiles,
              platform,
            });
          }}
        >
          {sandboxPlatformLabel(platform)}
        </button>
      {/each}
    </div>
  {/if}

  <!-- Main content -->
  <div class="preview-content">
    {#if state.view === "preview"}
      <ShadowHost
        style={PLAYGROUND_SJSF_THEME_STYLES[selectedTheme]}
        data-theme={themeManager.darkOrLight}
      >
        <Component />
      </ShadowHost>
    {:else}
      <CodeView highlighter={await highlighterPromise} files={codeFiles} />
    {/if}
  </div>
</div>

<style>
  .preview-panel {
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 1px;
    overflow: hidden;
    background: var(--sl-color-bg);
  }

  .preview-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem;
    /* background: var(--sl-color-bg-nav); */
    border-bottom: 1px solid var(--sl-color-gray-5);
  }

  .toolbar-group {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .toolbar-btn {
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: 1px solid transparent;
    border-radius: 0.375rem;
    background: transparent;
    color: var(--sl-color-gray-3);
    cursor: pointer;
    transition:
      background 0.15s,
      color 0.15s,
      border-color 0.15s;
  }

  .toolbar-btn:hover {
    background: var(--sl-color-gray-6);
    color: var(--sl-color-white);
  }

  .toolbar-btn.active {
    background: var(--sl-color-gray-5);
    color: var(--sl-color-white);
    border-color: var(--sl-color-text-accent);
  }

  .pills-panel {
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--sl-color-gray-5);
    /* background: var(--sl-color-bg-nav); */
  }

  .pill {
    all: unset;
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 1rem;
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 9999px;
    background: var(--sl-color-bg);
    color: var(--sl-color-gray-3);
    font-size: var(--sl-text-xs);
    cursor: pointer;
    transition:
      background 0.15s,
      color 0.15s,
      border-color 0.15s;
  }

  .pill:hover {
    background: var(--sl-color-gray-6);
    color: var(--sl-color-white);
  }

  .pill.active {
    background: var(--sl-color-gray-5);
    color: var(--sl-color-white);
    border-color: var(--sl-color-text-accent);
  }

  .preview-content {
    min-height: 0;
    margin: 0;
  }
</style>
