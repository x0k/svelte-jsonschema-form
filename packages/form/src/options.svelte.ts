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

export type EnumValueMapper = OptionsMapper<string>;

export interface EnumValueMapperBuilder {
  push(option: EnumOption<SchemaValue>): string;
  build(): EnumValueMapper;
}

export const EMPTY_VALUE = "";

// TODO: Remove in v4
/** @deprecated use `EMPTY_VALUE` instead */
export const UNDEFINED_ID = EMPTY_VALUE;

abstract class AbstractValueMapperBuilder implements EnumValueMapperBuilder {
  #strToValue = new Map<string, SchemaValue>();
  #valueToStr = new Map<SchemaValue, string>();

  protected abstract optionToStr(option: EnumOption<SchemaValue>): string;

  push(option: EnumOption<SchemaValue>): string {
    const str = this.optionToStr(option);
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
        if (str !== undefined || !isObject(value)) {
          return str ?? EMPTY_VALUE;
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

export class IdEnumValueMapperBuilder extends AbstractValueMapperBuilder {
  protected override optionToStr(option: EnumOption<SchemaValue>): string {
    return option.id;
  }
}

export class StringEnumValueMapperBuilder extends AbstractValueMapperBuilder {
  protected override optionToStr(option: EnumOption<SchemaValue>): string {
    if (isObject(option.value)) {
      throw new Error(
        `Option "${JSON.stringify(option)}" can't be used with 'StringEnumValueMapperBuilder' due non primitive value`
      );
    }
    return String(option.value);
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
