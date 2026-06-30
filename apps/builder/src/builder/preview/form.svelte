<script lang="ts">
  import {
    BasicForm,
    createForm,
    getValueSnapshot,
    type FormMerger,
    type FormValidator,
    type Schema,
    type UiSchema,
  } from "@sjsf/form";
  import { fromRecord } from "@sjsf/form/lib/resolver";
  import { createQuery, debounce } from "@sjsf/form/lib/task.svelte";
  import { formatFileSize } from "@sjsf/form/validators/file-size";
  import { createFormValidator as noop } from "@sjsf/form/validators/noop";
  import { Willow, WillowDark } from "@svar-ui/svelte-core";
  import { BitsConfig } from "bits-ui";
  import type { BuilderValidator2 } from "meta/builder";
  import {
    playgroundValidator,
    PLAYGROUND_ICON_SET_STYLES,
    PLAYGROUND_ICON_SETS,
    PLAYGROUND_RESOLVERS,
    PLAYGROUND_SJSF_THEME_STYLES,
    PLAYGROUND_SJSF_THEMES,
    parseSchemaObject,
  } from "meta/playground";
  import { toast } from "svelte-sonner";

  import { ShadowHost } from "$lib/components/shadow/index.js";
  import * as defaults from "$lib/sjsf/defaults.js";

  import { themeManager } from "../../theme.svelte.js";
  import { getBuilderContext } from "../context.svelte.js";
  import { buildPlaygroundSchema } from "../model";
  import Noop from "./noop.svelte";

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
      return portalEl;
    },
  };

  const DEFAULT_SCHEMA_AND_VALIDATOR = {
    schema: {
      type: "object",
    } satisfies Schema as Schema,
    validator: noop(),
  };

  const validatorQuery = createQuery<
    [BuilderValidator2, Schema, UiSchema | undefined],
    { schema: Schema; validator: FormValidator<unknown> }
  >({
    initialValue: DEFAULT_SCHEMA_AND_VALIDATOR,
    deps: () => [ctx.validator, ctx.schema, ctx.uiSchema],
    execute: debounce(async (_, validator, schema, uiSchema) => {
      const schemaObject = await parseSchemaObject(
        buildPlaygroundSchema({ schema, validator })
      );
      const options = {
        merger: () => merger,
        schema: schemaObject,
        uiSchema,
      };
      return playgroundValidator(validator)(options)(schemaObject);
    }),
    onFailure(err) {
      if (err.reason === "aborted") {
        return;
      }
      toast.error(
        `Validator creation: ${err.reason === "timeout" ? "timeout" : String(err.error)}`
      );
    },
  });

  const { schema, validator } = $derived(validatorQuery.current);

  const merger: FormMerger = $derived(
    defaults.merger({
      schema,
      validator,
    })
  );

  const form = createForm({
    ...defaults,
    get validator() {
      return validator;
    },
    get schema() {
      return schema;
    },
    get merger() {
      return merger;
    },
    get uiSchema() {
      return ctx.uiSchema;
    },
    get theme() {
      return PLAYGROUND_SJSF_THEMES[ctx.theme];
    },
    get resolver() {
      return PLAYGROUND_RESOLVERS[ctx.resolver];
    },
    get icons() {
      return PLAYGROUND_ICON_SETS[ctx.icons];
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
      skeleton4DateRangePickerPortal: portalOptions,
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

  const SvarProvider = $derived(
    ctx.theme === "svar" ? (themeManager.isDark ? WillowDark : Willow) : Noop
  );

  const formValue = $derived(getValueSnapshot(form));
</script>

<div class="flex flex-col gap-2">
  <ShadowHost
    class="rounded-md border border-(--global-border)"
    style={`${PLAYGROUND_SJSF_THEME_STYLES[ctx.theme]}\n${PLAYGROUND_ICON_SET_STYLES[ctx.icons]}`}
  >
    <style>
      .wx-willow-theme,
      .wx-willow-dark-theme {
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
            data-theme={ctx.theme.startsWith("skeleton4")
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
