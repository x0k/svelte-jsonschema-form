import { form } from '$app/server';
import { createServerValidator } from '$lib/rf/server/server.js';
import { fromRecord } from '@sjsf/form/lib/resolver';
import * as defaults from '../form-defaults.js';
import { schema, uiSchema } from '../model.js';

export const createPost = form(
  createServerValidator<{ firstName: string }>({
    ...defaults,
    schema,
    uiSchema,
    serverTranslation: fromRecord({})
  }),
  (data) => {
    console.log(data);
    console.log(JSON.stringify(data));
  }
);
