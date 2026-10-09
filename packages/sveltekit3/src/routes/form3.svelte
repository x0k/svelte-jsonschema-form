<script lang="ts">
  import { SvelteKitForm, createMeta } from "#lib/client/index.js";
  import { createFormIdBuilder } from "#lib/id-builder.js";

  import type { ActionData, PageData } from "./$types.js";
  import * as defaults from "./form-defaults.js";

  const meta = createMeta<ActionData, PageData>().form;
</script>

<SvelteKitForm
  {...defaults}
  {meta}
  idBuilder={createFormIdBuilder}
  idPrefix="form3"
  action="?/first"
  novalidate
  onInvalid={console.warn}
  onSuccess={console.log}
  onFailure={console.error}
  uiSchema={{
    nativeFile: {
      "ui:components": {
        unknownField: "unknownNativeFileField",
      },
    },
  }}
/>
