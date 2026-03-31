import type { Ref } from "@/lib/svelte.svelte.js";
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

export type EnumValueMapper = OptionsMapper<string>;

export interface EnumValueMapperBuilder {
  push(option: EnumOption<SchemaValue>): string;
  build(): EnumValueMapper;
}

export const EMPTY_VALUE = "";

// TODO: Remove in v4
/** @deprecated use `EMPTY_VALUE` instead */
export const UNDEFINED_ID = EMPTY_VALUE;

export class IdEnumValueMapperBuilder implements EnumValueMapperBuilder {
  #idToValue = new Map<string, SchemaValue>();
  #valueToId = new Map<SchemaValue, string>();

  push(option: EnumOption<SchemaValue>): string {
    this.#idToValue.set(option.id, option.value);
    this.#valueToId.set(option.value, option.id);
    return option.id;
  }

  build(): EnumValueMapper {
    return {
      fromValue: (value) => {
        if (value === undefined) {
          return EMPTY_VALUE;
        }
        const id = this.#valueToId.get(value);
        if (id !== undefined) {
          return id;
        }
        return (
          this.#valueToId
            .entries()
            .find(([v]) => isSchemaValueDeepEqual(v, value))?.[1] ?? EMPTY_VALUE
        );
      },
      toValue: (value) => this.#idToValue.get(value),
    };
  }
}

export class StringEnumValueMapperBuilder implements EnumValueMapperBuilder {
  #strToValue = new Map<string, SchemaValue>();
  #valueToStr = new Map<SchemaValue, string>();

  push(option: EnumOption<SchemaValue>): string {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const str = String(option.value);
    if (this.#strToValue.has(str)) {
      throw new Error(
        `Stringified value "${str}" of "${JSON.stringify(option)}" options should be unique`
      );
    }
    this.#strToValue.set(str, option.value);
    this.#valueToStr.set(option.value, str);
    return str;
  }

  build(): EnumValueMapper {
    return {
      fromValue: (value) => {
        if (value === undefined) {
          return EMPTY_VALUE;
        }
        const str = this.#valueToStr.get(value);
        if (str !== undefined) {
          return str;
        }
        return (
          this.#valueToStr
            .entries()
            .find(([v]) => isSchemaValueDeepEqual(v, value))?.[1] ?? EMPTY_VALUE
        );
      },
      toValue: (str) => this.#strToValue.get(str),
    };
  }
}

// TODO: Remove in v4
/** @deprecated */
export function idMapper(options: EnumOption<SchemaValue>[]): EnumValueMapper {
  const builder = new IdEnumValueMapperBuilder();
  for (const o of options) {
    builder.push(o);
  }
  return builder.build();
}

// TODO: Remove in v4
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
  const m = $derived(mapper());
  const val = $derived(m.fromValue(value()));
  return {
    get value() {
      return val;
    },
    set value(v) {
      update(m.toValue(v));
    },
    get current() {
      return val;
    },
    set current(v) {
      update(m.toValue(v));
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
  const m = $derived(mapper());
  const val = $derived(value()?.map(m.fromValue) ?? []);
  return {
    get value() {
      return val;
    },
    set value(v) {
      update(v.map(m.toValue));
    },
    get current() {
      return val;
    },
    set current(v) {
      update(v.map(m.toValue));
    },
  };
}
