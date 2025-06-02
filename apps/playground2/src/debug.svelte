<script lang="ts">
  import { copyTextToClipboard } from "./copy-to-clipboard.js";

  let div: HTMLDivElement;
  let root: ShadowRoot;
  let form: HTMLFormElement;

  let disabled = $state(true);
  $effect(() => {
    const node = div.getRootNode();
    if (!(node instanceof ShadowRoot)) {
      return;
    }
    root = node;
    const node2 = root.querySelector("form");
    if (!(node2 instanceof HTMLFormElement)) {
      return;
    }
    form = node2;
    disabled = false;
  });

  async function dumpEntries() {
    const formData = new FormData(form);
    const entries = [...formData.entries()]
    await copyTextToClipboard(JSON.stringify(entries))
    console.log("copied to clipboard", entries);
  }
</script>

<div
  bind:this={div}
  style="padding: 0.3rem; display: flex; flex-direction: column; gap: 0.5rem"
>
  <p>Debug tools:</p>
  <button style="padding: 0.5rem;" onclick={dumpEntries} {disabled}>
    Dump entries
  </button>
</div>
