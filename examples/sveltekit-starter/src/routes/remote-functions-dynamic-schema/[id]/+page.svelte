<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { connect } from "@sjsf/sveltekit/rf/client";

  import * as defaults from "#lib/sjsf/remote-defaults.js";
  import { page } from "$app/state";

  import { createResult, getCurrentSchema } from "../data.remote";

  const schema = await getCurrentSchema(page.params.id);

  const form = createForm(
    await connect(createResult, {
      ...defaults,
      schema,
    })
  );
</script>

<BasicForm {form} novalidate />
