import{o as e}from"./advanced-examples.D7nYdux4.js";import"./each.0K4qf4jV.js";import"./render.CpdcQVrh.js";import"./definitions.DQIkFhWS.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.CGPGKsLY.js";import"./shared.DAvqY4xh.js";import"./preload-helper.BUFao3bW.js";import"./buttons.BkAEGj6o.js";/* empty css                                                       *//* empty css                                                                 */const s="beercss-starter",t="0.0.8",c="module",r={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},o={"@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.49.5","@sveltejs/vite-plugin-svelte":"^6.1.2",svelte:"^5.46.4","svelte-check":"^4.3.1",typescript:"^5.9.2",vite:"^7.1.2"},n={"@sjsf/ajv8-validator":"workspace:*","@sjsf/form":"workspace:*","@sjsf-lab/beercss-theme":"workspace:*",ajv:"^8.17.1",beercss:"^4.0.2"},i={name:s,private:!0,version:t,type:c,scripts:r,devDependencies:o,dependencies:n},p=`<script lang="ts">
  import "beercss/dist/cdn/beer.css";

  let { children } = $props();
<\/script>

{@render children()}

<style>
  :global(html) {
    padding: 2rem;
  }
</style>
`,b={package:e(i),formDefaults:{theme:"beercss"},files:{"src/routes/+layout.svelte":p}};export{b as layer};
