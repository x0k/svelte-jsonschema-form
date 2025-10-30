import type {
  AriaAttributes,
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
import { FORM_DISABLED, FORM_ERRORS } from "../internals.js";

import {
  uiOptionNestedProps,
  uiOptionProps,
  type ObjectUiOptions,
} from "./ui-schema.js";
import type { FormState } from "./state.js";
import { createId, createPseudoId } from "./path.js";

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

export function composeProps<I, O, A>(
  ctx: FormState<I, O>,
  config: Config,
  props: A
): A;
export function composeProps<I, O, A, B>(
  ctx: FormState<I, O>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormState<I, O>) => B
): B;
export function composeProps<I, O, A, B, C>(
  ctx: FormState<I, O>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormState<I, O>) => B,
  bc: (props: B, config: Config, ctx: FormState<I, O>) => C
): C;
export function composeProps<I, O, A, B, C, D>(
  ctx: FormState<I, O>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormState<I, O>) => B,
  bc: (props: B, config: Config, ctx: FormState<I, O>) => C,
  cd: (props: C, config: Config, ctx: FormState<I, O>) => D
): D;
export function composeProps<I, O, A, B, C, D, E>(
  ctx: FormState<I, O>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormState<I, O>) => B,
  bc: (props: B, config: Config, ctx: FormState<I, O>) => C,
  cd: (props: C, config: Config, ctx: FormState<I, O>) => D,
  de: (props: D, config: Config, ctx: FormState<I, O>) => E
): E;
export function composeProps<I, O, A, B, C, D, E, F>(
  ctx: FormState<I, O>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormState<I, O>) => B,
  bc: (props: B, config: Config, ctx: FormState<I, O>) => C,
  cd: (props: C, config: Config, ctx: FormState<I, O>) => D,
  de: (props: D, config: Config, ctx: FormState<I, O>) => E,
  ef: (props: E, config: Config, ctx: FormState<I, O>) => F
): F;
export function composeProps<I, O, A, B, C, D, E, F, G>(
  ctx: FormState<I, O>,
  config: Config,
  props: A,
  ab: (props: A, config: Config, ctx: FormState<I, O>) => B,
  bc: (props: B, config: Config, ctx: FormState<I, O>) => C,
  cd: (props: C, config: Config, ctx: FormState<I, O>) => D,
  de: (props: D, config: Config, ctx: FormState<I, O>) => E,
  ef: (props: E, config: Config, ctx: FormState<I, O>) => F,
  fg: (props: F, config: Config, ctx: FormState<I, O>) => G
): G;
export function composeProps<I, O, R>(
  ctx: FormState<I, O>,
  config: Config,
  props: R,
  ...options: ((props: R, config: Config, ctx: FormState<I, O>) => R)[]
) {
  for (let i = 0; i < options.length; i++) {
    props = options[i]!(props, config, ctx);
  }
  return props;
}

export function assignProps<O>(options: O) {
  return <T extends object>(props: T) => Object.assign(props, options);
}

/**
 * @query
 */
export function isDisabled<I, O>(
  ctx: FormState<I, O>,
  attributes?: Partial<Nullable<Disabled>>
) {
  return attributes?.disabled || ctx[FORM_DISABLED];
}

export function disabledProp<T extends Partial<Nullable<Disabled>>, I, O>(
  obj: T,
  _: Config,
  ctx: FormState<I, O>
) {
  obj.disabled ||= ctx[FORM_DISABLED];
  return obj;
}

const DEFAULT_DESCRIBE_ELEMENTS: FieldPseudoElement[] = [
  "description",
  "help",
  "errors",
];
const DEFAULT_DESCRIBE_ELEMENTS_WITH_EXAMPLES =
  DEFAULT_DESCRIBE_ELEMENTS.concat("examples");

export function ariaInvalidProp<T extends AriaAttributes, I, O>(
  obj: T,
  config: Config,
  ctx: FormState<I, O>
): T {
  obj["aria-invalid"] = ctx[FORM_ERRORS].has(config.path);
  return obj;
}

export function ariaDescribedByProp<T extends AriaAttributes, I, O>(
  obj: T,
  config: Config,
  ctx: FormState<I, O>
): T {
  obj["aria-describedby"] = (
    Array.isArray(config.schema.examples)
      ? DEFAULT_DESCRIBE_ELEMENTS_WITH_EXAMPLES
      : DEFAULT_DESCRIBE_ELEMENTS
  )
    .map((el) => createPseudoId(ctx, config.path, el))
    .join(" ");
  return obj;
}

export function ariaReadonlyProp<T extends AriaAttributes, I, O>(
  obj: T,
  config: Config,
  _: FormState<I, O>
): T & AriaAttributes {
  obj["aria-readonly"] = config.schema.readOnly;
  return obj;
}

