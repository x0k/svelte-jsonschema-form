import type { MaybePromise } from '@sjsf/form/lib/types';
import type { SchemaDefinition, SchemaValue } from '@sjsf/form/core';
import type { UiSchema } from '@sjsf/form';

export type Entry<T> = [key: string, value: T];

export type Entries<T> = Entry<T>[];

export interface EntriesConverterOptions<T> {
  schema: SchemaDefinition;
  uiSchema: UiSchema;
  entries: Entries<T>;
}

export type EntriesConverter<T> = (
  signal: AbortSignal,
  options: EntriesConverterOptions<T>
) => MaybePromise<SchemaValue | undefined>;
