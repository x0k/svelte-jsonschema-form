<script lang="ts">
	import { type WidgetProps } from '@sjsf/form';
	import { getLocalTimeZone, parseDate } from '@internationalized/date';

	import { cn } from '$lib/utils';

	import { getThemeContext } from '../context';

	const ctx = getThemeContext();

	const { Popover, PopoverTrigger, Button, PopoverContent, Calendar } = $derived(ctx.components);

	let { value = $bindable(), attributes }: WidgetProps<'text'> = $props();
	const date = {
		get value() {
			return value ? parseDate(value) : undefined;
		},
		set value(v) {
			if (!v) {
				value = undefined;
				return;
			}
			value = v.toDate(getLocalTimeZone()).toLocaleDateString('en-CA');
		}
	};
	const formattedValue = $derived.by(() => {
		const v = date.value;
		if (v === undefined) {
			return attributes.placeholder;
		}
		return ctx.formatDate(v.toDate(getLocalTimeZone()));
	});
</script>

<Popover>
	<PopoverTrigger>
		{#snippet child({ props })}
			<Button {...props} class={cn('w-full', date.value === undefined && 'text-muted-foreground')}>
				{formattedValue}
			</Button>
		{/snippet}
	</PopoverTrigger>
	<PopoverContent>
		<Calendar
			type="single"
			initialFocus
			bind:value={date.value}
			id={attributes.id}
			disabled={attributes.disabled}
			readonly={attributes.readonly ?? undefined}
			onchange={attributes.onchange as any}
			oninput={attributes.oninput as any}
			onblur={attributes.onblur as any}
		/>
	</PopoverContent>
</Popover>
