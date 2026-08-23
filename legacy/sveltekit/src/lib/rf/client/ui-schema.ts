import {
  isUiSchemaRef,
  resolveUiOptionValue,
  resolveUiRef,
  type ResolvableUiOptions,
  type UiOptionsRegistry,
  type UiSchema,
  type UiSchemaRoot,
} from "@sjsf/form";
import type { RemoteForm } from "@sveltejs/kit";

function createObjectProxy<T extends object>(
  target: T,
  overrides: Record<string, (target: T) => unknown>
): T {
  const keys = Object.keys(overrides);
  return new Proxy(target, {
    get(t, p, r) {
      if (p in overrides) return overrides[p as string](t);
      return Reflect.get(t, p, r);
    },
    has(t, p) {
      return p in overrides || Reflect.has(t, p);
    },
    ownKeys(t) {
      const result = Reflect.ownKeys(t);
      for (const key of keys) {
        if (!result.includes(key)) result.push(key);
      }
      return result;
    },
    getOwnPropertyDescriptor(t, p) {
      if (p in overrides) {
        return {
          configurable: true,
          enumerable: true,
          get: () => overrides[p as string](t),
        };
      }
      return Reflect.getOwnPropertyDescriptor(t, p);
    },
  });
}

export function createUiSchemaWithFormAttributes(
  remoteForm: RemoteForm<any, any>,
  schema: UiSchemaRoot | undefined,
  uiOptionsRegistry: UiOptionsRegistry | undefined
): UiSchemaRoot {
  if (isUiSchemaRef(schema)) {
    schema = resolveUiRef(schema, schema);
  }
  if (schema === undefined) {
    return {
      "ui:options": {
        form: {
          get action() {
            return remoteForm.action;
          },
          get method() {
            return remoteForm.method;
          },
        },
      },
    };
  }
  return createObjectProxy(schema, {
    "ui:options": (t) => {
      const value = Reflect.get(t, "ui:options", undefined);
      const resolvedOptions = (value as UiSchema["ui:options"]) ?? {};
      return createObjectProxy(resolvedOptions, {
        form: (t) => {
          const resolvableFormOption =
            (t.form as ResolvableUiOptions["form"]) ?? {};
          const formOptionValue =
            resolveUiOptionValue(
              uiOptionsRegistry ?? {},
              resolvableFormOption
            ) ?? {};
          return createObjectProxy(formOptionValue, {
            action: () => remoteForm.action,
            method: () => remoteForm.method,
          });
        },
      });
    },
  });
}
