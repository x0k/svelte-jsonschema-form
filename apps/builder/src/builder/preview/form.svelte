<script lang="ts">
  import { fromRecord } from "@sjsf/form/lib/resolver";
  import { formatFileSize } from "@sjsf/form/validators/file-size";
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { BitsConfig } from "bits-ui";
  import { Willow, WillowDark } from '@svar-ui/svelte-core';

  import { ShadowHost } from "$lib/components/shadow/index.js";
  import { THEME_STYLES, SJSF_THEMES, ActualTheme, LabTheme } from "$lib/sjsf/theme.js";
  import * as defaults from "$lib/form/defaults.js";
  import { SJSF_RESOLVERS } from "$lib/sjsf/resolver.js";
  import { ICONS_STYLES, SJSF_ICONS } from "$lib/sjsf/icons.js";
  import { SJSF_VALIDATORS } from "$lib/sjsf/validators.js";

  import { themeManager } from "../../theme.svelte.js";

  import { getBuilderContext } from "../context.svelte.js";

  import Noop from './noop.svelte';

  const ctx = getBuilderContext();

  let portalEl = $state.raw() as HTMLDivElement;
  const rootNode = $derived(portalEl?.getRootNode());

  const options = {
    getRootNode() {
      return rootNode;
    },
  };

  const portalOptions = {
    get target() {
      return portalEl
    }
  }

  const form = createForm({
    ...defaults,
    get createValidator() {
      return SJSF_VALIDATORS[ctx.validator];
    },
    get schema() {
      return ctx.schema;
    },
    get uiSchema() {
      return ctx.uiSchema;
    },
    get theme() {
      return SJSF_THEMES[ctx.theme];
    },
    get resolver() {
      return SJSF_RESOLVERS[ctx.resolver];
    },
    get icons() {
      return SJSF_ICONS[ctx.icons];
    },
    extraUiOptions: fromRecord({
      skeleton4Slider: options,
      skeleton4FileUpload: options,
      skeleton4RangeSlider: options,
      skeleton4Rating: options,
      skeleton4Segment: options,
      skeleton4Switch: options,
      skeleton4Tags: options,
      skeleton4Combobox: options,
      skeleton4ComboboxPortal: portalOptions,
      skeleton4DatePicker: options,
      skeleton4DatePickerPortal: portalOptions,
      skeleton4DateRangePicker: options,
      skeleton4DateRangePickerPortal: portalOptions
    }),
    onSubmit: console.log,
    onSubmitError: console.warn,
    onSubmissionFailure: console.error,
  });

  function withFile(_: string, value: any) {
    if (value instanceof File) {
      return `File(${value.name}, ${formatFileSize(value.size)})`;
    }
    return value;
  }

  const SvarProvider = $derived(ctx.theme === LabTheme.Svar ? themeManager.isDark ? WillowDark : Willow : Noop)

  const formValue = $derived(getValueSnapshot(form))
</script>

<div class="flex flex-col gap-2">
  <ShadowHost
    class="rounded-md border border-(--global-border)"
    style={`${THEME_STYLES[ctx.theme]}\n${ICONS_STYLES[ctx.icons]}`}
  >
    <style>
      .wx-willow-theme, .wx-willow-dark-theme {
        height: auto !important;
        min-height: 100%;
      }
    </style>
    {#if portalEl}
      <BitsConfig defaultPortalTo={portalEl}>
        <SvarProvider>
          <BasicForm
            id="form"
            {form}
            novalidate={!ctx.html5Validation}
            class={themeManager.darkOrLight}
            style="padding: 1rem; display: flex; flex-direction: column; gap: 1rem;"
            data-theme={ctx.theme.startsWith(ActualTheme.Skeleton4)
              ? "cerberus"
              : themeManager.darkOrLight}
          />
        </SvarProvider>
      </BitsConfig>
    {/if}
    <div bind:this={portalEl}></div>
  </ShadowHost>
  {#if formValue !== undefined}
    <div class="rounded-md border">
      {@html ctx.highlight("json", JSON.stringify(formValue, withFile, 2))}
    </div>
  {/if}
</div>
