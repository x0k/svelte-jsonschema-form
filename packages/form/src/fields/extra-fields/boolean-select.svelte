<script lang="ts" module>
  import type { FieldCommonProps } from "../fields.js";

  declare module "../../form/index.js" {
    interface ComponentProps {
      booleanSelectField: FieldCommonProps<boolean>;
    }
    interface ComponentBindings {
      booleanSelectField: "value";
    }
  }
</script>

<script lang="ts">
  import {
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
    getComponent,
    type ComponentProps,
    createPseudoId,
    type Schema,
    DEFAULT_BOOLEAN_ENUM,
    translate,
  } from "@/form/index.js";

  import { createOptions } from "../enum.js";

  const ctx = getFormContext();

  let { config, value = $bindable() }: ComponentProps["booleanSelectField"] =
    $props();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const Widget = $derived(getComponent(ctx, "selectWidget", config));

  const options = $derived.by(() => {
    const yes = translate(ctx, "yes", {});
    const no = translate(ctx, "no", {});
    const computeId = (i: number) => createPseudoId(config.id, i, ctx);
    if (Array.isArray(config.schema.oneOf)) {
      return (
        createOptions(
          {
            oneOf: config.schema.oneOf.map((option): Schema => {
              if (typeof option === "boolean") {
                return option
                  ? { const: true, title: yes }
                  : { const: false, title: no };
              }
              return {
                ...option,
                title: option.title ?? (option.const === true ? yes : no),
              };
            }),
          },
          config.uiSchema,
          config.uiOptions,
          computeId
        ) ?? []
      );
    }
    const enumValues = config.schema.enum ?? DEFAULT_BOOLEAN_ENUM;
    if (
      enumValues.length === 2 &&
      enumValues.every((v) => typeof v === "boolean") &&
      config.uiOptions?.enumNames === undefined
    ) {
      return enumValues.map((v, i) => ({
        id: createPseudoId(config.id, i, ctx),
        label: v ? yes : no,
        value: v,
        disabled: false,
      }));
    }
    return (
      createOptions(
        config.schema,
        config.uiSchema,
        config.uiOptions,
        computeId
      ) ?? []
    );
  });

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );
  const errors = $derived(getErrors(ctx, config.id));
</script>

<Template showTitle {errors} {value} {config}>
  <Widget {options} bind:value {errors} {handlers} {config} />
</Template>
