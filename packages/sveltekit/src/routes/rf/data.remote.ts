import { form } from '$app/server';
import { createServerValidator } from '$lib/rf/server/server.js';

import { schema, uiSchema } from '../model.js';
import * as defaults from '../form-defaults.js';

export const createPost = form(
  createServerValidator<{ firstName: string }>({
    ...defaults,
    schema,
    uiSchema
  }),
  (data) => {
    console.log(data);
    console.log(JSON.stringify(data));
  }
);
