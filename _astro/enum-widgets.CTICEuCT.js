const n=`<script lang="ts" module>
  import type { Options, WidgetCommonProps } from "@sjsf/form/fields/widgets";

  declare module "@sjsf/form" {
    interface ComponentProps {
      myDynamicEnumWidget: WidgetCommonProps<SchemaValue> & Options;
    }
    interface ComponentBindings {
      myDynamicEnumWidget: "value";
    }
  }
<\/script>

<script lang="ts">
  import { chain, fromRecord, fromFactories } from "@sjsf/form/lib/resolver";
  import {
    createForm,
    BasicForm,
    type Schema,
    type SchemaValue,
    type Config,
    type UiSchema,
    getValueSnapshot,
  } from "@sjsf/form";
  import "@sjsf/form/fields/extra/enum-include";

  import * as defaults from "$lib/form-defaults";
  import RadioWithOther, { OTHER_VALUE } from "./radio-with-other.svelte";

  const schema = {
    type: "object",
    title: "Enums form",
    properties: {
      shortEnum: {
        enum: ["foo", "bar", "baz"],
      },
      longEnum: {
        enum: ["foo", "bar", "baz", "one", "two", "three"],
      },
      withOther: {
        type: "string",
      },
    },
  } as const satisfies Schema;

  const uiSchema: UiSchema = {
    shortEnum: {
      "ui:components": {
        stringField: "enumField",
        selectWidget: "myDynamicEnumWidget",
      },
    },
    longEnum: {
      "ui:components": {
        stringField: "enumField",
        selectWidget: "myDynamicEnumWidget",
      },
    },
    withOther: {
      "ui:components": {
        textWidget: "myRadioWithOtherWidget",
      },
      "ui:options": {
        myEnumValues: ["foo", "bar", "baz", OTHER_VALUE],
        stringEmptyValue: "",
        useLabel: false,
      },
    },
  };

  const extraUiOptions = fromFactories({
    useLabel: (config: Config) => {
      const enumValues =
        config.uiSchema["ui:components"]?.selectWidget ===
          "myDynamicEnumWidget" && config.schema.enum;
      return enumValues ? (enumValues.length > 4 ? true : false) : undefined;
    },
  });

  const withRadioWithOtherWidget = chain(
    defaults.theme,
    fromRecord({
      myRadioWithOtherWidget: RadioWithOther,
    })
  );

  const withDynamicEnumWidget = chain(
    withRadioWithOtherWidget,
    fromFactories({
      myDynamicEnumWidget: (config: Config) => {
        const enumValues = config.schema.enum;
        // NOTE The \`theme\` call is used so that the example works with all themes.
        // You can return the desired component directly.
        return withRadioWithOtherWidget(
          enumValues && enumValues.length > 4
            ? "selectWidget"
            : "myRadioWithOtherWidget",
          config
        );
      },
    })
  );

  const form = createForm({
    ...defaults,
    theme: withDynamicEnumWidget,
    schema,
    uiSchema,
    extraUiOptions,
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} />

<pre><code>{JSON.stringify(getValueSnapshot(form), null, 2)}</code></pre>
`,e=`<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";
  import type { Schema, SchemaValue } from "@sjsf/form";
  import type { WidgetCommonProps } from "@sjsf/form/fields/widgets";

  declare module "@sjsf/form" {
    interface ComponentProps {
      myRadioWithOtherWidget: WidgetCommonProps<SchemaValue>;
    }
    interface ComponentBindings {
      myRadioWithOtherWidget: "value";
    }
    interface UiOptions {
      myEnumValues?: Schema["enum"];
      myRadioWithOther?: HTMLInputAttributes;
      myRadioWithOtherText?: HTMLInputAttributes;
    }
    interface IdentifiableFieldElement {
      other: {};
    }
  }

  export const OTHER_VALUE = "other";
<\/script>

<script lang="ts">
  import {
    type ComponentProps,
    getPseudoId,
    getFormContext,
    inputAttributes,
    uiOptionProps,
    composeProps,
    handlersAttachment,
  } from "@sjsf/form";
  import { createOptions } from "@sjsf/form/fields/enum";
  import { idMapper, UNDEFINED_ID } from "@sjsf/form/options.svelte";

  let {
    value = $bindable(),
    config,
    uiOption,
    handlers,
  }: ComponentProps["myRadioWithOtherWidget"] = $props();

  const ctx = getFormContext();

  const values = $derived(uiOption("myEnumValues"));

  const attributes = $derived(
    inputAttributes(ctx, config, "myRadioWithOther", handlers, {
      type: "radio",
    })
  );

  const options = $derived(
    createOptions(ctx, config, uiOption, {
      ...config.schema,
      enum: config.schema.enum ?? values,
    }) ?? []
  );
  const mapper = $derived(idMapper(options));
  const mappedValue = $derived(mapper.fromValue(value));
  const mappedOther = $derived(mapper.fromValue(OTHER_VALUE));
  const isOther = $derived(
    typeof value === "string" &&
      (value === OTHER_VALUE || mappedValue === UNDEFINED_ID)
  );
  const mapped = {
    get current() {
      return isOther ? mappedOther : mappedValue;
    },
    set current(v) {
      value = v === mappedOther ? "" : mapper.toValue(v);
    },
  };
<\/script>

{#each options as option (option.id)}
  <label>
    <input
      bind:group={mapped.current}
      value={option.id}
      {...attributes}
      id={option.id}
      disabled={option.disabled || attributes.disabled}
    />
    {option.label}
  </label>
{/each}

{#if isOther}
  <input
    {...composeProps(
      ctx,
      config,
      { type: "text", id: getPseudoId(ctx, config.path, "other") },
      uiOptionProps("myRadioWithOtherText"),
      handlersAttachment(handlers)
    )}
    bind:value
  />
{/if}
`,t={files:{"src/routes/+page.svelte":n,"src/routes/radio-with-other.svelte":e}};export{t as layer};
