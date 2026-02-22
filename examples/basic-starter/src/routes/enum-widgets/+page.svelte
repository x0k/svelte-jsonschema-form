<script lang="ts" module>
  import type { Options, WidgetCommonProps } from "@sjsf/form/fields/widgets";

  declare module "@sjsf/form" {
    interface ComponentProps {
      myDynamicEnumWidget: WidgetCommonProps<SchemaValue> & Options;
    }
    interface ComponentBindings {
      myDynamicEnumWidget: "value";
    }
  }
</script>

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
        // NOTE The `theme` call is used so that the example works with all themes.
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
</script>

<BasicForm {form} />

<pre><code>{JSON.stringify(getValueSnapshot(form), null, 2)}</code></pre>
