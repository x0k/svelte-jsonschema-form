const s=`<script lang="ts">
	import '../app.css';
	
	let { children } = $props();
<\/script>

{@render children()}
`,t={package:{devDependencies:{"@tailwindcss/vite":"^4.0.0",tailwindcss:"^4.0.0"}},vite:{plugins:{"@tailwindcss/vite":{import:"tailwindcss",call:"tailwindcss()"}}},files:{"src/routes/+layout.svelte":s,"src/app.css":"@import 'tailwindcss'"}};export{t as layer};
