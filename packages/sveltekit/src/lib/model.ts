import type { DeepPartial, MaybePromise } from '@sjsf/form/lib/types';
import type {
  FormOptions,
  Schema,
  SchemaValue,
  UiSchema,
  UiSchemaRoot,
  ValidationError
} from '@sjsf/form';
import type { RPath, SchemaDefinition } from '@sjsf/form/core';

export const JSON_CHUNKS_KEY = '__sjsf_sveltekit_json_chunks';
export const FORM_DATA_FILE_PREFIX = '__sjsf_sveltekit_file__';

type SerializablePrimitive = string | number | boolean | null | undefined | bigint;

type SerializableSpecial =
  | Date
  | RegExp
  | Map<Serializable, Serializable>
  | Set<Serializable>
  | URL
  | URLSearchParams;

type Serializable =
  | SerializablePrimitive
  | SerializableSpecial
  | Serializable[]
  | { [key: string | number]: Serializable };

type OptionalKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];

type SerializableKeys<T> = {
  [K in keyof T]: NonNullable<T[K]> extends Serializable ? K : never;
}[keyof T];

type PickOptionalSerializable<T> = Pick<T, Extract<OptionalKeys<T>, SerializableKeys<T>>>;

export type SerializableOptionalFormOptions<T> = PickOptionalSerializable<FormOptions<T>>;

export type InitialFormData<T = unknown> = SerializableOptionalFormOptions<T> & {
  schema?: Schema;
  initialValue?: DeepPartial<T>;
  initialErrors?: ValidationError[];
  uiSchema?: UiSchemaRoot;
};

export interface ValidatedFormData {
  idPrefix: string;
  isValid: boolean;
  updateData: boolean;
  data: SchemaValue | undefined;
  errors: ValidationError[];
}

export type Entry<T> = [key: string, value: T];

export type Entries<T> = Entry<T>[];

export interface EntryConverterOptions<T> {
  schema: SchemaDefinition;
  uiSchema: UiSchema;
  path: RPath;
  value: T | undefined;
}

export type EntryConverter<T> = (
  signal: AbortSignal,
  options: EntryConverterOptions<T>
) => MaybePromise<SchemaValue | undefined>;
