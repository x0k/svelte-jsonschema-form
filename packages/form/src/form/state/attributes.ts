import type {
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

import type { Config } from "../config.js";
import type { FieldPseudoElement } from "../id.js";
import type { UiOptions } from "../ui-schema.js";
import { FORM_DISABLED } from "../internals.js";

import {
  uiOptionNestedProps,
  uiOptionProps,
  type ObjectUiOptions,
} from "./ui-schema.js";
import type { FormState } from "./state.js";
import { createPseudoPath, idFromPath } from "./path.js";

interface Disabled {
  disabled: boolean;
}

interface Handlers {
  onfocus?: () => void;
  onblur?: () => void;
  oninput?: () => void;
  onchange?: () => void;
}

interface Attachable {
  // allow any attachment and falsy values (by using false we prevent the usage of booleans values by themselves)
  [key: symbol]: Attachment<any> | false | undefined | null;
}

export const HANDLERS_ATTACHMENT_CACHE = new WeakMap<
  Handlers,
  <P extends Attachable>(props: P) => P
>();

/**
 * NOTE: memoized
 */
export const handlersAttachment = weakMemoize(
  HANDLERS_ATTACHMENT_CACHE,
  (handlers) => {
    const key = createAttachmentKey();
    const attachment: Attachment<HTMLElement> = (node) => {
      const r0 = handlers.onfocus && on(node, "focus", handlers.onfocus);
      const r1 = handlers.oninput && on(node, "input", handlers.oninput);
      const r2 = handlers.onchange && on(node, "change", handlers.onchange);
      const r3 = handlers.onblur && on(node, "blur", handlers.onblur);
      return () => {
        r0?.();
        r1?.();
        r2?.();
        r3?.();
      };
    };
    return (props) => {
      (props as Attachable)[key] = attachment;
      return props;
    };
  }
);

export function composeProps<T, A>(
  ctx: FormState<T>,
  config: Config,
  props: A
): A;
export function composeProps<T, A, B>(
  ctx: FormState<T>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormState<T>) => B
): B;
export function composeProps<T, A, B, C>(
  ctx: FormState<T>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormState<T>) => B,
  bc: (props: B, config: Config, ctx: FormState<T>) => C
): C;
export function composeProps<T, A, B, C, D>(
  ctx: FormState<T>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormState<T>) => B,
  bc: (props: B, config: Config, ctx: FormState<T>) => C,
  cd: (props: C, config: Config, ctx: FormState<T>) => D
): D;
export function composeProps<T, A, B, C, D, E>(
  ctx: FormState<T>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormState<T>) => B,
  bc: (props: B, config: Config, ctx: FormState<T>) => C,
  cd: (props: C, config: Config, ctx: FormState<T>) => D,
  de: (props: D, config: Config, ctx: FormState<T>) => E
): E;
export function composeProps<T, A, B, C, D, E, F>(
  ctx: FormState<T>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormState<T>) => B,
  bc: (props: B, config: Config, ctx: FormState<T>) => C,
  cd: (props: C, config: Config, ctx: FormState<T>) => D,
  de: (props: D, config: Config, ctx: FormState<T>) => E,
  ef: (props: E, config: Config, ctx: FormState<T>) => F
): F;
export function composeProps<T, A, B, C, D, E, F, G>(
  ctx: FormState<T>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormState<T>) => B,
  bc: (props: B, config: Config, ctx: FormState<T>) => C,
  cd: (props: C, config: Config, ctx: FormState<T>) => D,
  de: (props: D, config: Config, ctx: FormState<T>) => E,
  ef: (props: E, config: Config, ctx: FormState<T>) => F,
  fg: (props: F, config: Config, ctx: FormState<T>) => G
): G;
export function composeProps<T, R>(
  ctx: FormState<T>,
  config: Config,
  props: R,
  ...options: ((props: R, config: Config, ctx: FormState<T>) => R)[]
) {
  for (let i = 0; i < options.length; i++) {
    props = options[i]!(props, config, ctx);
  }
  return props;
}

export function assignProps<O>(options: O) {
  return <T extends object>(props: T) => Object.assign(props, options);
}

export function isDisabled<T>(
  ctx: FormState<T>,
  attributes?: Partial<Nullable<Disabled>>
) {
  return attributes?.disabled || ctx[FORM_DISABLED];
}

