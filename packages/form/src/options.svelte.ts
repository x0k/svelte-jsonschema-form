import type { Ref } from "@/lib/svelte.svelte.js";
import { isObject } from "@/lib/object.js";

import {
  isSchemaValueDeepEqual,
  type EnumOption,
  type SchemaArrayValue,
  type SchemaValue,
} from "@/core/index.js";

export interface OptionsMapper<V> {
  fromValue: (value: SchemaValue | undefined) => V;
  toValue: (value: V) => SchemaValue | undefined;
}

export const UNDEFINED_ID = "-1";

export function idMapper(
  options: EnumOption<SchemaValue>[]
): OptionsMapper<EnumOption<SchemaValue>["id"]> {
  const idToValue = new Map<string, SchemaValue>();
  const valueToId = new Map<SchemaValue, string>();
  for (const o of options) {
    idToValue.set(o.id, o.value);
    valueToId.set(o.value, o.id);
  }
  return {
    fromValue(value: SchemaValue | undefined) {
      if (value === undefined) {
        return UNDEFINED_ID;
      }
      const id = valueToId.get(value);
      if (id !== undefined) {
        return id;
      }
      if (!isObject(value)) {
        return options.find((o) => o.value === value)?.id ?? UNDEFINED_ID;
      }
      return (
        options.find((o) => isSchemaValueDeepEqual(o.value, value))?.id ??
        UNDEFINED_ID
      );
    },
    toValue(value: string) {
      return idToValue.get(value);
    },
  };
}

interface OptionValue<V> {
  /** @deprecated use `current` instead */
  value: V;
}

export function singleOption<V>({
  mapper,
  value,
  update,
}: {
  mapper: () => OptionsMapper<V>;
  value: () => SchemaValue | undefined;
  update: (value: SchemaValue | undefined) => void;
}): OptionValue<V> & Ref<V> {
  const { fromValue, toValue } = $derived(mapper());
  const val = $derived(fromValue(value()));
  return {
    get value() {
      return val;
    },
    set value(v) {
      update(toValue(v));
    },
    get current() {
      return val;
    },
    set current(v) {
      update(toValue(v));
    },
  };
}

export function multipleOptions<V>({
  mapper,
  value,
  update,
}: {
  mapper: () => OptionsMapper<V>;
  value: () => SchemaArrayValue | undefined;
  update: (value: SchemaArrayValue) => void;
}): OptionValue<V[]> & Ref<V[]> {
  const { fromValue, toValue } = $derived(mapper());
  const val = $derived(value()?.map(fromValue) ?? []);
  return {
    get value() {
      return val;
    },
    set value(v) {
      update(v.map(toValue));
    },
    get current() {
      return val;
    },
    set current(v) {
      update(v.map(toValue));
    },
  };
}
