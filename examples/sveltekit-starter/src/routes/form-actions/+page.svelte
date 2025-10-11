<script lang="ts">
  import { createMeta, SvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/form-defaults";

  import type { ActionData, PageData } from "./$types";

  const meta = createMeta<ActionData, PageData>().form;
</script>

<SvelteKitForm {...defaults} {meta} onSuccess={console.log} />
