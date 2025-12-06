<script lang="ts">
  import { getResults } from './data.remote';

  const results = $derived(await getResults())
</script>

<div class="center">
  <a href="./foo">Foo form</a>
  <a href="./bar">Bar form</a>
  <p>Results:</p>
  <pre><code>{JSON.stringify(results, null, 2)}</code></pre>
</div>

<style>
  .center {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
</style>
