import type { MaybePromise } from '@sjsf/form/lib/types';
import type { RPath, SchemaDefinition, SchemaValue } from '@sjsf/form/core';
import type { UiSchema } from '@sjsf/form';

export type Entry<T> = [key: string, value: T];

export type Entries<T> = Entry<T>[];

export interface EntryConverterOptions<T> {
  schema: SchemaDefinition;
  uiSchema: UiSchema;
  path: RPath;
  value: T | undefined;
  defaultValue: SchemaValue | undefined
}

export type EntryConverter<T> = (
  signal: AbortSignal,
  options: EntryConverterOptions<T>
) => MaybePromise<SchemaValue | undefined>;
