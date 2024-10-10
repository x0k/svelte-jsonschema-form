<script lang="ts">
	let theme = $state<'system' | 'light' | 'dark'>(
		typeof localStorage !== 'undefined' ? (localStorage.theme ?? 'system') : 'system'
	);

	function updateTheme() {
    if (typeof document === "undefined") {
      return
    }
		if (
			typeof localStorage !== 'undefined' &&
			(localStorage.theme === 'dark' || !('theme' in localStorage)) &&
			window.matchMedia('(prefers-color-scheme: dark)').matches
		) {
			document.documentElement.dataset.theme = 'dark';
		} else {
			document.documentElement.dataset.theme = 'light';
		}
	}

	updateTheme();
</script>

<select
	bind:value={theme}
	onchange={() => {
		if (theme === 'system') {
			localStorage.removeItem('theme');
		} else {
			localStorage.theme = theme;
		}
		updateTheme();
	}}
>
	<option value="system">System</option>
	<option value="light">Light</option>
	<option value="dark">Dark</option>
</select>
