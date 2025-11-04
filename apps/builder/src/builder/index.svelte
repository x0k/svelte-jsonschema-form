<script lang="ts" module>
  import { createContext, type Snippet } from "svelte";

  export interface IndexContext {
    current: number;
  }

  const [getIndexContext, setIndexContext] = createContext<IndexContext>();

  export { getIndexContext };
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
