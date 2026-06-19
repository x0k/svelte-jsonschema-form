import type { SchemaValue } from "@sjsf/form";
import { noop } from "@sjsf/form/lib/function";
import {
  abortPrevious,
  createQuery,
  createTask,
  debounce,
} from "@sjsf/form/lib/task.svelte";
import { IdEnumValueMapperBuilder } from "@sjsf/form/options.svelte";
import {
  parseJsValue,
  playgroundValidators2,
  playgroundValidatorTitle,
} from "meta/playground";
import * as prettierPluginBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";
import * as p from "prettier/standalone";
import { toast } from "svelte-sonner";

export function createValidatorMapper() {
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
  return { mapper, items, labels };
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
      const value = await parseJsValue(str);
      if (options.guard(value)) {
        return value;
      }
      return Promise.reject();
    }),
    onSuccess() {
      error = false;
    },
    onFailure() {
      error = true;
    },
  });
  return {
    get value() {
      return query.result ?? options.defaultValue;
    },
    get error() {
      return error;
    },
  };
}

function isJsonValueObject(jsonStr: string) {
  return jsonStr.startsWith("{");
}

export function createFormatTask() {
  const task = createTask<[string], string>({
    combinator: abortPrevious,
    execute: debounce(async (_, str) => {
      let trimmed = str.trim();
      if (isJsonValueObject(trimmed)) {
        try {
          return JSON.stringify(JSON.parse(str), null, 2);
        } catch {
          trimmed = `export default ${str}`;
        }
      }
      return await p.format(trimmed, {
        parser: "babel",
        plugins: [prettierPluginBabel, prettierPluginEstree],
      });
    }),
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
