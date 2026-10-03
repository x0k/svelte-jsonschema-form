<script lang="ts">
  import type { FormOptions } from "@sjsf/form";

  import { connect } from "#lib/rf/client/index.js";

  const {
    remoteForm,
    options,
    connected,
  }: {
    remoteForm: any;
    options: any;
    connected: (value: Partial<FormOptions<any>>) => void;
  } = $props();

  // The props are set once by the test and never change
  // svelte-ignore state_referenced_locally
  connected(await connect(remoteForm, options));
</script>

<form data-testid="original" enctype="multipart/form-data"></form>
