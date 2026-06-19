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
  EXPORT_DEFAULT,
  parseJsValue,
  playgroundValidators2,
  playgroundValidatorTitle,
  ensureExportDefault,
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

export function createFormatTask() {
  const task = createTask<[string], string>({
    combinator: abortPrevious,
    execute: debounce(async (_, str) => {
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
