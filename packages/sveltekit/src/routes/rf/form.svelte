<script lang="ts">
  import { noop } from '@sjsf/form/lib/function';
  import { BasicForm, createForm, type Schema, type UiSchema } from '@sjsf/form';

  import { createFormIdBuilder } from '$lib/rf/id-builder/index.js';

  import * as defaults from '../form-defaults.js';

  import { createPost } from './data.remote.js';

  const schema: Schema = {
    title: 'A registration form',
    description: 'A simple form example.',
    type: 'object',
    required: ['firstName', 'lastName'],
    properties: {
      firstName: {
        type: 'string',
        title: 'First name',
        default: 'Chuck'
      },
      lastName: {
        type: 'string',
        title: 'Last name'
      },
      age: {
        type: 'integer',
        title: 'Age'
      },
      bio: {
        type: 'string',
        title: 'Bio'
      },
      password: {
        type: 'string',
        title: 'Password',
        minLength: 3
      },
      telephone: {
        type: 'string',
        title: 'Telephone',
        minLength: 10
      }
    }
  };

  const uiSchema: UiSchema = {
    'ui:components': {
      arrayField: 'multiEnumField'
    }
  };

  const form = createForm({
    ...defaults,
    idBuilder: createFormIdBuilder,
    schema,
    uiSchema,
    initialValue: {
      firstName: 'Chuck',
      lastName: 'Norris',
      age: 75,
      bio: 'Roundhouse kicking asses since 1940',
      password: 'noneed',
      telephone: '1-800-KICKASS'
    }
  });
</script>

<BasicForm {...defaults} {form} onsubmit={noop} {...createPost} />
