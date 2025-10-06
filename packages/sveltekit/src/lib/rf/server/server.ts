/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { RemoteFormInput } from '@sveltejs/kit';
import type { Resolver } from '@sjsf/form/lib/resolver';
import { isRecord } from '@sjsf/form/lib/object';
import {
  create,
  createTranslate,
  DEFAULT_ID_PREFIX,
  isAsyncFormValueValidator,
  isFormValueValidator,
  type Creatable,
  type FormIdBuilder,
  type FormMerger,
  type FormValue,
  type IdBuilderFactoryOptions,
  type MergerFactoryOptions,
  type Schema,
  type TranslatorDefinitions,
  type UiOptionsRegistry,
  type UiSchemaRoot,
  type Validator,
  type ValidatorFactoryOptions
} from '@sjsf/form';

import type {
  FormDataConverterOptions,
  UnknownEntryConverter
} from '$lib/server/convert-form-data-entry.js';
import type { EntryConverter } from '$lib/server/entry.js';

import { getRequestEvent } from '$app/server';
import { FORM_DATA_FILE_PREFIX, ID_PREFIX_KEY, JSON_CHUNKS_KEY } from '$lib/model.js';
import { decode } from '../id-builder/codec.js';

export interface Labels {
  'expected-record': {};
  'invalid-root-keys': { keys: string[] };
  'unexpected-error': {};
}

export interface SvelteKitFormValidatorOptions {
  serverTranslation: Resolver<Partial<Labels>, Partial<TranslatorDefinitions<Labels>>>;
  schema: Schema;
  idBuilder: Creatable<FormIdBuilder, IdBuilderFactoryOptions>;
  validator: Creatable<Validator, ValidatorFactoryOptions>;
  merger: Creatable<FormMerger, MergerFactoryOptions>;
  idPrefix?: string;
  uiSchema?: UiSchemaRoot;
  uiOptionsRegistry?: UiOptionsRegistry;
  createEntryConverter?: Creatable<EntryConverter<RemoteFormInput>, FormDataConverterOptions>;
  convertUnknownEntry?: UnknownEntryConverter;
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
      return input[value];
    }
    return value;
  };
}

export function createServerValidator<R = FormValue>({
  schema,
  serverTranslation,
  idBuilder: createIdBuilder,
  merger: createMerger,
  validator: createValidator,
  uiSchema = {},
  uiOptionsRegistry = {},
  idPrefix = DEFAULT_ID_PREFIX,
  createEntryConverter,
  convertUnknownEntry,
  createReviver = createDefaultReviver
}: SvelteKitFormValidatorOptions) {
  const t = createTranslate(serverTranslation);
  const idBuilder: FormIdBuilder = create(createIdBuilder, {
    idPrefix,
    schema,
    uiOptionsRegistry,
    uiSchema,
    validator: () => validator,
    merger: () => merger
  });
  const validator: Validator = create(createValidator, {
    schema,
    uiSchema,
    idBuilder,
    uiOptionsRegistry,
    merger: () => merger
  });
  const merger = create(createMerger, {
    schema,
    uiSchema,
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
  function parseIdPrefix(input: Record<string, unknown>) {
    const idPrefix = input[ID_PREFIX_KEY];
    if (typeof idPrefix === 'string') {
      return idPrefix;
    }
    const keys = Object.keys(input);
    if (keys.length !== 1) {
      throw new PublicError(t('invalid-root-keys', { keys }));
    }
    return decode(keys[0]);
  }
  async function parseSchemaValue(data: unknown): Promise<FormValue> {
    return {};
  }
  function parseData(input: Record<string, unknown>, idPrefix: string) {
    const data = input[JSON_CHUNKS_KEY];
    if (Array.isArray(data) && data.every((t) => typeof t === 'string')) {
      return JSON.parse(data.join(''), createReviver(input));
    }
    return parseSchemaValue(input[idPrefix]);
  }
  async function validate(input: unknown): Promise<StandardSchemaV1.Result<Output<R>>> {
    if (!isRecord(input)) {
      return failure(t('expected-record', {}));
    }
    const { request } = getRequestEvent();
    try {
      const idPrefix = parseIdPrefix(input);
      const value = await parseSchemaValue(input[idPrefix]);
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
