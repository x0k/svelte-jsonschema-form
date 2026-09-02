import {
  isSchemaValueDeepEqual,
  type EnumOption,
  type SchemaArrayValue,
  type SchemaValue,
} from "@/core/index.js";
import type { FormEnumOption } from "@/form/model.js";
import { isObject } from "@/lib/object.js";
import type { Ref } from "@/lib/svelte.svelte.js";

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

export function createMappedOption(
  builder: EnumValueMapperBuilder,
  option: EnumOption<SchemaValue>
): FormEnumOption {
  const mappedValue = builder.push(option);
  return { ...option, mappedValue };
}

export function resolveEnumValueMapperBuilder(
  factory?: () => EnumValueMapperBuilder
): EnumValueMapperBuilder {
  return factory?.() ?? new StringEnumValueMapperBuilder();
}

export function singleOption<V>({
  mapper,
  value,
  update,
}: {
  mapper: () => OptionsMapper<V>;
  value: () => SchemaValue | undefined;
  update: (value: SchemaValue | undefined) => void;
}): Ref<V> {
  const m = $derived(mapper());
  const val = $derived(m.fromValue(value()));
  return {
    get current() {
      return val;
    },
    set current(v) {
      update(m.toValue(v));
    },
  };
}

function mapAndExclude<I, O>(items: I[], transform: (item: I) => O, ignore: O) {
  const result: O[] = [];
  for (const i of items) {
    const o = transform(i);
    if (o !== ignore) {
      result.push(o);
    }
  }
  return result;
}

export function multipleOptions<V>({
  mapper,
  value,
  update,
  emptyValue = EMPTY_VALUE as V,
}: {
  mapper: () => OptionsMapper<V>;
  value: () => SchemaArrayValue | undefined;
  update: (value: SchemaArrayValue) => void;
  emptyValue?: V;
}): Ref<V[]> {
  const m = $derived(mapper());
  const val = $derived(mapAndExclude(value() ?? [], m.fromValue, emptyValue));
  return {
    get current() {
      return val;
    },
    set current(v) {
      update(mapAndExclude(v, m.toValue, undefined));
    },
  };
}
