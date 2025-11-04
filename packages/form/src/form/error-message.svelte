<script lang="ts" module>
  import type { Snippet } from "svelte";

  import type { AnyComponent } from "@/lib/component.js";
  import { partialSnippet } from "@/lib/snippet.js";

  import Message from "./error-message.svelte";

  export function createMessage(message: string): AnyComponent {
    return (internal) => Message(internal, { message });
  }

  export function createMessageSnippet(message: string): Snippet {
    return partialSnippet(errorMessage, message);
  }
</script>

<script lang="ts">
  const { message }: any = $props();
</script>

{#snippet errorMessage(message: string)}
  <pre style="color: red;">{message}</pre>
{/snippet}

{@render errorMessage(message)}
