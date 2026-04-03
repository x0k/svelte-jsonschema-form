<script lang="ts">
	type Props = {
		id: string;
		value: string;
		active: boolean;
		onSelect: (value: string) => void;
	};

	let { id, value, active, onSelect }: Props = $props();
</script>

<button
	{id}
	type="button"
	role="option"
	aria-selected={active}
	class="w-full cursor-default rounded-sm px-2 py-1.5 text-left text-sm outline-hidden transition-colors select-none hover:bg-accent aria-selected:bg-accent"
	onmousedown={(e) => {
		e.preventDefault();
		onSelect(value);
	}}
>
	{value}
</button>
