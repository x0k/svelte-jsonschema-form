import { deepEqual } from "@/lib/deep-equal.js";
import { isObject } from '@/lib/object.js';

import type { EnumOption, SchemaArrayValue, SchemaValue } from '@/core/index.js';

function makeOptionsMapper(options: EnumOption<SchemaValue>[]) {
  const map = new Map(options.map((option, index) => [option.value, index]));
  return {
    valueToIndex(value: SchemaValue | undefined) {
      if (value === undefined) {
        return -1;
      }
      const index = map.get(value);
      if (index !== undefined) {
        return index;
      }
      if (!isObject(value)) {
        return options.findIndex((option) => option.value === value);
      }
      return options.findIndex((option) => deepEqual(option.value, value));
    },
    indexToValue(index: number) {
      return options[index]?.value;
    },
  };
}

export function singleOption({
  options,
  value,
  update,
  readonly,
}: {
  options: () => EnumOption<SchemaValue>[],
  value: () => SchemaValue | undefined,
  update: (value: SchemaValue | undefined) => void,
  readonly: () => boolean
}) {
  const { indexToValue, valueToIndex } = $derived(makeOptionsMapper(options()));
  return {
    get value() {
      return valueToIndex(value());
    },
    set value(v) {
      if (readonly()) {
        return;
      }
      update(indexToValue(v));
    }
  }
}

export function multipleOptions({
  options,
  value,
  update,
  readonly,
}: {
  options: () => EnumOption<SchemaValue>[],
  value: () => SchemaArrayValue | undefined,
  update: (value: SchemaArrayValue) => void,
  readonly: () => boolean
}) {
  const { indexToValue, valueToIndex } = $derived(makeOptionsMapper(options()));
  return {
    get value() {
      return value()?.map(valueToIndex) ?? [];
    },
    set value(v) {
      if (readonly()) {
        return;
      }
      update(v.map(indexToValue));
    }
  }
}
