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
  convertTypedSchema,
  EXPORT_DEFAULT,
  playgroundValidators2,
  playgroundValidatorTitle,
  schemaTypeFromValidator,
  type PlaygroundValidator2,
} from "meta/playground";
import * as prettierPluginBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";
import * as p from "prettier/standalone";
import { toast } from "svelte-sonner";

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
      const schema = await convertTypedSchema({
        source: {
          ...schemaTypeFromValidator(data.validator),
          schema: data.schema,
        },
        target: schemaTypeFromValidator(validator),
      });
      return { validator, schema: await formatCode(schema) };
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
  return async () => {
    const schema = await convertTypedSchema({
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
