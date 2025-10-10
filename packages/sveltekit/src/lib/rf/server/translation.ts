import { fromRecord, type Resolver } from '@sjsf/form/lib/resolver';
import { SJSF_ID_PREFIX, type TranslatorDefinitions } from '@sjsf/form';

export interface Labels {
  'expected-record': { input: unknown };
  'unexpected-error': {};
  'missing-or-invalid-id-prefix-key': {};
}

export type ServerTranslation = Resolver<Partial<Labels>, Partial<TranslatorDefinitions<Labels>>>;

export const enServerTranslation: ServerTranslation = fromRecord({
  'expected-record': ({ input }) =>
    `Expected record, but got (${typeof input}: ${JSON.stringify(input)})`,
  'unexpected-error': 'Unexpected error',
  'missing-or-invalid-id-prefix-key': `Missing or invalid id prefix key (${SJSF_ID_PREFIX})`
});

export const ruServerTranslation: ServerTranslation = fromRecord({
  'expected-record': ({ input }) =>
    `Ожидался объект (record), но получено (${typeof input}: ${JSON.stringify(input)})`,
  'unexpected-error': 'Неожиданная ошибка',
  'missing-or-invalid-id-prefix-key': `Отсутствует или некорректный ключ префикса идентификатора (${SJSF_ID_PREFIX})`
});
