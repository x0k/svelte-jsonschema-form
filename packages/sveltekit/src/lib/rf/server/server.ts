import type { Resolver } from '@sjsf/form/lib/resolver';
import { isRecord } from '@sjsf/form/lib/object';
import {
  createTranslate,
  type FormValue,
  type Schema,
  type TranslatorDefinitions
} from '@sjsf/form';
import type { RemoteFormInput } from '@sveltejs/kit';
import type { StandardSchemaV1 } from '@standard-schema/spec';

export interface Labels {
  'expected-record': {};
  'invalid-root-keys': { keys: string[] };
}

export interface SvelteKitFormValidatorOptions {
  schema: Schema;
  serverTranslation: Resolver<Partial<Labels>, Partial<TranslatorDefinitions<Labels>>>;
}

interface Output<R> {
  data: R;
  idPrefix: string;
}

export function createServerValidator<R = FormValue>({
  schema,
  serverTranslation
}: SvelteKitFormValidatorOptions) {
  const t = createTranslate(serverTranslation);
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
  function parseData(data: unknown): Promise<StandardSchemaV1.Result<FormValue>> {
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
    const r = await parseData(input[keys[0]]);
    if (r.issues) {
      return r;
    }
    return {
      value: { idPrefix: keys[0], data: r.value as R }
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
