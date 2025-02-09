<script lang="ts" module>
  import Message from "./error-message.svelte";

  export function createMessage(message: string): typeof Message {
    return (internal) => Message(internal, { message });
  }
</script>

<script lang="ts">
  const { message }: any = $props();
</script>

<pre style="color: red;">{message}</pre>
