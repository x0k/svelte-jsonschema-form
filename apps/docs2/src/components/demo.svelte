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
  import { Willow, WillowDark } from "@svar-ui/svelte-core";
  import { BitsConfig } from "bits-ui";
  import { setThemeContext } from "@sjsf/shadcn4-theme";
  import * as components from "@sjsf/shadcn4-theme/new-york";
  import * as extraComponents from "@sjsf-lab/shadcn-extras-theme/ui";

  import Eye from "@lucide/svelte/icons/eye";
  import CodeXml from "@lucide/svelte/icons/code-xml";
  import Palette from "@lucide/svelte/icons/palette";
  import Zap from "@lucide/svelte/icons/zap";

  import * as baseDefaults from "@/lib/sjsf/defaults";
  import { setDemoContext } from "@/lib/demo";
  import { type DemoName, DEMOS } from "@/lib/demo.generated";
  import type { SupportedLanguage } from "@/lib/shiki";
  import { themeManager } from "@/theme.svelte";

  import { ShadowHost } from "./shadow";
  import Noop from "./shadow/root.svelte";
  import CodeView from "./code.svelte";
  import Button from "./button.svelte";

  setThemeContext({ components: { ...components, ...extraComponents } });

  interface DemoProps {
    name: DemoName;
    theme?: PlaygroundTheme;
    validator?: DemosValidator["name"];
    icons?: CodegenIconSet;
  }

  const { name, theme, validator = "ajv8", icons }: DemoProps = $props();

  let demoState = $state({
    picker: null as null | "themes" | "sandboxes",
  });

  let selectedTheme = $derived(theme ?? "basic");

  const defaults = $derived({
    ...baseDefaults,
    theme: PLAYGROUND_SJSF_THEMES[selectedTheme],
  });

  setDemoContext({
    get defaults() {
      return defaults;
    },
  });

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

  const SvarProvider = $derived(
    selectedTheme === "svar"
      ? themeManager.isDark
        ? WillowDark
        : Willow
      : Noop
  );

  let portalEl = $state.raw() as HTMLDivElement;
  const rootNode = $derived(portalEl?.getRootNode());
  const options = {
    getRootNode() {
      return rootNode;
    },
  };
  const portalOptions = {
    get target() {
      return portalEl;
    },
  };
</script>

<svelte:head>
  {@html `<style>${globalStyles}</style>`}
</svelte:head>

<div class="preview-panel">
  <!-- Toolbar -->
  <div class="preview-toolbar">
    <div class="toolbar-group"></div>
    <div class="toolbar-group">
      {#if theme === undefined}
        <Button
          variant="icon"
          active={demoState.picker === "themes"}
          onclick={() => {
            demoState.picker = demoState.picker === "themes" ? null : "themes";
          }}
          title="Themes"
        >
          <Palette size={16} />
        </Button>
      {/if}
      <Button
        variant="icon"
        active={demoState.picker === "sandboxes"}
        onclick={() => {
          demoState.picker =
            demoState.picker === "sandboxes" ? null : "sandboxes";
        }}
        title="Sandboxes"
      >
        <Zap size={16} />
      </Button>
    </div>
  </div>

  <!-- Theme pills -->
  {#if demoState.picker === "themes"}
    <div class="pills-panel">
      {#each themeList as t (t.id)}
        <Button
          active={selectedTheme === t.id}
          onclick={() => {
            selectedTheme = t.id;
          }}
        >
          {t.title}
        </Button>
      {/each}
    </div>
  {/if}

  <!-- Sandbox pills -->
  {#if demoState.picker === "sandboxes"}
    <div class="pills-panel">
      {#each SANDBOX_PLATFORMS as platform (platform)}
        <Button
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
        </Button>
      {/each}
    </div>
  {/if}

  <!-- Main content -->
  <div class="preview-content">
    <ShadowHost
      style={PLAYGROUND_SJSF_THEME_STYLES[selectedTheme]}
      data-theme={themeManager.darkOrLight}
    >
      <SvarProvider>
        <div
          bind:this={portalEl}
          class={themeManager.darkOrLight}
          data-theme={selectedTheme.startsWith("skeleton")
            ? "cerberus"
            : themeManager.darkOrLight}
          style="padding: 2rem;"
        >
          <BitsConfig defaultPortalTo={portalEl}>
            <Component />
          </BitsConfig>
        </div>
      </SvarProvider>
    </ShadowHost>
  </div>
  <div class="preview-code">
    <CodeView files={codeFiles} />
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
    padding: 0.6rem;
    /* background: var(--sl-color-bg-nav); */
    border-bottom: 1px solid var(--sl-color-gray-5);
  }

  .toolbar-group {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .pills-panel {
    margin: 0;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--sl-color-gray-5);
    /* background: var(--sl-color-bg-nav); */
  }

  .preview-content {
    min-height: 0;
    margin: 0;
  }

  .preview-code {
    margin: 0;
    overflow: hidden;
    :global(pre) {
      max-height: 500px;
      scrollbar-width: none;
    }
  }
</style>
