import type {
  HTMLAttributes,
  HTMLButtonAttributes,
  HTMLFormAttributes,
  HTMLInputAttributes,
  HTMLSelectAttributes,
  HTMLTextareaAttributes,
} from "svelte/elements";
import { createAttachmentKey, type Attachment } from "svelte/attachments";
import { on } from "svelte/events";

import type { Nullable, ObjectProperties } from "@/lib/types.js";
import { weakMemoize } from "@/lib/memoize.js";
import type { Validator } from "@/core/index.js";

import type { Config } from "../config.js";
import { createPseudoId, type IdentifiableFieldElement } from "../id.js";
import type { UiOptions } from "../ui-schema.js";
import { FORM_DISABLED } from "../internals.js";

import {
  uiOptionNestedProps,
  uiOptionProps,
  type ObjectUiOptions,
} from "./ui-schema.js";
import type { FormState } from "./state.js";

interface Disabled {
  disabled: boolean;
}

interface Handlers {
  onblur?: () => void;
  oninput?: () => void;
  onchange?: () => void;
}

export const HANDLERS_ATTACHMENT_CACHE = new WeakMap<
  Handlers,
  <T extends HTMLAttributes<HTMLElement>>(props: T) => T
>();

/**
 * NOTE: memoized
 */
export const handlersAttachment = weakMemoize(
  HANDLERS_ATTACHMENT_CACHE,
  (handlers: Handlers) => {
    const key = createAttachmentKey();
    const attachment: Attachment<HTMLElement> = (node) => {
      const r1 = handlers.oninput && on(node, "input", handlers.oninput);
      const r2 = handlers.onchange && on(node, "change", handlers.onchange);
      const r3 = handlers.onblur && on(node, "blur", handlers.onblur);
      return () => {
        r1?.();
        r2?.();
        r3?.();
      };
    };
    return <T extends HTMLAttributes<HTMLElement>>(props: T): T => {
      (props as HTMLAttributes<HTMLElement>)[key] = attachment;
      return props;
    };
  }
);

export function composeProps<T, V extends Validator, A>(
  ctx: FormState<T, V>,
  config: Config,
  props: A
): A;
export function composeProps<T, V extends Validator, A, B>(
  ctx: FormState<T, V>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormState<T, V>) => B
): B;
export function composeProps<T, V extends Validator, A, B, C>(
  ctx: FormState<T, V>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormState<T, V>) => B,
  bc: (props: B, config: Config, ctx: FormState<T, V>) => C
): C;
export function composeProps<T, V extends Validator, A, B, C, D>(
  ctx: FormState<T, V>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormState<T, V>) => B,
  bc: (props: B, config: Config, ctx: FormState<T, V>) => C,
  cd: (props: C, config: Config, ctx: FormState<T, V>) => D
): D;
export function composeProps<T, V extends Validator, A, B, C, D, E>(
  ctx: FormState<T, V>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormState<T, V>) => B,
  bc: (props: B, config: Config, ctx: FormState<T, V>) => C,
  cd: (props: C, config: Config, ctx: FormState<T, V>) => D,
  de: (props: D, config: Config, ctx: FormState<T, V>) => E
): E;
export function composeProps<T, V extends Validator, A, B, C, D, E, F>(
  ctx: FormState<T, V>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormState<T, V>) => B,
  bc: (props: B, config: Config, ctx: FormState<T, V>) => C,
  cd: (props: C, config: Config, ctx: FormState<T, V>) => D,
  de: (props: D, config: Config, ctx: FormState<T, V>) => E,
  ef: (props: E, config: Config, ctx: FormState<T, V>) => F
): F;
export function composeProps<T, V extends Validator, A, B, C, D, E, F, G>(
  ctx: FormState<T, V>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormState<T, V>) => B,
  bc: (props: B, config: Config, ctx: FormState<T, V>) => C,
  cd: (props: C, config: Config, ctx: FormState<T, V>) => D,
  de: (props: D, config: Config, ctx: FormState<T, V>) => E,
  ef: (props: E, config: Config, ctx: FormState<T, V>) => F,
  fg: (props: F, config: Config, ctx: FormState<T, V>) => G
): G;
export function composeProps<T, V extends Validator, R>(
  ctx: FormState<T, V>,
  config: Config,
  props: R,
  ...options: ((props: R, config: Config, ctx: FormState<T, V>) => R)[]
) {
  for (let i = 0; i < options.length; i++) {
    props = options[i]!(props, config, ctx);
  }
  return props;
}

export function assignProps<O>(options: O) {
  return <T extends object>(props: T) => Object.assign(props, options);
}

export function isDisabled<T, V extends Validator>(
  ctx: FormState<T, V>,
  attributes?: Partial<Nullable<Disabled>>
) {
  return attributes?.disabled || ctx[FORM_DISABLED];
}

