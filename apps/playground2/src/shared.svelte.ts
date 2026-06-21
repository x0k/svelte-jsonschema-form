import type { Schema, SchemaValue } from "@sjsf/form";
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
import { codegemIsJsonSchemaValidator } from "meta/codegen";
import {
  convertTypedSchema,
  EXPORT_DEFAULT,
  isDraft2020,
  type NormalizedFormPreset,
  playgroundValidators2,
  playgroundValidatorTitle,
  type PresetEntry,
  schemaTypeFromValidator,
  type PlaygroundValidator2,
  type ConvertTypedSchemaOptions,
} from "meta/playground";
import * as prettierPluginBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";
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

export async function formatCode(str: string): Promise<string> {
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

async function convertAndFormatTypedSchema(
  signal: AbortSignal,
  options: ConvertTypedSchemaOptions
): Promise<string> {
  const schema = await convertTypedSchema(options);
  checkSignal(signal);
  return await formatCode(schema);
}

export function validatorForSchemaDraft(
  validator: PlaygroundValidator2,
  schema: object
): PlaygroundValidator2 {
  return codegemIsJsonSchemaValidator(validator)
    ? { ...validator, draft2020: isDraft2020(schema) }
    : validator;
}

export async function loadConvertedFormPreset(
  signal: AbortSignal,
  { load, meta }: PresetEntry,
  currentValidator: PlaygroundValidator2
): Promise<NormalizedFormPreset> {
  const preset = await load();
  checkSignal(signal);

  const validator = preset.validator ?? currentValidator;
  const validatorSchemaType = schemaTypeFromValidator(validator);
  const target =
    meta.schema.type === validatorSchemaType.type
      ? meta.schema
      : validatorSchemaType;
  const schema = await convertAndFormatTypedSchema(signal, {
    source: {
      ...meta.schema,
      schema: preset.schema,
    },
    target,
  });
  return {
    ...preset,
    schema,
    validator:
      meta.schema.type === "json" && target.type === "json"
        ? ({
            ...validator,
            draft2020: meta.schema.draft2020,
          } as PlaygroundValidator2)
        : validator,
  };
}

export function createValidatorMapper(
  data: {
    schema: string;
    validator: PlaygroundValidator2;
  },
  draft2020: boolean
) {
  const builder = new IdEnumValueMapperBuilder();
  const items: string[] = [];
  const labels: Record<string, string> = {};
  let i = 0;
  for (const v of playgroundValidators2()) {
    if (codegemIsJsonSchemaValidator(v) && v.draft2020 !== draft2020) {
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
  return { mapped, items, labels };
}

export interface ParseQueryOptions<T> {
  input: string;
  parse: (value: string) => Promise<T>;
  defaultValue: T;
}

export function createParseQuery<T>(options: ParseQueryOptions<T>) {
  let error = $state.raw(false);
  const query = createQuery<[string], T>({
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
      return query.result ?? options.defaultValue;
    },
    get state() {
      if (query.status === "processing") return "loading";
      if (error) return "error";
      return "idle";
    },
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

export function createFormatTask() {
  const task = createTask<[string], string>({
    combinator: abortPrevious,
    execute: debounce((_, str) => formatCode(str)),
    onFailure(err) {
      if (err.reason === "aborted") {
        return;
      }
      console.error(err);
      toast.warning("Failed to format");
    },
  });
  return (str: string, onFormat: (formatted: string) => void) => {
    task.runAsync(str).then(onFormat, noop);
  };
}
