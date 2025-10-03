<script lang="ts">
  import { Content, setFormContext } from '@sjsf/form';

  import { createMeta, createSvelteKitForm, createSvelteKitRequest } from '$lib/client/index.js';

  import type { PageData, ActionData } from './$types.js';
  import * as defaults from './form-defaults.js';

  const meta = createMeta<ActionData, PageData>().form;
  const request = createSvelteKitRequest(meta, {
    onSuccess: console.log,
    onFailure: console.error
  });
  const form = createSvelteKitForm(meta, {
    ...defaults,
    onSubmit: request.run,
    onSubmitError: console.warn
  });
  setFormContext(form);
</script>

<form
  method="POST"
  action="?/first"
  enctype="multipart/form-data"
  novalidate
  style="display: flex; flex-direction: column; gap: 1rem"
>
  <Content />
  <button type="submit" style="padding: 0.5rem;">Submit</button>
</form>