export function disabledProp<T, FT, V extends Validator>(
  obj: T & Partial<Nullable<Disabled>>,
  _: Config,
  ctx: FormState<FT, V>
) {
  obj.disabled ||= ctx[FORM_DISABLED];
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

export function describedBy<T, V extends Validator>(
  ctx: FormState<T, V>,
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

export function inputProps<
  T extends HTMLInputAttributes,
  FT,
  V extends Validator,
>(props: T, config: Config, ctx: FormState<FT, V>) {
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
  props["aria-describedby"] = describedBy(ctx, config);
  return props;
}

export function textareaProps<
  T extends HTMLTextareaAttributes,
  FT,
  V extends Validator,
>(props: T, config: Config, ctx: FormState<FT, V>) {
  const { id, required, schema } = config;
  props.id = id;
  props.name = id;
  props.required = required;
  props.minlength = schema.minLength;
  props.maxlength = schema.maxLength;
  props.readonly = schema.readOnly;
  props["aria-describedby"] = describedBy(ctx, config);
  return props;
}

export function selectProps<
  T extends HTMLSelectAttributes,
  FT,
  V extends Validator,
>(props: T, config: Config, ctx: FormState<FT, V>) {
  const { id, required } = config;
  props.id = id;
  props.name = id;
  props.required = required;
  props["aria-describedby"] = describedBy(ctx, config);
  return props;
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
  return <T, FT, V extends Validator>(
    props: WithId<T>,
    config: Config,
    ctx: FormState<FT, V>
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
  T,
  V extends Validator,
  O extends keyof ObjectUiOptions,
>(
  ctx: FormState<T, V>,
  config: Config,
  option: O,
  props: NonNullable<UiOptions[O]>
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
  T,
  V extends Validator,
  O extends keyof ObjectUiOptions,
>(
  ctx: FormState<T, V>,
  config: Config,
  option: O,
  props: NonNullable<UiOptions[O]>
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
  T,
  V extends Validator,
  O extends keyof ObjectUiOptions,
>(
  ctx: FormState<T, V>,
  config: Config,
  option: O,
  attributes: HTMLFormAttributes | undefined,
  props: NonNullable<UiOptions[O]>
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
  T,
  V extends Validator,
  O extends keyof ObjectUiOptions,
>(
  ctx: FormState<T, V>,
  config: Config,
  option: O,
  props: NonNullable<UiOptions[O]>
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
  T,
  V extends Validator,
  O extends keyof ObjectUiOptions,
>(
  ctx: FormState<T, V>,
  config: Config,
  option: O,
  props: NonNullable<UiOptions[O]>
) {
  return composeProps(ctx, config, props, forProp, uiOptionProps(option));
}

export function titleAttributes<
  T,
  V extends Validator,
  O extends keyof ObjectUiOptions,
>(
  ctx: FormState<T, V>,
  config: Config,
  option: O,
  props: NonNullable<UiOptions[O]>
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
  FT,
  V extends Validator,
  O extends keyof ObjectUiOptions,
  O2 extends keyof ObjectUiOptions,
  T extends keyof ObjectProperties<NonNullable<UiOptions[O2]>>,
>(
  ctx: FormState<FT, V>,
  config: Config,
  option: O,
  nestedOption: O2,
  type: T,
  props: NonNullable<UiOptions[O]>
) {
  return composeProps(
    ctx,
    config,
    props,
    dataLayoutProp(type as string),
    uiOptionProps(option),
    uiOptionNestedProps<O2, NonNullable<UiOptions[O2]>>(
      nestedOption,
      (t) => t[type]
    )
  );
}

export function buttonAttributes<
  T,
  V extends Validator,
  O extends keyof ObjectUiOptions,
>(
  ctx: FormState<T, V>,
  config: Config,
  option: O,
  type: Exclude<HTMLButtonAttributes["type"], undefined>,
  props: NonNullable<UiOptions[O]>
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
  T,
  V extends Validator,
  O extends keyof ObjectUiOptions,
>(
  ctx: FormState<T, V>,
  config: Config,
  option: O,
  props: NonNullable<UiOptions[O]>
) {
  return composeProps(ctx, config, props, uiOptionProps(option), disabledProp);
}

export function inputAttributes<
  T,
  V extends Validator,
  O extends keyof ObjectUiOptions,
>(
  ctx: FormState<T, V>,
  config: Config,
  option: O,
  handlers: Handlers,
  props: NonNullable<UiOptions[O]>
) {
  return composeProps(
    ctx,
    config,
    props,
    inputProps,
    handlersAttachment(handlers),
    uiOptionProps(option),
    disabledProp
  );
}

export function selectAttributes<
  T,
  V extends Validator,
  O extends keyof ObjectUiOptions,
>(
  ctx: FormState<T, V>,
  config: Config,
  option: O,
  handlers: Handlers,
  props: NonNullable<UiOptions[O]>
) {
  return composeProps(
    ctx,
    config,
    props,
    selectProps,
    handlersAttachment(handlers),
    uiOptionProps(option),
    disabledProp
  );
}

export function textareaAttributes<
  T,
  V extends Validator,
  O extends keyof ObjectUiOptions,
>(
  ctx: FormState<T, V>,
  config: Config,
  option: O,
  handlers: Handlers,
  props: NonNullable<UiOptions[O]>
) {
  return composeProps(
    ctx,
    config,
    props,
    textareaProps,
    handlersAttachment(handlers),
    uiOptionProps(option),
    disabledProp
  );
}
