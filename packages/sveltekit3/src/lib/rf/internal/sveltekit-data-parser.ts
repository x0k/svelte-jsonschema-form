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
  type ValidatorFactoryOptions,
  type FormValueHandler,
  type FormValueHandlerOptions,
} from "@sjsf/form";
import { createCoreContext } from "@sjsf/form/core";

import {
  createEnumItemDecoder,
  createFormDataEntryConverter,
  type FormDataConverterOptions,
  type UnknownEntryConverter,
} from "../../internal/convert-form-data-entry.js";
import type { EntryConverter, EnumItemDecoder } from "../../model.js";
import {
  createOptionIndexDecoder,
  DEFAULT_PSEUDO_PREFIX,
} from "../id-builder.js";
import { decode, encode } from "./codec.js";
import { parseSchemaValue, type Input } from "./schema-value-parser.js";

export interface SvelteKitDataParserOptions {
  schema: Schema;
  validator: Creatable<Validator, ValidatorFactoryOptions>;
  merger: Creatable<FormMerger, MergerFactoryOptions>;
  valueHandler: Creatable<FormValueHandler, FormValueHandlerOptions>;
  uiSchema?: UiSchemaRoot;
  uiOptionsRegistry?: UiOptionsRegistry;
  createEntryConverter?: Creatable<
    EntryConverter<FormDataEntryValue>,
    FormDataConverterOptions
  >;
  convertUnknownEntry?: UnknownEntryConverter;
  enumItemDecoder?: EnumItemDecoder;
  pseudoPrefix?: string;
}

export function createSvelteKitDataParser({
  schema,
  uiSchema = {},
  merger: createMerger,
  validator: createValidator,
  valueHandler: createValueHandler,
  uiOptionsRegistry = {},
  createEntryConverter = createFormDataEntryConverter,
  convertUnknownEntry,
  pseudoPrefix = DEFAULT_PSEUDO_PREFIX,
  enumItemDecoder = createEnumItemDecoder(
    createOptionIndexDecoder(encode(pseudoPrefix))
  ),
}: SvelteKitDataParserOptions) {
  const values = create(createValueHandler, {
    schema,
    uiSchema,
    uiOptionsRegistry,
  });
  const validator: Validator = create(createValidator, {
    schema: schema,
    uiSchema: uiSchema,
    uiOptionsRegistry,
    merger: () => merger,
    valueHandler: values,
  });
  const merger = create(createMerger, {
    schema: schema,
    uiSchema: uiSchema,
    validator,
    uiOptionsRegistry,
    valueHandler: values,
  });
  const ctx = createCoreContext({
    validator,
    merger,
    valueHandler: values,
    rootSchema: schema,
  });
  const convertEntry = create(createEntryConverter, {
    ctx,
    rootUiSchema: uiSchema,
    convertUnknownEntry,
    enumItemDecoder,
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
      ctx,
      uiSchema: uiSchema,
      codec: { decode, encode },
    });
}
