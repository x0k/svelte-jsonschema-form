<script lang="ts">
	import Eye from '@lucide/svelte/icons/eye';
	import Code from '@lucide/svelte/icons/code';
	import Braces from '@lucide/svelte/icons/braces';

	import { getBuilderContext } from '../context.svelte.js';

	import { PreviewSubRouteName, RouteName } from '../model.js';

	const ctx = getBuilderContext();

	function preview(subRoute?: PreviewSubRouteName) {
		return () => {
			ctx.route = { name: RouteName.Preview, subRoute };
		};
	}

	const subRoute = $derived('subRoute' in ctx.route ? ctx.route.subRoute : undefined);
</script>

<div class="flex flex-col gap-2 text-sm text-foreground">
	<button
		class="flex cursor-pointer items-center gap-2 rounded-md border p-2 hover:bg-accent data-[active=true]:font-bold"
		onclick={preview(PreviewSubRouteName.Code)}
		data-active={subRoute === PreviewSubRouteName.Code}
	>
		<Code class="size-4" />
		Code
	</button>
	<button
		class="flex cursor-pointer items-center gap-2 rounded-md border p-2 hover:bg-accent data-[active=true]:font-bold"
		onclick={preview(PreviewSubRouteName.Schema)}
		data-active={subRoute === PreviewSubRouteName.Schema}
	>
		<Braces class="size-4" />
		Schemas
	</button>
	<button
		class="flex cursor-pointer items-center gap-2 rounded-md border p-2 hover:bg-accent data-[active=true]:font-bold"
		onclick={preview()}
		data-active={subRoute === undefined}
	>
		<Eye class="size-4" />
		Preview
	</button>
</div>
