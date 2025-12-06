<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  // WARN: You must export this ID Builder in your `defaults` file
  import { createFormIdBuilder } from "@sjsf/sveltekit/rf";
  import { connect } from "@sjsf/sveltekit/rf/client";

  import { page } from '$app/state'

  import * as defaults from "$lib/form-defaults";

  import { createResult, getCurrentSchema } from "../data.remote";

  const schema = await getCurrentSchema(page.params.id);

  const form = createForm(
    await connect(createResult, {
      ...defaults,
      schema,
      idBuilder: createFormIdBuilder,
    })
  );
</script>

<BasicForm {form} novalidate />
