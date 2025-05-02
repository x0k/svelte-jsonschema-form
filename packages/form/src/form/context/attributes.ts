import type {
  HTMLButtonAttributes,
  HTMLFormAttributes,
  HTMLInputAttributes,
  HTMLSelectAttributes,
  HTMLTextareaAttributes,
} from "svelte/elements";

import type { Nullable } from "@/lib/types.js";
import type { Validator } from "@/core/index.js";

import type { Config } from "../config.js";
import { createPseudoId, type IdentifiableFieldElement } from "../id.js";
import type { UiOptions } from "../ui-schema.js";

import type { FormInternalContext } from "./context.js";
import {
  uiOptionNestedProps,
  uiOptionProps,
  type ObjectUiOptions,
} from "./ui-schema.js";

interface Disabled {
  disabled: boolean;
}

interface Handlers {
  onblur?: () => void;
  oninput?: () => void;
  onchange?: () => void;
}

export function composeProps<V extends Validator, A>(
  ctx: FormInternalContext<V>,
  config: Config,
  props: A
): A;
export function composeProps<V extends Validator, A, B>(
  ctx: FormInternalContext<V>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormInternalContext<V>) => B
): B;
export function composeProps<V extends Validator, A, B, C>(
  ctx: FormInternalContext<V>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormInternalContext<V>) => B,
  bc: (props: B, config: Config, ctx: FormInternalContext<V>) => C
): C;
export function composeProps<V extends Validator, A, B, C, D>(
  ctx: FormInternalContext<V>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormInternalContext<V>) => B,
  bc: (props: B, config: Config, ctx: FormInternalContext<V>) => C,
  cd: (props: C, config: Config, ctx: FormInternalContext<V>) => D
): D;
export function composeProps<V extends Validator, A, B, C, D, E>(
  ctx: FormInternalContext<V>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormInternalContext<V>) => B,
  bc: (props: B, config: Config, ctx: FormInternalContext<V>) => C,
  cd: (props: C, config: Config, ctx: FormInternalContext<V>) => D,
  de: (props: D, config: Config, ctx: FormInternalContext<V>) => E
): E;
export function composeProps<V extends Validator, A, B, C, D, E, F>(
  ctx: FormInternalContext<V>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormInternalContext<V>) => B,
  bc: (props: B, config: Config, ctx: FormInternalContext<V>) => C,
  cd: (props: C, config: Config, ctx: FormInternalContext<V>) => D,
  de: (props: D, config: Config, ctx: FormInternalContext<V>) => E,
  ef: (props: E, config: Config, ctx: FormInternalContext<V>) => F
): F;
export function composeProps<V extends Validator, A, B, C, D, E, F, G>(
  ctx: FormInternalContext<V>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormInternalContext<V>) => B,
  bc: (props: B, config: Config, ctx: FormInternalContext<V>) => C,
  cd: (props: C, config: Config, ctx: FormInternalContext<V>) => D,
  de: (props: D, config: Config, ctx: FormInternalContext<V>) => E,
  ef: (props: E, config: Config, ctx: FormInternalContext<V>) => F,
  fg: (props: F, config: Config, ctx: FormInternalContext<V>) => G
): G;
export function composeProps<V extends Validator, R>(
  ctx: FormInternalContext<V>,
  config: Config,
  props: R,
  ...options: ((props: R, config: Config, ctx: FormInternalContext<V>) => R)[]
) {
  for (let i = 0; i < options.length; i++) {
    props = options[i]!(props, config, ctx);
  }
  return props;
}

export function assignProps<O>(options: O) {
  return <T extends object>(props: T) => Object.assign(props, options);
}

export function isDisabled<V extends Validator>(
  ctx: FormInternalContext<V>,
  attributes?: Partial<Nullable<Disabled>>
) {
  return attributes?.disabled || ctx.disabled;
}

export function disabledProp<V extends Validator, T>(
  obj: T & Partial<Nullable<Disabled>>,
  _: Config,
  ctx: FormInternalContext<V>
) {
  obj.disabled ||= ctx.disabled;
  return obj as T & Disabled;
}

export function inputType(format: string | undefined) {
  switch (format) {
    case "date-time":
      return "datetime-local";
    case "uri":
      return "url";
    case "color":
    case "date":
    case "time":
    case "email":
      return format;
    default:
      return undefined;
  }
}

