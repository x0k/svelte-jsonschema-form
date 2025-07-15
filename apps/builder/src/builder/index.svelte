<script lang="ts" module>
  import { getContext, setContext, type Snippet } from "svelte";

  const INDEX_CONTEXT = Symbol("index-context");

  export interface IndexContext {
    current: number;
  }

  export function getIndexContext(): IndexContext {
    return getContext(INDEX_CONTEXT);
  }

  function setIndexContext(ctx: IndexContext) {
    setContext(INDEX_CONTEXT, ctx);
  }
</script>

<script lang="ts">
  const { children, index }: { index: number; children: Snippet } = $props();
  setIndexContext({
    get current() {
      return index;
    },
  });
</script>

{@render children()}
