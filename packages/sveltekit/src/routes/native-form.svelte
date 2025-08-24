<script lang="ts">
  import { Content, setFormContext2 } from '@sjsf/form';
  import { createFormValidator } from '@sjsf/ajv8-validator';
  import { theme } from '@sjsf/basic-theme';
  import { translation } from '@sjsf/form/translations/en';
  import { resolver } from '@sjsf/form/resolvers/basic';
  import { createFormMerger } from '@sjsf/form/mergers/modern';

  import {
    createMeta,
    createSvelteKitForm,
    createSvelteKitRequest,
    createAdditionalPropertyKeyValidator
  } from '$lib/client/index.js';

  import type { PageData, ActionData } from './$types.js';
  import { ERROR_TYPE_OBJECTS } from './model.js';

  const meta = createMeta<ActionData, PageData>().form;
  const request = createSvelteKitRequest(meta, {
    onSuccess: console.log,
    onFailure: console.error
  });
  const validator = Object.assign(
    createFormValidator(),
    createAdditionalPropertyKeyValidator({
      error({ type, values }) {
        return `The presence of these ${ERROR_TYPE_OBJECTS[type]} ("${values.join('", "')}") is prohibited`;
      }
    })
  );
  const form = createSvelteKitForm(meta, {
    theme,
    validator,
    resolver,
    translation,
    onSubmit: request.run,
    onSubmitError: console.warn,
    createMerger: ({ schema }) => createFormMerger(validator, schema)
  });
  setFormContext2(form);
</script>

<form
  method="POST"
  action="?/first"
  novalidate
  style="display: flex; flex-direction: column; gap: 1rem"
>
  <Content />
  <button type="submit" style="padding: 0.5rem;">Submit</button>
</form>
