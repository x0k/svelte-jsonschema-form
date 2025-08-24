<script lang="ts">
  import { BasicForm, type Schema } from '@sjsf/form';
  import { createFormValidator } from '@sjsf/ajv8-validator';
  import { theme } from '@sjsf/basic-theme';
  import { resolver } from '@sjsf/form/resolvers/basic';
  import { translation } from '@sjsf/form/translations/en';

  import {
    createMeta,
    createAdditionalPropertyKeyValidator,
    setupSvelteKitForm
  } from '$lib/client/index.js';

  import type { PageData, ActionData } from './$types.js';
  import { ERROR_TYPE_OBJECTS } from './model.js';
  import { createFormMerger } from '@sjsf/form/mergers/modern';

  const meta = createMeta<ActionData, PageData>().form2;
  const validator = Object.assign(
    createFormValidator({ idPrefix: 'form2' }),
    createAdditionalPropertyKeyValidator({
      error({ type, values }) {
        return `The presence of these ${ERROR_TYPE_OBJECTS[type]} ("${values.join('", "')}") is prohibited`;
      }
    })
  );
  const schema: Schema = {
    title: 'Parent',
    additionalProperties: {
      title: 'Child',
      type: 'object',
      additionalProperties: {
        title: 'value',
        type: 'string'
      }
    }
  };
  const merger = createFormMerger(validator, schema);
  const { form } = setupSvelteKitForm(meta, {
    idPrefix: 'form2',
    theme,
    schema,
    merger,
    resolver,
    validator,
    translation,
    onSubmitError: console.warn
  });
</script>

<BasicForm {form} method="POST" action="?/second" />