const DEFAULT_DESCRIBE_ELEMENTS: (keyof IdentifiableFieldElement)[] = [
  "description",
  "help",
  "errors",
];
const DEFAULT_DESCRIBE_ELEMENTS_WITH_EXAMPLES =
  DEFAULT_DESCRIBE_ELEMENTS.concat("examples");

export function describedBy<V extends Validator>(
  ctx: FormInternalContext<V>,
  config: Config
) {
  return (
    Array.isArray(config.schema.examples)
      ? DEFAULT_DESCRIBE_ELEMENTS_WITH_EXAMPLES
      : DEFAULT_DESCRIBE_ELEMENTS
  )
    .map((el) => createPseudoId(config.id, el, ctx))
    .join(" ");
}

export function inputProps(handlers: Handlers) {
  return <V extends Validator, T>(
    props: T & HTMLInputAttributes,
    config: Config,
    ctx: FormInternalContext<V>
  ) => {
    const { id, required, schema } = config;
    props.id = id;
    props.name = id;
    const type = inputType(schema.format);
    if (type !== undefined) {
      props.type = type;
    }
    props.required = required;
    props.minlength = schema.minLength;
    props.maxlength = schema.maxLength;
    props.pattern = schema.pattern;
    props.min = schema.minimum;
    props.max = schema.maximum;
    props.step =
      schema.multipleOf ?? (schema.type === "number" ? "any" : undefined);
    props.list = Array.isArray(schema.examples)
      ? createPseudoId(id, "examples", ctx)
      : undefined;
    props.readonly = schema.readOnly;
    props.oninput = handlers.oninput;
    props.onchange = handlers.onchange;
    props.onblur = handlers.onblur;
    props["aria-describedby"] = describedBy(ctx, config);
    return props;
  };
}

export function textareaProps(handlers: Handlers) {
  return <T, V extends Validator>(
    props: T & HTMLTextareaAttributes,
    config: Config,
    ctx: FormInternalContext<V>
  ) => {
    const { id, required, schema } = config;
    props.id = id;
    props.name = id;
    props.required = required;
    props.minlength = schema.minLength;
    props.maxlength = schema.maxLength;
    props.readonly = schema.readOnly;
    props.oninput = handlers.oninput;
    props.onchange = handlers.onchange;
    props.onblur = handlers.onblur;
    props["aria-describedby"] = describedBy(ctx, config);
    return props;
  };
}

export function selectProps(handlers: Handlers) {
  return <T, V extends Validator>(
    props: T & HTMLSelectAttributes,
    config: Config,
    ctx: FormInternalContext<V>
  ) => {
    const { id, required } = config;
    props.id = id;
    props.name = id;
    props.required = required;
    props.oninput = handlers.oninput;
    props.onchange = handlers.onchange;
    props.onblur = handlers.onblur;
    props["aria-describedby"] = describedBy(ctx, config);
    return props;
  };
}

type WithFor<T> = T & {
  for?: string;
};

export function forProp<T>(props: WithFor<T>, config: Config) {
  props.for = config.id;
  return props;
}

type WithId<T> = T & {
  id?: string;
};

export function idProp(element: keyof IdentifiableFieldElement) {
  return <V extends Validator, T>(
    props: WithId<T>,
    config: Config,
    ctx: FormInternalContext<V>
  ) => {
    props.id = createPseudoId(config.id, element, ctx);
    return props;
  };
}

type WithTabIndex<T> = T & {
  tabindex?: number;
};

export function tabindexProp(tabindex: number) {
  return <T>(props: WithTabIndex<T>) => {
    props.tabindex = tabindex;
    return props;
  };
}

type WithDataLayout<T> = T & {
  "data-layout"?: string;
};

export function dataLayoutProp(type: string) {
  return <T>(props: WithDataLayout<T>) => {
    props["data-layout"] = type;
    return props;
  };
}

export function buttonTypeProp(
  type: Exclude<HTMLButtonAttributes["type"], undefined>
) {
  return <T>(props: T & HTMLButtonAttributes) => {
    props.type = type;
    return props;
  };
}

export function descriptionAttributes<
  V extends Validator,
  O extends keyof ObjectUiOptions
>(
  ctx: FormInternalContext<V>,
  config: Config,
  option: O,
  props: Exclude<UiOptions[O], undefined>
) {
  return composeProps(
    ctx,
    config,
    props,
    idProp("description"),
    uiOptionProps(option)
  );
}

