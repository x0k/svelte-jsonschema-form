import { deepEqual } from "fast-equals";

import { isObject } from '@/lib/object';
import type { EnumOption } from "@/core/enum";
import type { SchemaValue } from '@/core/schema';

export function makeOptionsMapper(options: EnumOption<SchemaValue>[]) {
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
