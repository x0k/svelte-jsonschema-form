<script lang="ts">
  import TopTabs from "./top-tabs.svelte";
  import SubTabs from "./sub-tabs.svelte";

  let subTabs = $state.raw(false);

  const Form = $derived(subTabs ? SubTabs : TopTabs);
</script>

<label style="display: flex; justify-items: baseline; gap: 0.2rem; padding-block: 1rem" >
  <input type="checkbox" bind:checked={subTabs} />
  Sub tabs
</label>

<Form />
