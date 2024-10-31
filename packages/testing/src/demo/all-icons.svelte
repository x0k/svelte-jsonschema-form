<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Icons } from '@sjsf/form';

  const { icons }: { icons: Icons } = $props();
</script>

<div
	style="height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center"
>
	<div style="display: flex; flex-direction: column; gap: 1rem">
		{#each Object.entries(icons) as [key, icon]}
			<button style="display: flex; gap: 0.5rem; align-items: center; height: 2rem">
				{@render (icon as Snippet)()}
				{key}
			</button>
		{/each}
	</div>
</div>

