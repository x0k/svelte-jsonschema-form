<script lang="ts">
	import { Willow } from '@svar-ui/svelte-core'

	let { children } = $props();
</script>

<Willow>
	{@render children()}
</Willow>
