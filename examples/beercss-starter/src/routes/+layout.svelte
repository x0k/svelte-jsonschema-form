<script lang="ts">
  import "beercss/dist/cdn/beer.css";

  let { children } = $props();
</script>

{@render children()}

<style>
  :global(html) {
    padding: 2rem;
  }
</style>
