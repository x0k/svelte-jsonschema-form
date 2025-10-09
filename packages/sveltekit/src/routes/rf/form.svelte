<script lang="ts">
  import { noop } from '@sjsf/form/lib/function';
  import { BasicForm, createForm, type Schema, type UiSchemaRoot } from '@sjsf/form';
  import { resolver } from '@sjsf/form/resolvers/compat';

  import { createFormIdBuilder } from '$lib/rf/id-builder/index.js';

  import * as defaults from '../form-defaults.js';

  import { createPost } from './data.remote.js';

  const schema: Schema = {
      title: 'A customizable registration form',
      description: 'A simple form with pattern properties example.',
      type: 'object',
      required: ['firstName', 'lastName'],
      properties: {
        firstName: {
          type: 'string',
          title: 'First name'
        },
        lastName: {
          type: 'string',
          title: 'Last name'
        }
      },
      additionalProperties: {
        type: 'boolean'
      },
      patternProperties: {
        '^foo.*$': {
          type: 'string'
        },
        '^bar.*$': {
          type: 'number'
        }
      }
    };

  const uiSchema: UiSchemaRoot = {}

  const initialValue = {
    firstName: "Chuck",
    lastName: "Norris",
    fooPropertyExample: "foo",
    barPropertyExample: 123,
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
