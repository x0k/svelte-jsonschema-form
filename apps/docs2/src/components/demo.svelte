<script lang="ts" module>
  import type { PlaygroundTheme, PlaygroundIconSet } from "meta/playground";

  import { createPersistentRef } from "@/lib/svelte.svelte";

  const persistentThemeRef = createPersistentRef<PlaygroundTheme>(
    "demo-theme",
    "basic"
  );
  const persistentIconsRef = createPersistentRef<PlaygroundIconSet>(
    "demo-icons",
    "none"
  );
</script>

<script lang="ts">
  import Astroid from "@lucide/svelte/icons/astroid";
  import Palette from "@lucide/svelte/icons/palette";
  import Terminal from "@lucide/svelte/icons/square-terminal";
  import * as extraComponents from "@sjsf-lab/shadcn-extras-theme/ui";
  import type { ExtraUiOptions } from "@sjsf/form";
  import { fromRecord } from "@sjsf/form/lib/resolver";
  import { setThemeContext } from "@sjsf/shadcn4-theme";
  import * as components from "@sjsf/shadcn4-theme/new-york";
  import { Willow, WillowDark } from "@svar-ui/svelte-core";
  import { BitsConfig } from "bits-ui";
  import { themeOrSubThemeTitle, type IconSet, extraPackage } from "meta";
  import { openDemo } from "meta/demos";
  import {
    PLAYGROUND_SJSF_THEMES,
    PLAYGROUND_SJSF_THEME_STYLES,
    PLAYGROUND_SJSF_GLOBAL_THEME_STYLES,
    PLAYGROUND_ICON_SET_STYLES,
    playgroundThemes,
    PLAYGROUND_ICON_SETS,
    playgroundIconSetTitle,
    playgroundIconSets,
  } from "meta/playground";
  import { SANDBOX_PLATFORMS, sandboxPlatformLabel } from "meta/sandbox";
  import { untrack } from "svelte";

  import { setDemoContext } from "@/lib/demo";
  import { type DemoName, DEMOS } from "@/lib/demo.generated";
  import type { SupportedLanguage } from "@/lib/shiki";
  import * as baseDefaults from "@/lib/sjsf/defaults";
  import { createRef } from "@/lib/svelte.svelte";
  import { themeManager } from "@/theme.svelte";

  import Button from "./button.svelte";
  import CodeView from "./code.svelte";
  import { ShadowHost } from "./shadow";
  import Noop from "./shadow/root.svelte";

  setThemeContext({ components: { ...components, ...extraComponents } });

  type Picker = null | "themes" | "sandboxes" | "icons";

  interface DemoProps {
    name: DemoName;
    theme?: PlaygroundTheme;
    iconSet?: IconSet;
    disableSandboxes?: boolean;
    disableCode?: boolean;
    iconsPicker?: boolean;
    shadowStyles?: string;
    initialPicker?: Picker;
  }

  const {
    name,
    theme,
    iconSet,
    disableSandboxes,
    disableCode,
    iconsPicker,
    shadowStyles = "",
    initialPicker = null,
  }: DemoProps = $props();
  const demoId = $props.id();

  let demoState = $state({
    picker: untrack(() => initialPicker),
  });

  const selectedTheme = $derived(
    theme === undefined ? persistentThemeRef : createRef(theme)
  );
  const selectedIconSet = $derived(
    iconSet === undefined ? persistentIconsRef : createRef(iconSet)
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

  const extraUiOptions: ExtraUiOptions = fromRecord({
    skeleton4Slider: options,
    skeleton4FileUpload: options,
    skeleton4Rating: options,
    skeleton4Segment: options,
    skeleton4Switch: options,
    skeleton4Tags: options,
    skeleton4DatePicker: options,
    skeleton4DatePickerPortal: portalOptions,
    skeleton4Combobox: options,
    skeleton4ComboboxPortal: portalOptions,
  });

  const defaults = $derived({
    ...baseDefaults,
    theme: PLAYGROUND_SJSF_THEMES[selectedTheme.current],
    icons: PLAYGROUND_ICON_SETS[selectedIconSet.current],
    extraUiOptions,
    idPrefix: name,
  });

  setDemoContext({
    get defaults() {
      return defaults;
    },
  });

  const globalStyles = $derived(
    PLAYGROUND_SJSF_GLOBAL_THEME_STYLES[selectedTheme.current]
  );

  const shadowDomStyles =
    $derived(`${PLAYGROUND_SJSF_THEME_STYLES[selectedTheme.current]}
${PLAYGROUND_ICON_SET_STYLES[selectedIconSet.current]}
${shadowStyles}`);

  const {
    Component,
    files: extraFiles,
    meta,
  } = $derived((await DEMOS[name]()).default);

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
    selectedTheme.current === "svar"
      ? themeManager.isDark
        ? WillowDark
        : Willow
      : Noop
  );
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
          active={demoState.picker === "themes"}
          aria-controls={`${demoId}-themes-panel`}
          aria-expanded={demoState.picker === "themes"}
          onclick={() => {
            demoState.picker = demoState.picker === "themes" ? null : "themes";
          }}
          title="Themes"
        >
          <Palette size={16} />
          <span>{themeOrSubThemeTitle(selectedTheme.current)}</span>
        </Button>
      {/if}
      {#if iconsPicker}
        <Button
          active={demoState.picker === "icons"}
          aria-controls={`${demoId}-icons-panel`}
          aria-expanded={demoState.picker === "icons"}
          onclick={() => {
            demoState.picker = demoState.picker === "icons" ? null : "icons";
          }}
          title="Icons"
        >
          <Astroid size={16} />
          <span>{playgroundIconSetTitle(selectedIconSet.current)}</span>
        </Button>
      {/if}
      {#if !disableSandboxes}
        <Button
          active={demoState.picker === "sandboxes"}
          aria-controls={`${demoId}-sandboxes-panel`}
          aria-expanded={demoState.picker === "sandboxes"}
          aria-label="Choose sandbox platform"
          onclick={() => {
            demoState.picker =
              demoState.picker === "sandboxes" ? null : "sandboxes";
          }}
          title="Actions"
        >
          <Terminal size={16} /> <span>Actions</span>
        </Button>
      {/if}
    </div>
  </div>

  <!-- Theme pills -->
  {#if demoState.picker === "themes"}
    <div
      id={`${demoId}-themes-panel`}
      class="pills-panel"
      role="group"
      aria-label="Theme options"
    >
      {#each playgroundThemes() as t (t)}
        <Button
          variant="pill"
          active={selectedTheme.current === t}
          aria-pressed={selectedTheme.current === t}
          onclick={() => {
            selectedTheme.current = t;
          }}
        >
          {themeOrSubThemeTitle(t)}
        </Button>
      {/each}
    </div>
  {/if}

  <!-- Icon pills -->
  {#if demoState.picker === "icons"}
    <div
      id={`${demoId}-icons-panel`}
      class="pills-panel"
      role="group"
      aria-label="Icon set options"
    >
      {#each playgroundIconSets() as i (i)}
        <Button
          variant="pill"
          active={selectedIconSet.current === i}
          aria-pressed={selectedIconSet.current === i}
          onclick={() => {
            selectedIconSet.current = i;
          }}
        >
          {playgroundIconSetTitle(i)}
        </Button>
      {/each}
    </div>
  {/if}

  <!-- Sandbox pills -->
  {#if demoState.picker === "sandboxes"}
    <div
      id={`${demoId}-sandboxes-panel`}
      class="pills-panel"
      role="group"
      aria-label="Sandbox platform options"
    >
      {#each SANDBOX_PLATFORMS as platform (platform)}
        <Button
          variant="pill"
          aria-label={`Open demo in ${sandboxPlatformLabel(platform)}`}
          onclick={async () => {
            const validator = meta.validator ?? {
              name: "ajv8",
              draft2020: false,
              precompiled: false,
            };
            await openDemo({
              name: `${name} (${selectedTheme.current}, ${validator.name})`,
              themeOrSubTheme: selectedTheme.current,
              icons: selectedIconSet.current,
              validator,
              extraFiles,
              extraDependencies: [
                extraPackage("jsonSchemaToTs"),
                ...(meta.extraDependencies ?? []),
              ],
              fields: meta.fields ?? [],
              widgets: meta.widgets ?? [],
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
    {#key defaults}
      <ShadowHost style={shadowDomStyles} data-theme={themeManager.darkOrLight}>
        <SvarProvider>
          <div
            bind:this={portalEl}
            class="demo-container {themeManager.darkOrLight}"
            data-theme={selectedTheme.current.startsWith("skeleton")
              ? "cerberus"
              : themeManager.darkOrLight}
            style="padding: 2rem;"
          >
            {#if portalEl}
              <BitsConfig defaultPortalTo={portalEl}>
                <svelte:boundary>
                  <Component />
                  {#snippet failed(error)}
                    <p style="color: red; padding: 1rem;">{error}</p>
                  {/snippet}
                </svelte:boundary>
              </BitsConfig>
            {/if}
          </div>
        </SvarProvider>
      </ShadowHost>
    {/key}
  </div>
  {#if !disableCode}
    <div class="preview-code">
      <CodeView files={codeFiles} />
    </div>
  {/if}
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
    gap: 0.5rem;
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
    border-top: 1px solid var(--sl-color-gray-5);
    margin: 0;
  }
</style>
