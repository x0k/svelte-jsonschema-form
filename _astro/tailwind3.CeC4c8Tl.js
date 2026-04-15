var e={package:{devDependencies:{tailwindcss:`^3.4.17`,postcss:`^8.5.6`}},files:{"src/app.css":`@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  padding: 2rem;
}
`,"src/routes/+layout.svelte":`<script lang="ts">
	import '../app.css';
	
	let { children } = $props();
<\/script>

{@render children()}
`,"postcss.config.js":`export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`}};export{e as layer};