<script lang="ts">
  import { toast } from "svelte-sonner";

  import { Button } from "$lib/components/ui/button/index.js";
  import { copyTextToClipboard } from "$lib/copy-to-clipboard.js";

  async function dumpEntries() {
    const form = document
      .getElementById("shadow-host")
      ?.shadowRoot?.querySelector("form");
    if (!form) {
      toast.error("Form element not found");
      return;
    }
    try {
      const formData = new FormData(form);
      const entries = [...formData.entries()];
      await copyTextToClipboard(JSON.stringify(entries));
      toast.success("Link copied");
    } catch (err) {
      console.error(err);
      toast.error("An error has occurred");
    }
  }
</script>

<Button onclick={dumpEntries} size="sm" variant="ghost">Copy FormData</Button>
