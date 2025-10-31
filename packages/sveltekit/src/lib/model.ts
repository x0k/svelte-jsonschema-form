import type { DeepPartial, MaybePromise } from '@sjsf/form/lib/types';
import type { RPath, SchemaDefinition } from '@sjsf/form/core';
import type {
  FieldValue,
  FormOptions,
  FormValue,
  Schema,
  UiSchema,
  UiSchemaRoot,
  ValidationError
} from '@sjsf/form';

import type { PickOptionalSerializable } from './internal.js';

export const JSON_CHUNKS_KEY = '__sjsf_sveltekit_json_chunks';
export const FORM_DATA_FILE_PREFIX = '__sjsf_sveltekit_file__';

export type SerializableOptionalFormOptions<T> = PickOptionalSerializable<FormOptions<T>>;

export type InitialFormData<T = unknown> = SerializableOptionalFormOptions<T> & {
  schema?: Schema;
  initialValue?: DeepPartial<T>;
  initialErrors?: ValidationError[];
  uiSchema?: UiSchemaRoot;
};

export type SendData = boolean | 'withoutClientSideUpdate';

export interface ValidFormData<T, SD extends SendData> {
  isValid: true;
  data: SD extends false ? undefined : T;
}

export interface InvalidFormData<SD extends SendData> {
  isValid: false;
  data: SD extends false ? undefined : FormValue;
}

export type ValidatedFormData<T, SD extends SendData> = {
  idPrefix: string;
  updateData: boolean;
  errors: ReadonlyArray<ValidationError>;
} & (ValidFormData<T, SD> | InvalidFormData<SD>);

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
) => MaybePromise<FieldValue>;
