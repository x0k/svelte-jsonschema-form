<script lang="ts">
  import { BasicForm } from '@sjsf/form';
  import { createFormValidator } from '@sjsf/ajv8-validator';
  import { theme } from '@sjsf/basic-theme';
  import { resolver } from '@sjsf/form/resolvers/basic';
  import { translation } from '@sjsf/form/translations/en';
  import { createFormMerger } from '@sjsf/form/mergers/modern';
  import { createFormIdBuilder } from '@sjsf/form/id-builders/legacy'

  import {
    createMeta,
    createAdditionalPropertyKeyValidator,
    setupSvelteKitForm
  } from '$lib/client/index.js';

  import type { PageData, ActionData } from './$types.js';
  import { ERROR_TYPE_OBJECTS } from './model.js';

  const meta = createMeta<ActionData, PageData>().form2;
  const { form } = setupSvelteKitForm(meta, {
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
    theme,
    resolver,
    translation,
    onSubmitError: console.warn,
    idBuilder: createFormIdBuilder,
    validator: (options) =>
      Object.assign(
        createFormValidator(options),
        createAdditionalPropertyKeyValidator({
          error({ type, values }) {
            return `The presence of these ${ERROR_TYPE_OBJECTS[type]} ("${values.join('", "')}") is prohibited`;
          }
        })
      ),
    merger: createFormMerger
  });
</script>

<BasicForm {form} method="POST" action="?/second" />