export function ariaRequiredProp<T extends AriaAttributes, I, O>(
  obj: T,
  config: Config,
  _: FormState<I, O>
): T & AriaAttributes {
  obj["aria-required"] = config.required;
  return obj;
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

export function inputProps<T extends HTMLInputAttributes, I, O>(
  props: T,
  config: Config,
  ctx: FormState<I, O>
) {
  const { required, schema, path } = config;
  const id = createId(ctx, path);
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
    ? createPseudoId(ctx, config.path, "examples")
    : undefined;
  props.readonly = schema.readOnly;
  return props;
}

export function textareaProps<T extends HTMLTextareaAttributes, I, O>(
  props: T,
  config: Config,
  ctx: FormState<I, O>
) {
  const { path, required, schema } = config;
  const id = createId(ctx, path);
  props.id = id;
  props.name = id;
  props.required = required;
  props.minlength = schema.minLength;
  props.maxlength = schema.maxLength;
  props.readonly = schema.readOnly;
  return props;
}

export function selectProps<T extends HTMLSelectAttributes, I, O>(
  props: T,
  config: Config,
  ctx: FormState<I, O>
) {
  const { path, required } = config;
  const id = createId(ctx, path);
  props.id = id;
  props.name = id;
  props.required = required;
  return props;
}

type WithFor<T> = T & {
  for?: string;
};

export function forProp<T, I, O>(
  props: WithFor<T>,
  config: Config,
  ctx: FormState<I, O>
) {
  props.for = createId(ctx, config.path);
  return props;
}

export function idProp(element: FieldPseudoElement) {
  return <T extends { id?: string }, I, O>(
    props: T,
    config: Config,
    ctx: FormState<I, O>
  ) => {
    props.id = createPseudoId(ctx, config.path, element);
    return props;
  };
}

export function tabindexProp(tabindex: number) {
  return <T extends { tabindex?: number }>(props: T) => {
    props.tabindex = tabindex;
    return props;
  };
}

export function dataLayoutProp(type: string) {
  return <
    T extends {
      "data-layout"?: string;
    },
  >(
    props: T
  ) => {
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
  In,
  Out,
  const O extends keyof ObjectUiOptions,
>(
  ctx: FormState<In, Out>,
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
  In,
  Out,
  const O extends keyof ObjectUiOptions,
>(
  ctx: FormState<In, Out>,
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

export function formAttributes<In, Out, const O extends keyof ObjectUiOptions>(
  ctx: FormState<In, Out>,
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

export function helpAttributes<In, Out, const O extends keyof ObjectUiOptions>(
  ctx: FormState<In, Out>,
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

export function labelAttributes<In, Out, const O extends keyof ObjectUiOptions>(
  ctx: FormState<In, Out>,
  config: Config,
  option: O,
  props: NonNullable<UiOptions[O]>
) {
  return composeProps(ctx, config, props, forProp, uiOptionProps(option));
}

export function titleAttributes<In, Out, const O extends keyof ObjectUiOptions>(
  ctx: FormState<In, Out>,
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
  In,
  Out,
  const O extends keyof ObjectUiOptions,
  const O2 extends keyof ObjectUiOptions,
  T extends keyof ObjectProperties<NonNullable<UiOptions[O2]>>,
>(
  ctx: FormState<In, Out>,
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
    // @ts-expect-error Type `T` is resolved as `never` because this package
    // lacks suitable definitions for UI options,
    // but they are available in `theme` packages.
    uiOptionNestedProps(nestedOption, (t) => t[type])
  );
}

export function buttonAttributes<
  In,
  Out,
  const O extends keyof ObjectUiOptions,
>(
  ctx: FormState<In, Out>,
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
  In,
  Out,
  const O extends keyof ObjectUiOptions,
>(
  ctx: FormState<In, Out>,
  config: Config,
  option: O,
  props: NonNullable<UiOptions[O]>
) {
  return composeProps(
    ctx,
    config,
    props,
    uiOptionProps(option),
    disabledProp,
    ariaInvalidProp,
    ariaDescribedByProp,
    ariaReadonlyProp,
    ariaRequiredProp
  );
}

export function inputAttributes<In, Out, const O extends keyof ObjectUiOptions>(
  ctx: FormState<In, Out>,
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
    disabledProp,
    ariaInvalidProp,
    ariaDescribedByProp
  );
}

export function selectAttributes<
  In,
  Out,
  const O extends keyof ObjectUiOptions,
>(
  ctx: FormState<In, Out>,
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
    disabledProp,
    ariaInvalidProp,
    ariaDescribedByProp
  );
}

export function textareaAttributes<
  In,
  Out,
  const O extends keyof ObjectUiOptions,
>(
  ctx: FormState<In, Out>,
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
    disabledProp,
    ariaInvalidProp,
    ariaDescribedByProp
  );
}
