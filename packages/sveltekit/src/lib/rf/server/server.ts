/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { RemoteFormInput } from '@sveltejs/kit';
import type { Resolver } from '@sjsf/form/lib/resolver';
import { isRecord } from '@sjsf/form/lib/object';
import {
  create,
  createTranslate,
  isAsyncFormValueValidator,
  isFormValueValidator,
  SJSF_ID_PREFIX,
  type Creatable,
  type FormMerger,
  type FormValue,
  type MergerFactoryOptions,
  type Schema,
  type TranslatorDefinitions,
  type UiOptionsRegistry,
  type UiSchemaRoot,
  type Validator,
  type ValidatorFactoryOptions
} from '@sjsf/form';

import {
  createFormDataEntryConverter,
  type FormDataConverterOptions,
  type UnknownEntryConverter
} from '$lib/internal/convert-form-data-entry.js';

import { getRequestEvent } from '$app/server';
import { FORM_DATA_FILE_PREFIX, JSON_CHUNKS_KEY, type EntryConverter } from '$lib/model.js';

import { decode } from '../internal/codec.js';
import { createSvelteKitDataParser } from '../internal/sveltekit-data-parser.js';
import { DEFAULT_PSEUDO_PREFIX } from '../id-builder.js';

export interface Labels {
  'expected-record': {};
  'invalid-root-keys': { keys: string[] };
  'unexpected-error': {};
}

export interface SvelteKitFormValidatorOptions {
  serverTranslation: Resolver<Partial<Labels>, Partial<TranslatorDefinitions<Labels>>>;
  schema: Schema;
  validator: Creatable<Validator, ValidatorFactoryOptions>;
  merger: Creatable<FormMerger, MergerFactoryOptions>;
  uiSchema?: UiSchemaRoot;
  uiOptionsRegistry?: UiOptionsRegistry;
  createEntryConverter?: Creatable<EntryConverter<FormDataEntryValue>, FormDataConverterOptions>;
  convertUnknownEntry?: UnknownEntryConverter;
  pseudoPrefix?: string;
  /** By default, handles conversion of `File` */
  createReviver?: (input: Record<string, unknown>) => (key: string, value: any) => any;
}

interface Output<R> {
  data: R;
  idPrefix: string;
}

class PublicError {
  constructor(public readonly message: string) {}
}

function failure(message: string): StandardSchemaV1.FailureResult {
  return {
    issues: [
      {
        message,
        path: []
      }
    ]
  };
}

function createDefaultReviver(input: Record<string, unknown>) {
  return (_: string, value: any) => {
    if (typeof value === 'string' && value.startsWith(FORM_DATA_FILE_PREFIX)) {
      return input[decode(value)];
    }
    return value;
  };
}

export function createServerValidator<R = FormValue>({
  serverTranslation,
  schema,
  uiSchema = {},
  merger: createMerger,
  validator: createValidator,
  uiOptionsRegistry = {},
  createEntryConverter = createFormDataEntryConverter,
  convertUnknownEntry,
  pseudoPrefix = DEFAULT_PSEUDO_PREFIX,
  createReviver = createDefaultReviver
}: SvelteKitFormValidatorOptions) {
  const t = createTranslate(serverTranslation);
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
  const parseSvelteKitData = createSvelteKitDataParser({
    schema,
    uiSchema,
    merger,
    validator,
    convertUnknownEntry,
    createEntryConverter,
    pseudoPrefix,
    uiOptionsRegistry
  });
  function parseIdPrefix(input: Record<string, unknown>) {
    const idPrefix = input[SJSF_ID_PREFIX];
    if (typeof idPrefix === 'string') {
      return idPrefix;
    }
    const keys = Object.keys(input);
    if (keys.length !== 1) {
      throw new PublicError(t('invalid-root-keys', { keys }));
    }
    return decode(keys[0]);
  }
  function parseData(signal: AbortSignal, idPrefix: string, input: Record<string, unknown>) {
    const data = input[JSON_CHUNKS_KEY];
    if (Array.isArray(data) && data.every((t) => typeof t === 'string')) {
      return JSON.parse(data.join(''), createReviver(input));
    }
    return parseSvelteKitData(signal, idPrefix, input);
  }
  async function validate(input: unknown): Promise<StandardSchemaV1.Result<Output<R>>> {
    if (!isRecord(input)) {
      return failure(t('expected-record', {}));
    }
    const { request } = getRequestEvent();
    try {
      const idPrefix = parseIdPrefix(input);
      const value = await parseData(request.signal, idPrefix, input);
      const errors = isAsyncFormValueValidator(validator)
        ? await validator.validateFormValueAsync(request.signal, schema, value)
        : isFormValueValidator(validator)
          ? validator.validateFormValue(schema, value)
          : [];
      return errors.length > 0
        ? { issues: errors }
        : {
            value: {
              data: value as R,
              idPrefix
            }
          };
    } catch (e) {
      return failure(e instanceof PublicError ? e.message : t('unexpected-error', {}));
    }
  }
  return {
    validate,
    '~standard': {
      version: 1,
      vendor: 'svelte-jsonschema-form',
      validate
    }
  } satisfies StandardSchemaV1<RemoteFormInput, { data: R; idPrefix: string }> & {
    validate: typeof validate;
  };
}
