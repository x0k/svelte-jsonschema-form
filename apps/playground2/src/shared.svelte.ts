import type { FormValidator, Schema, SchemaValue, UiSchema } from "@sjsf/form";
import { noop } from "@sjsf/form/lib/function";
import {
  abortPrevious,
  createQuery,
  createTask,
  debounce,
  type FailedTask,
} from "@sjsf/form/lib/task.svelte";
import {
  IdEnumValueMapperBuilder,
  singleOption,
} from "@sjsf/form/options.svelte";
import { createFormValidator as createNoopValidator } from "@sjsf/form/validators/noop";
import { codegemIsJsonSchemaValidator } from "meta/codegen";
import {
  convertTypedSchema,
  EXPORT_DEFAULT,
  isDraft2020,
  playgroundValidators2,
  playgroundValidator,
  playgroundValidatorTitle,
  parseSchemaObject,
  schemaTypeFromValidator,
  type PlaygroundValidator2,
  type ConvertTypedSchemaOptions,
  type ValidatorFactoryOptions,
} from "meta/playground";
import * as prettierPluginBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";
import * as prettierPluginPostcss from "prettier/plugins/postcss";
import * as p from "prettier/standalone";
import { toast } from "svelte-sonner";

export function checkSignal(s: AbortSignal) {
  if (s.aborted) {
    throw new Error(s.reason);
  }
}

export function createOnFailure(label: string) {
  return (err: FailedTask<unknown>) => {
    if (err.reason === "error") {
      console.error(label, err.error);
      toast.error(`${label}: ${err.error}`);
    } else if (err.reason === "timeout") {
      toast.error(`${label}: canceled due timeout`);
    }
  };
}

export async function convertAndFormatTypedSchema(
  signal: AbortSignal,
  options: ConvertTypedSchemaOptions
): Promise<string> {
  const schema = await convertTypedSchema(options);
  checkSignal(signal);
  return await formatJsOrJson(schema);
}

export interface ParseQueryOptions<T> {
  input: string;
  parse: (value: string) => Promise<T>;
  defaultValue: T;
}

export function createParseQuery<T>(options: ParseQueryOptions<T>) {
  let error = $state.raw(false);
  const query = createQuery<[string], T>({
    get initialValue() {
      return options.defaultValue;
    },
    deps: () => [options.input],
    execute: debounce((_, str) => options.parse(str)),
    onSuccess() {
      error = false;
    },
    onFailure(err) {
      if (err.reason === "aborted") {
        return;
      }
      error = true;
      console.error(err);
    },
  });
  return {
    get value() {
      return query.current;
    },
    get state() {
      if (query.status === "processing") return "loading";
      if (error) return "error";
      return "idle";
    },
  };
}

export interface ValidatorStateOptions {
  schema: string;
  validator: PlaygroundValidator2;
}

const DEFAULT_VALIDATOR = createNoopValidator();
const DEFAULT_SCHEMA_AND_VALIDATOR = {
  schema: {} satisfies Schema as Schema,
  validator: DEFAULT_VALIDATOR,
};

