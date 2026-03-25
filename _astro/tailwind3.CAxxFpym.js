var e=`@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  padding: 2rem;
}
`,t=`<script lang="ts">
	import '../app.css';
	
	let { children } = $props();
<\/script>

{@render children()}
`,n=`export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`,r={package:{devDependencies:{tailwindcss:`^3.4.17`,postcss:`^8.5.6`}},files:{"src/app.css":e,"src/routes/+layout.svelte":t,"postcss.config.js":n}};export{r as layer};