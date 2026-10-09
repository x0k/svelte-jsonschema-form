<script lang="ts">
  import { BasicForm, createForm, validate } from "@sjsf/form";
  import { connect } from "@sjsf/sveltekit3/rf/client";

  import * as defaults from "#lib/sjsf/remote-defaults.js";
  import { page } from "$app/state";

  import { createResult, getCurrentSchema } from "../data.remote.js";

  const schema = await getCurrentSchema(page.params.id);

  const connected = await connect(createResult, {
    ...defaults,
    schema,
  });
  const form = createForm(connected);
</script>

<BasicForm
  {form}
  novalidate
  action={createResult.action}
  method={createResult.method}
  onsubmit={(e) => {
    e.preventDefault();
    void validate(form, {
      onValid: (value) => connected.submit(value, e),
    });
  }}
/>
