<script lang="ts">
  import { noop } from '@sjsf/form/lib/function';
  import { BasicForm, createForm, type Schema, type UiSchema } from '@sjsf/form';
  import { resolver } from '@sjsf/form/resolvers/compat';

  import { createFormIdBuilder } from '$lib/rf/id-builder/index.js';

  import * as defaults from '../form-defaults.js';

  import { createPost } from './data.remote.js';

  const schema: Schema = {
      type: 'array',
      items: [
        { type: 'string' },
        {
          type: 'object',
          additionalProperties: {
            type: 'string'
          }
        },
        { type: 'number' }
      ]
    };

  const uiSchema: UiSchema = {};

  const initialValue = {
    firstName: 'Chuck',
    lastName: 'Norris',
    assKickCountChanged: 'infinity',
    'new.keyChanged': 'foo'
  };

  const form = createForm({
    ...defaults,
    resolver,
    idBuilder: createFormIdBuilder,
    schema,
    uiSchema,
    // initialValue
  });
</script>

<BasicForm {...defaults} {form} onsubmit={noop} novalidate {...createPost} />
