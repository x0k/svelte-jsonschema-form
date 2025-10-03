<script lang="ts">
  import { SvelteKitForm, createMeta } from '$lib/client/index.js';

  import type { ActionData, PageData } from './$types.js';
  import * as defaults from './form-defaults.js';

  const meta = createMeta<ActionData, PageData>().form;
</script>

<SvelteKitForm
  {...defaults}
  {meta}
  idPrefix="form3"
  onSubmitError={console.warn}
  onSuccess={console.log}
  onFailure={console.error}
  uiSchema={{
    'ui:options': {
      form: {
        action: '?/first',
        novalidate: true
      }
    },
    nativeFile: {
      'ui:components': {
        unknownField: 'unknownNativeFileField'
      }
    }
  }}
/>
