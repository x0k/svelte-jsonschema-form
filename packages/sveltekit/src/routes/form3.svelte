<script lang="ts">
  import { SvelteKitForm, createMeta } from "$lib/client/index.js";

  import type { ActionData, PageData } from "./$types.js";
  import * as defaults from "./form-defaults.js";

  const meta = createMeta<ActionData, PageData>().form;
</script>

<SvelteKitForm
  {...defaults}
  {meta}
  idPrefix="form3"
  uiSchema={{
    nativeFile: {
      "ui:components": {
        unknownField: "unknownNativeFileField",
      },
    },
  }}
/>
