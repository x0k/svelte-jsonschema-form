const n=`@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  padding: 2rem;
}
`,s=`<script lang="ts">
	import '../app.css';
	
	let { children } = $props();
<\/script>

{@render children()}
`,t=`export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`,e={package:{devDependencies:{tailwindcss:"^3.4.17",postcss:"^8.5.6"}},files:{"src/app.css":n,"src/routes/+layout.svelte":s,"postcss.config.js":t}};export{e as layer};
