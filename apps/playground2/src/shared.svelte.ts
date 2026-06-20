import type { SchemaValue } from "@sjsf/form";
import { noop } from "@sjsf/form/lib/function";
import {
  abortPrevious,
  createQuery,
  createTask,
  debounce,
} from "@sjsf/form/lib/task.svelte";
import {
  IdEnumValueMapperBuilder,
  singleOption,
} from "@sjsf/form/options.svelte";
import {
  EXPORT_DEFAULT,
  parseJsValue,
  playgroundValidators2,
  playgroundValidatorTitle,
  ensureExportDefault,
  fromJsonSchema,
  toJsonSchema,
  getValidatorFormat,
  type PlaygroundValidator2,
  type SchemaFormat,
} from "meta/playground";
import * as prettierPluginBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";
import * as p from "prettier/standalone";
import { toast } from "svelte-sonner";

async function formatCode(str: string): Promise<string> {
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

export interface ConvertSchemaOptions {
  schema: string;
  sourceFormat: SchemaFormat | "json-schema";
  targetFormat: SchemaFormat | "json-schema";
  sourceDraft2020: boolean;
  targetDraft2020: boolean;
}

export async function convertSchema({
  schema,
  sourceFormat,
  targetFormat,
  sourceDraft2020,
  targetDraft2020,
}: ConvertSchemaOptions): Promise<string> {
  if (sourceFormat === targetFormat) return schema;
  if (sourceFormat === "json-schema" && targetFormat !== "json-schema") {
    return formatCode(
      fromJsonSchema({ schema, format: targetFormat, sourceDraft2020 })
    );
  }
  if (targetFormat === "json-schema" && sourceFormat !== "json-schema") {
    const schemaObj = (await parseJsValue(
      ensureExportDefault(schema)
    )) as object;
    return toJsonSchema({
      schema: schemaObj,
      format: sourceFormat,
      targetDraft2020,
    });
  }
  const schemaObj = (await parseJsValue(ensureExportDefault(schema))) as object;
  return formatCode(
    fromJsonSchema({
      schema: toJsonSchema({
        schema: schemaObj,
        format: sourceFormat as SchemaFormat,
        targetDraft2020,
      }),
      format: targetFormat as SchemaFormat,
      sourceDraft2020,
    })
  );
}

export function createValidatorMapper(data: {
  schema: string;
  validator: PlaygroundValidator2;
}) {
  const builder = new IdEnumValueMapperBuilder();
  const items: string[] = [];
  const labels: Record<string, string> = {};
  let i = 0;
  for (const v of playgroundValidators2()) {
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
  const updateTask = createTask<
    [PlaygroundValidator2],
    { schema: string; validator: PlaygroundValidator2 }
  >({
    execute: debounce(async (_, validator) => {
      const sourceFormat = getValidatorFormat(data.validator);
      const targetFormat = getValidatorFormat(validator);
      const schema = await convertSchema({
        schema: data.schema,
        sourceFormat,
        targetFormat,
        sourceDraft2020: data.validator.draft2020,
        targetDraft2020: validator.draft2020,
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
      // assign fallback schema
    },
  });
  const mapped = singleOption({
    mapper: () => mapper,
    value: () => data.validator as unknown as SchemaValue,
    update: (v) => updateTask.run(v as unknown as PlaygroundValidator2),
  });
  return { mapped, items, labels };
}

export interface ParseQueryOptions<T> {
  input: string;
  guard: (value: unknown) => value is T;
  defaultValue: T;
}

export function createParseQuery<T>(options: ParseQueryOptions<T>) {
  let error = $state.raw(false);
  const query = createQuery<[string], T>({
    deps: () => [options.input],
    execute: debounce(async (_, str) => {
      const value = await parseJsValue(ensureExportDefault(str));
      if (!options.guard(value)) {
        throw new Error("Query guard failed");
      }
      return value;
    }),
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
  return async () => {
    const sourceFormat = getValidatorFormat(data.validator);
    const schema = await convertSchema({
      schema: data.schema,
      sourceFormat,
      targetFormat: "json-schema",
      sourceDraft2020: data.validator.draft2020,
      targetDraft2020: false,
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