export function errorsListAttributes<
  V extends Validator,
  O extends keyof ObjectUiOptions
>(
  ctx: FormInternalContext<V>,
  config: Config,
  option: O,
  props: Exclude<UiOptions[O], undefined>
) {
  return composeProps(
    ctx,
    config,
    props,
    idProp("errors"),
    tabindexProp(-1),
    uiOptionProps(option)
  );
}

export function formAttributes<
  V extends Validator,
  O extends keyof ObjectUiOptions
>(
  ctx: FormInternalContext<V>,
  config: Config,
  option: O,
  attributes: HTMLFormAttributes | undefined,
  props: Exclude<UiOptions[O], undefined>
) {
  return composeProps(
    ctx,
    config,
    props,
    uiOptionProps(option),
    assignProps(attributes)
  );
}

export function helpAttributes<
  V extends Validator,
  O extends keyof ObjectUiOptions
>(
  ctx: FormInternalContext<V>,
  config: Config,
  option: O,
  props: Exclude<UiOptions[O], undefined>
) {
  return composeProps(
    ctx,
    config,
    props,
    idProp("help"),
    uiOptionProps(option)
  );
}

export function labelAttributes<
  V extends Validator,
  O extends keyof ObjectUiOptions
>(
  ctx: FormInternalContext<V>,
  config: Config,
  option: O,
  props: Exclude<UiOptions[O], undefined>
) {
  return composeProps(ctx, config, props, forProp, uiOptionProps(option));
}

export function titleAttributes<
  V extends Validator,
  O extends keyof ObjectUiOptions
>(
  ctx: FormInternalContext<V>,
  config: Config,
  option: O,
  props: Exclude<UiOptions[O], undefined>
) {
  return composeProps(
    ctx,
    config,
    props,
    idProp("title"),
    uiOptionProps(option)
  );
}

// WARN: basic layout depends on amount of required props
export function layoutAttributes<
  V extends Validator,
  O extends keyof ObjectUiOptions,
  O2 extends keyof ObjectUiOptions
>(
  ctx: FormInternalContext<V>,
  config: Config,
  option: O,
  nestedOption: O2,
  type: keyof Exclude<UiOptions[O2], undefined>,
  props: Exclude<UiOptions[O], undefined>
) {
  return composeProps(
    ctx,
    config,
    props,
    dataLayoutProp(type as string),
    uiOptionProps(option),
    uiOptionNestedProps(nestedOption, (t) => t[type])
  );
}

export function buttonAttributes<
  V extends Validator,
  O extends keyof ObjectUiOptions
>(
  ctx: FormInternalContext<V>,
  config: Config,
  option: O,
  type: Exclude<HTMLButtonAttributes["type"], undefined>,
  props: Exclude<UiOptions[O], undefined>
) {
  return composeProps(
    ctx,
    config,
    props,
    buttonTypeProp(type),
    uiOptionProps(option),
    disabledProp
  );
}

export function customInputAttributes<
  V extends Validator,
  O extends keyof ObjectUiOptions
>(
  ctx: FormInternalContext<V>,
  config: Config,
  option: O,
  props: Exclude<UiOptions[O], undefined>
) {
  return composeProps(ctx, config, props, uiOptionProps(option), disabledProp);
}

export function inputAttributes<
  V extends Validator,
  O extends keyof ObjectUiOptions
>(
  ctx: FormInternalContext<V>,
  config: Config,
  option: O,
  handlers: Handlers,
  props: Exclude<UiOptions[O], undefined>
) {
  return composeProps(
    ctx,
    config,
    props,
    inputProps(handlers),
    uiOptionProps(option),
    disabledProp
  );
}

export function selectAttributes<
  V extends Validator,
  O extends keyof ObjectUiOptions
>(
  ctx: FormInternalContext<V>,
  config: Config,
  option: O,
  handlers: Handlers,
  props: Exclude<UiOptions[O], undefined>
) {
  return composeProps(
    ctx,
    config,
    props,
    selectProps(handlers),
    uiOptionProps(option),
    disabledProp
  );
}

export function textareaAttributes<
  V extends Validator,
  O extends keyof ObjectUiOptions
>(
  ctx: FormInternalContext<V>,
  config: Config,
  option: O,
  handlers: Handlers,
  props: Exclude<UiOptions[O], undefined>
) {
  return composeProps(
    ctx,
    config,
    props,
    textareaProps(handlers),
    uiOptionProps(option),
    disabledProp
  );
}