export function createValidatorState(
  data: ValidatorStateOptions,
  validatorOptions: ValidatorFactoryOptions
) {
  const schemaQuery = createParseQuery<object>({
    parse: parseSchemaObject,
    get input() {
      return data.schema;
    },
    defaultValue: {},
  });

  const deps = (): [PlaygroundValidator2, object, UiSchema | undefined] => [
    data.validator,
    schemaQuery.value,
    validatorOptions.uiSchema,
  ];
  const validatorQuery = createQuery<
    ReturnType<typeof deps>,
    { schema: Schema; validator: FormValidator<unknown> }
  >({
    initialValue: DEFAULT_SCHEMA_AND_VALIDATOR,
    get deps() {
      return schemaQuery.state === "loading" ? undefined : deps;
    },
    execute: debounce((_, validator, schema, uiSchema) => {
      const v =
        codegemIsJsonSchemaValidator(validator) &&
        validator.precompiled === false
          ? { ...validator, draft2020: isDraft2020(schema) }
          : validator;
      return playgroundValidator(v)({
        merger: validatorOptions.merger,
        schema,
        uiSchema,
      })(schema);
    }),
    onFailure: createOnFailure("Validator creation"),
  });
  const { schema, validator } = $derived(validatorQuery.current);

  const builder = new IdEnumValueMapperBuilder();
  const items: string[] = [];
  const labels: Record<string, string> = {};
  const labels2020: Record<string, string> = {};
  let i = 0;
  for (const v of playgroundValidators2()) {
    if (v.draft2020) {
      continue;
    }
    const label = playgroundValidatorTitle(v);
    const id = builder.push({
      label,
      id: String(i++),
      disabled: false,
      value: v as unknown as SchemaValue,
    });
    labels[id] = label;
    labels2020[id] =
      codegemIsJsonSchemaValidator(v) && v.precompiled === false
        ? playgroundValidatorTitle({ ...v, draft2020: true })
        : label;
    items.push(id);
  }
  const mapper = builder.build();
  const updateValidatorTask = createTask<
    [PlaygroundValidator2],
    { schema: string; validator: PlaygroundValidator2 }
  >({
    execute: debounce(async (signal, validator) => {
      const schema = await convertAndFormatTypedSchema(signal, {
        source: {
          ...schemaTypeFromValidator(data.validator),
          schema: data.schema,
        },
        target: schemaTypeFromValidator(validator),
      });
      return { validator, schema };
    }),
    onSuccess(result) {
      Object.assign(data, result);
    },
    onFailure(err, v) {
      if (err.reason === "aborted") {
        return;
      }
      console.error(err);
      data.validator = v;
      toast.error("Validator update: automatic schema conversion were failed");
    },
  });
  const mapped = singleOption({
    mapper: () => mapper,
    value: () => data.validator as unknown as SchemaValue,
    update: (v) =>
      updateValidatorTask.run(v as unknown as PlaygroundValidator2),
  });

  const effectiveLabels = $derived(
    isDraft2020(schemaQuery.value) ? labels2020 : labels
  );

  return {
    get state() {
      return schemaQuery.state;
    },
    get schema() {
      return schema;
    },
    get validator() {
      return validator;
    },
    get selected() {
      return mapped.current;
    },
    set selected(v) {
      mapped.current = v;
    },
    get labels() {
      return effectiveLabels;
    },
    items,
  };
}

export function createMergerTransition(data: {
  schema: string;
  validator: PlaygroundValidator2;
}) {
  return async (signal: AbortSignal) => {
    const schema = await convertAndFormatTypedSchema(signal, {
      source: {
        ...schemaTypeFromValidator(data.validator),
        schema: data.schema,
      },
      target: {
        type: "json",
        draft2020: false,
      },
    });
    return {
      schema,
      deduplicateJsonSchemas: true,
      intersectJson: true,
    };
  };
}

const FORMATTERS = {
  javascript: formatJsOrJson,
  css: formatCss,
};

export type Lang = keyof typeof FORMATTERS;

export function createFormatTask() {
  const task = createTask<[Lang, string], string>({
    combinator: abortPrevious,
    execute: debounce((_, lang, str) => FORMATTERS[lang](str)),
    onFailure(err) {
      if (err.reason === "aborted") {
        return;
      }
      console.error(err);
      toast.warning("Failed to format");
    },
  });
  return (lang: Lang, str: string, onFormat: (formatted: string) => void) => {
    task.runAsync(lang, str).then(onFormat, noop);
  };
}

async function formatJsOrJson(str: string): Promise<string> {
  let trimmed = str.trim();
  if (!trimmed.includes(EXPORT_DEFAULT)) {
    try {
      return JSON.stringify(JSON.parse(str), null, 2);
    } catch {
      trimmed = `${EXPORT_DEFAULT} ${str}`;
    }
  }
  return await p.format(trimmed, {
    parser: "babel",
    plugins: [prettierPluginBabel, prettierPluginEstree],
  });
}

function formatCss(str: string) {
  return p.format(str.trim(), {
    parser: "css",
    plugins: [prettierPluginPostcss],
  });
}
