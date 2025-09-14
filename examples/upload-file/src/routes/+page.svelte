<script lang="ts">
  import { onMount } from "svelte";
  import { SvelteSet } from "svelte/reactivity";

  import Form from "./form.svelte";

  const files = new SvelteSet<string>();
  onMount(async () => {
    const root = await navigator.storage.getDirectory();
    for await (const [name, handle] of root) {
      if (handle.kind === "file") {
        files.add(name);
      }
    }
  });
</script>

<p>Open form with uploaded file:</p>
<div style="display: flex; gap: 1rem; padding-bottom: 1rem;">
  {#each files as f (f)}
    <a href={f}>{f}</a>
  {:else}
    <p>Upload at least 1 file</p>
  {/each}
</div>

<Form onFileCreated={(key) => files.add(key)} />
