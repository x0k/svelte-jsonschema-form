<script lang="ts">
  import { BasicForm, type ValidatorFactoryOptions } from '@sjsf/form';

  import {
    createMeta,
    createAdditionalPropertyKeyValidator,
    setupSvelteKitForm
  } from '$lib/client/index.js';

  import type { PageData, ActionData } from './$types.js';
  import { ERROR_TYPE_OBJECTS } from './model.js';
  import * as defaults from './form-defaults.js';

  const meta = createMeta<ActionData, PageData>().form2;
  const { form } = setupSvelteKitForm(meta, {
    ...defaults,
    idPrefix: 'form2',
    schema: {
      title: 'Parent',
      additionalProperties: {
        title: 'Child',
        type: 'object',
        additionalProperties: {
          title: 'value',
          type: 'string'
        }
      }
    },
    onSubmitError: console.warn,
    validator: <I, O>(options: ValidatorFactoryOptions) =>
      Object.assign(
        defaults.validator<I, O>(options),
        createAdditionalPropertyKeyValidator({
          error({ type, values }) {
            return `The presence of these ${ERROR_TYPE_OBJECTS[type]} ("${values.join('", "')}") is prohibited`;
          }
        })
      )
  });
</script>

<BasicForm {form} method="POST" action="?/second" />
