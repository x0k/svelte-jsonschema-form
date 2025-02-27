<script lang="ts" module>
  import type { AnyComponent } from '@/lib/svelte.svelte.js';

  import Message from "./error-message.svelte";

  export function createMessage(message: string): AnyComponent {
    return (internal) => Message(internal, { message });
  }
</script>

<script lang="ts">
  const { message }: any = $props();
</script>

<pre style="color: red;">{message}</pre>
