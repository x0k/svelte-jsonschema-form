<script lang="ts">
  import { createMeta, SvelteKitForm } from "#lib/client/index.js";
  import { createFormIdBuilder } from "#lib/id-builder.js";

  import * as defaults from "../../form-defaults.js";
  import type { ActionData, PageData } from "./$types.js";
  import { schema, uiSchema } from "./model.js";

  const meta = createMeta<ActionData, PageData>().default;
</script>

<SvelteKitForm
  {...defaults}
  {meta}
  idBuilder={createFormIdBuilder}
  {schema}
  {uiSchema}
  useJsonChunks
  enctype="multipart/form-data"
  onSubmitError={console.warn}
/>
