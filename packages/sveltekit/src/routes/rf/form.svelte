<script lang="ts">
  import { noop } from '@sjsf/form/lib/function';
  import { BasicForm, createForm, type Schema, type UiSchemaRoot } from '@sjsf/form';
  import { resolver } from '@sjsf/form/resolvers/compat';

  import { createFormIdBuilder } from '$lib/rf/id-builder/index.js';

  import * as defaults from '../form-defaults.js';

  import { createPost } from './data.remote.js';

  const schema: Schema = {
    type: 'object',
    properties: {
      animal: {
        enum: ['Cat', 'Fish']
      }
    },
    allOf: [
      {
        if: {
          properties: { animal: { const: 'Cat' } }
        },
        then: {
          properties: {
            food: { type: 'string', enum: ['meat', 'grass', 'fish'] }
          },
          required: ['food']
        }
      },
      {
        if: {
          properties: { animal: { const: 'Fish' } }
        },
        then: {
          properties: {
            food: {
              type: 'string',
              enum: ['insect', 'worms']
            },
            water: {
              type: 'string',
              enum: ['lake', 'sea']
            }
          },
          required: ['food', 'water']
        }
      },
      {
        required: ['animal']
      }
    ]
  };

  const uiSchema: UiSchemaRoot = {
    'ui:definitions': {
      getRid: {
        'ui:components': {
          booleanField: 'booleanSelectField',
          selectWidget: 'radioWidget'
        }
      }
    },
    simple: {
      credit_card: {
        'ui:options': {
          help: 'If you enter anything here then billing_address will be dynamically added to the form.'
        }
      }
    },
    conditional: {
      'Do you want to get rid of any?': {
        $ref: 'getRid'
      }
    },
    arrayOfConditionals: {
      items: {
        'Do you want to get rid of any?': {
          $ref: 'getRid'
        }
      }
    },
    fixedArrayOfConditionals: {
      items: {
        'Do you want to get rid of any?': {
          $ref: 'getRid'
        }
      },
      additionalItems: {
        'Do you want to get rid of any?': {
          $ref: 'getRid'
        }
      }
    }
  };

  const initialValue = {
    simple: {
      name: 'Randy'
    },
    conditional: {
      'Do you have any pets?': 'No'
    },
    arrayOfConditionals: [
      {
        'Do you have any pets?': 'Yes: One',
        'How old is your pet?': 6
      },
      {
        'Do you have any pets?': 'Yes: More than one',
        'Do you want to get rid of any?': false
      }
    ],
    fixedArrayOfConditionals: [
      {
        'Do you have any pets?': 'No'
      },
      {
        'Do you have any pets?': 'Yes: One',
        'How old is your pet?': 6
      },
      {
        'Do you have any pets?': 'Yes: More than one',
        'Do you want to get rid of any?': true
      }
    ]
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
