<script lang="ts">
  import { noop } from '@sjsf/form/lib/function';
  import { BasicForm, createForm, type Schema, type UiSchema } from '@sjsf/form';

  import { createFormIdBuilder } from '$lib/rf/id-builder/index.js';

  import * as defaults from '../form-defaults.js';

  import { createPost } from './data.remote.js';

  const schema: Schema = {
    title: 'Locations Checkboxes',
    type: 'array',
    uniqueItems: true,
    items: {
      enum: ['foo', 'bar', 'baz']
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
    uiSchema
  });
</script>

<BasicForm {...defaults} {form} onsubmit={noop} {...createPost} />
