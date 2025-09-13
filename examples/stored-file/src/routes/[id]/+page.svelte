<script lang="ts">
  import Form from "../form.svelte";

  import type { PageProps } from "./$types";

  let { params }: PageProps = $props();
</script>

<Form initialValue={{ file: params.id }} />
