<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";

  import { copyTextToClipboard } from "./copy-to-clipboard.js";

  async function dumpEntries() {
    const form = document
      .getElementById("shadow-host")
      ?.shadowRoot?.querySelector("form");
    if (!form) {
      return;
    }
    const formData = new FormData(form);
    const entries = [...formData.entries()];
    await copyTextToClipboard(JSON.stringify(entries));
    console.log("copied to clipboard", entries);
  }
</script>

<Button onclick={dumpEntries} size="sm" variant="ghost">Copy Form Data</Button>
