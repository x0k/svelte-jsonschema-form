<script>
	let {
		color = 'currentColor',
		size = 28,
		strokeWidth = 2,
		isHovered = false,
		classes = ''
	} = $props();

	function handleMouseEnter() {
		isHovered = true;

		setTimeout(() => {
			isHovered = false;
		}, 200);
	}
</script>

<div class={classes} aria-label="arrow-down" role="img" onmouseenter={handleMouseEnter}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke={color}
		stroke-width={strokeWidth}
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="m5 12 7 7 7-7" class:head={isHovered} />
		<path d="M12 14v5" class:head={isHovered} />
		<path d="M12 5v9" />
	</svg>
</div>

<style>
	path {
		transition: all 0.2s ease-in;
	}

	.head {
		transform: translateY(-3px);
	}
</style>
