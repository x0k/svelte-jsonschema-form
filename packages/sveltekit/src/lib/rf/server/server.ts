import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { RemoteFormInput } from '@sveltejs/kit';
import type { Resolver } from '@sjsf/form/lib/resolver';
import { isRecord } from '@sjsf/form/lib/object';
import {
  createTranslate,
  type FormValue,
  type Schema,
  type TranslatorDefinitions
} from '@sjsf/form';

import { decode } from '../id-builder/codec.js';

export interface Labels {
  'expected-record': {};
  'invalid-root-keys': { keys: string[] };
  'unexpected-error': {};
}

export interface SvelteKitFormValidatorOptions {
  schema: Schema;
  serverTranslation: Resolver<Partial<Labels>, Partial<TranslatorDefinitions<Labels>>>;
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

export function createServerValidator<R = FormValue>({
  schema,
  serverTranslation
}: SvelteKitFormValidatorOptions) {
  const t = createTranslate(serverTranslation);
  async function parseData(data: unknown): Promise<FormValue> {
    return {};
  }
  async function validate(input: unknown): Promise<StandardSchemaV1.Result<Output<R>>> {
    if (!isRecord(input)) {
      return failure(t('expected-record', {}));
    }
    const keys = Object.keys(input);
    if (keys.length !== 1) {
      return failure(t('invalid-root-keys', { keys }));
    }
    try {
      const value = await parseData(input[keys[0]]);
    } catch (e) {
      return failure(e instanceof PublicError ? e.message : t('unexpected-error', {}));
    }
    if (r.issues) {
      return r;
    }
    return {
      value: { idPrefix: decode(keys[0]), data: r.value as R }
    };
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
