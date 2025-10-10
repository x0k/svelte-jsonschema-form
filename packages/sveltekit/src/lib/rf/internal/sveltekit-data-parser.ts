 
import {
  create,
  type Creatable,
  type FormMerger,
  type MergerFactoryOptions,
  type Schema,
  type SchemaValue,
  type UiOptionsRegistry,
  type UiSchemaRoot,
  type Validator,
  type ValidatorFactoryOptions
} from '@sjsf/form';

import type { EntryConverter } from '$lib/model.js';
import {
  createFormDataEntryConverter,
  type FormDataConverterOptions,
  type UnknownEntryConverter
} from '$lib/internal/convert-form-data-entry.js';

import { DEFAULT_PSEUDO_PREFIX } from '../id-builder.js';
import { parseSchemaValue, type Input } from './schema-value-parser.js';

export interface SvelteKitDataParserOptions {
  schema: Schema;
  validator: Creatable<Validator, ValidatorFactoryOptions>;
  merger: Creatable<FormMerger, MergerFactoryOptions>;
  uiSchema?: UiSchemaRoot;
  uiOptionsRegistry?: UiOptionsRegistry;
  createEntryConverter?: Creatable<EntryConverter<FormDataEntryValue>, FormDataConverterOptions>;
  convertUnknownEntry?: UnknownEntryConverter;
  pseudoPrefix?: string;
}

export function createSvelteKitDataParser({
  schema,
  uiSchema = {},
  merger: createMerger,
  validator: createValidator,
  uiOptionsRegistry = {},
  createEntryConverter = createFormDataEntryConverter,
  convertUnknownEntry,
  pseudoPrefix = DEFAULT_PSEUDO_PREFIX,
}: SvelteKitDataParserOptions) {
  const validator: Validator = create(createValidator, {
    schema: schema,
    uiSchema: uiSchema,
    uiOptionsRegistry,
    merger: () => merger
  });
  const merger = create(createMerger, {
    schema: schema,
    uiSchema: uiSchema,
    validator,
    uiOptionsRegistry
  });
  const convertEntry = create(createEntryConverter, {
    validator,
    merger,
    rootSchema: schema,
    rootUiSchema: uiSchema,
    convertUnknownEntry
  });
  return (
    signal: AbortSignal,
    idPrefix: string,
    input: Record<string, unknown>
  ): Promise<SchemaValue | undefined> =>
    parseSchemaValue(signal, {
      idPrefix,
      pseudoPrefix,
      convertEntry,
      input: input as Record<string, Input<FormDataEntryValue>>,
      merger,
      schema: schema,
      uiSchema: uiSchema,
      validator
    });
}