export function disabledProp<T, FT>(
  obj: T & Partial<Nullable<Disabled>>,
  _: Config,
  ctx: FormState<FT>
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

const DEFAULT_DESCRIBE_ELEMENTS: FieldPseudoElement[] = [
  "description",
  "help",
  "errors",
];
const DEFAULT_DESCRIBE_ELEMENTS_WITH_EXAMPLES =
  DEFAULT_DESCRIBE_ELEMENTS.concat("examples");

export function describedBy<T>(ctx: FormState<T>, config: Config) {
  return (
    Array.isArray(config.schema.examples)
      ? DEFAULT_DESCRIBE_ELEMENTS_WITH_EXAMPLES
      : DEFAULT_DESCRIBE_ELEMENTS
  )
    .map((el) => idFromPath(ctx, createPseudoPath(ctx, config.path, el)))
    .join(" ");
}

export function inputProps<T extends HTMLInputAttributes, FT>(
  props: T,
  config: Config,
  ctx: FormState<FT>
) {
  const { required, schema, path } = config;
  const id = idFromPath(ctx, path);
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
    ? idFromPath(ctx, createPseudoPath(ctx, config.path, "examples"))
    : undefined;
  props.readonly = schema.readOnly;
  props["aria-describedby"] = describedBy(ctx, config);
  return props;
}

export function textareaProps<T extends HTMLTextareaAttributes, FT>(
  props: T,
  config: Config,
  ctx: FormState<FT>
) {
  const { path, required, schema } = config;
  const id = idFromPath(ctx, path);
  props.id = id;
  props.name = id;
  props.required = required;
  props.minlength = schema.minLength;
  props.maxlength = schema.maxLength;
  props.readonly = schema.readOnly;
  props["aria-describedby"] = describedBy(ctx, config);
  return props;
}

export function selectProps<T extends HTMLSelectAttributes, FT>(
  props: T,
  config: Config,
  ctx: FormState<FT>
) {
  const { path, required } = config;
  const id = idFromPath(ctx, path);
  props.id = id;
  props.name = id;
  props.required = required;
  props["aria-describedby"] = describedBy(ctx, config);
  return props;
}

type WithFor<T> = T & {
  for?: string;
};

export function forProp<T, FT>(
  props: WithFor<T>,
  config: Config,
  ctx: FormState<FT>
) {
  props.for = idFromPath(ctx, config.path);
  return props;
}

type WithId<T> = T & {
  id?: string;
};

export function idProp(element: FieldPseudoElement) {
  return <T, FT>(props: WithId<T>, config: Config, ctx: FormState<FT>) => {
    props.id = idFromPath(ctx, createPseudoPath(ctx, config.path, element));
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

export function descriptionAttributes<T, const O extends keyof ObjectUiOptions>(
  ctx: FormState<T>,
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

export function errorsListAttributes<T, const O extends keyof ObjectUiOptions>(
  ctx: FormState<T>,
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

export function formAttributes<T, const O extends keyof ObjectUiOptions>(
  ctx: FormState<T>,
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

export function helpAttributes<T, const O extends keyof ObjectUiOptions>(
  ctx: FormState<T>,
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

export function labelAttributes<T, const O extends keyof ObjectUiOptions>(
  ctx: FormState<T>,
  config: Config,
  option: O,
  props: NonNullable<UiOptions[O]>
) {
  return composeProps(ctx, config, props, forProp, uiOptionProps(option));
}

export function titleAttributes<T, const O extends keyof ObjectUiOptions>(
  ctx: FormState<T>,
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
  const O extends keyof ObjectUiOptions,
  const O2 extends keyof ObjectUiOptions,
  T extends keyof ObjectProperties<NonNullable<UiOptions[O2]>>,
>(
  ctx: FormState<FT>,
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

export function buttonAttributes<T, const O extends keyof ObjectUiOptions>(
  ctx: FormState<T>,
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

export function customInputAttributes<T, const O extends keyof ObjectUiOptions>(
  ctx: FormState<T>,
  config: Config,
  option: O,
  props: NonNullable<UiOptions[O]>
) {
  return composeProps(ctx, config, props, uiOptionProps(option), disabledProp);
}

export function inputAttributes<T, const O extends keyof ObjectUiOptions>(
  ctx: FormState<T>,
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

export function selectAttributes<T, const O extends keyof ObjectUiOptions>(
  ctx: FormState<T>,
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

export function textareaAttributes<T, const O extends keyof ObjectUiOptions>(
  ctx: FormState<T>,
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
