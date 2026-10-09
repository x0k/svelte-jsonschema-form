<script lang="ts">
  import { createMeta, SvelteKitForm } from "@sjsf/sveltekit3/client";

  import * as defaults from "#lib/sjsf/defaults.js";

  import type { ActionData, PageData } from "./$types.js";

  const meta = createMeta<ActionData, PageData>().form;
</script>

<SvelteKitForm
  {...defaults}
  {meta}
  refreshAll
  onSuccess={(result) => {
    if (result.type === "success") {
      console.log(result.data?.post);
    }
  }}
/>
