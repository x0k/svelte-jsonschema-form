<script lang="ts">
  import { SvelteSet } from "svelte/reactivity";
  import { createTask } from "@sjsf/form/lib/task.svelte";

  import Form from "./form.svelte";

  const files = new SvelteSet<string>();
  const loadFiles = createTask({
    async execute() {
      const root = await navigator.storage.getDirectory();
      const fileNames: string[] = [];
      for await (const [name, handle] of root) {
        if (handle.kind === "file") {
          fileNames.push(name);
        }
      }
      return fileNames;
    },
    onSuccess(result: string[]) {
      result.forEach(files.add, files);
    },
  });
  loadFiles.run();
</script>

<p>Open form with preselected file:</p>
<div style="display: flex; flex-direction: row; gap: 1rem;">
  {#each files as f (f)}
    <a href={f}>{f}</a>
  {/each}
</div>

<Form onFileCreation={(key) => files.add(key)} />
