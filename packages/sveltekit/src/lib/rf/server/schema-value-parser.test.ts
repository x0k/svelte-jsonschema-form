import { createMerger } from '@sjsf/form/mergers/modern';
import { createFormValidator } from '@sjsf/ajv8-validator';

import { parseSchemaValue, type SchemaValueParserOptions } from './schema-value-parser.js';
import { createFormDataEntryConverter } from '../../server/convert-form-data-entry.js';
import { describe } from 'node:test';
import { beforeEach, expect, it } from 'vitest';

const opts = ({
  input = {},
  schema = {},
  uiSchema = {},
  validator = createFormValidator(),
  merger = createMerger(),
  convertEntry = createFormDataEntryConverter({
    merger,
    validator,
    rootSchema: schema,
    rootUiSchema: uiSchema
  })
}: Partial<
  SchemaValueParserOptions<FormDataEntryValue>
> = {}): SchemaValueParserOptions<FormDataEntryValue> => ({
  input,
  schema,
  uiSchema,
  validator,
  merger,
  convertEntry
});

describe('parseSchemaValue', async () => {
  let c: AbortController;

  beforeEach(() => {
    c = new AbortController();
  });

  it('Should parse empty form', async () => {
    await expect(parseSchemaValue(c.signal, opts())).resolves.toBeUndefined();
  });
});
