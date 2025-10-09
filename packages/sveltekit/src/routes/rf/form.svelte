<script lang="ts">
  import { noop } from '@sjsf/form/lib/function';
  import { BasicForm, createForm, type Schema, type UiSchema } from '@sjsf/form';
  import { resolver } from '@sjsf/form/resolvers/compat';

  import { createFormIdBuilder } from '$lib/rf/id-builder/index.js';

  import * as defaults from '../form-defaults.js';

  import { createPost } from './data.remote.js';

  const schema: Schema = {
    title: 'A customizable registration form',
    description: 'A simple form with additional properties example.',
    type: 'object',
    required: ['firstName', 'lastName'],
    additionalProperties: {
      type: 'string'
    },
    properties: {
      firstName: {
        type: 'string',
        title: 'First name'
      },
      lastName: {
        type: 'string',
        title: 'Last name'
      }
    }
  };

  const uiSchema: UiSchema = {};

  const initialValue = {
    firstName: 'Chuck',
    lastName: 'Norris',
    assKickCount: 'infinity',
    'new.key': 'foo'
  };

  const form = createForm({
    ...defaults,
    resolver,
    idBuilder: createFormIdBuilder,
    schema,
    uiSchema,
    initialValue
  });
</script>

<BasicForm {...defaults} {form} onsubmit={noop} novalidate {...createPost} />
