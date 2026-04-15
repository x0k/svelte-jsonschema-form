var e={package:{devDependencies:{"@tailwindcss/vite":`^4.0.0`,tailwindcss:`^4.0.0`}},vite:{plugins:{"@tailwindcss/vite":{import:`tailwindcss`,call:`tailwindcss()`}}},files:{"src/routes/+layout.svelte":`<script lang="ts">
	import '../app.css';
	
	let { children } = $props();
<\/script>

{@render children()}
`,"src/app.css":`@import 'tailwindcss'`}};export{e as layer};