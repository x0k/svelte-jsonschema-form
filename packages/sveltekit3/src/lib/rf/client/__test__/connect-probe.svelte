<script lang="ts">
  import { connect, type ConnectedForm } from "#lib/rf/client/index.js";

  const {
    remoteForm,
    options,
    connected,
  }: {
    remoteForm: any;
    options: any;
    connected: (value: Partial<ConnectedForm<any>>) => void;
  } = $props();

  // The props are set once by the test and never change
  // svelte-ignore state_referenced_locally
  connected(await connect(remoteForm, options));
</script>

<form data-testid="original" enctype="multipart/form-data"></form>
