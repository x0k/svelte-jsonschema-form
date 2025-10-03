<script lang="ts">
  import { createMeta, SvelteKitForm } from '$lib/client/index.js';

  import type { PageData, ActionData } from './$types.js';

  import * as defaults from './form-defaults.js';
  import { schema, uiSchema } from './model.js';

  const meta = createMeta<ActionData, PageData>().form3;
</script>

<SvelteKitForm {...defaults} {meta} idPrefix="form4" {schema} {uiSchema} />
