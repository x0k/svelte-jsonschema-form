import{o as e}from"./advanced-examples.lZGjdUQr.js";import"./each.Es0kInrS.js";import"./render.Cv2x1pxx.js";import"./definitions.CaZmSaOW.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.CThAahfv.js";import"./shared.B3vGQH-Y.js";import"./preload-helper.BUFao3bW.js";import"./buttons.aj71U8gW.js";/* empty css                                                       *//* empty css                                                                 */const s="beercss-starter",t="0.0.3",c="module",r={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},o={"@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.42.0","@sveltejs/vite-plugin-svelte":"^6.1.2",svelte:"^5.34.8","svelte-check":"^4.3.1",typescript:"^5.9.2",vite:"^7.1.2"},n={"@sjsf/ajv8-validator":"workspace:*","@sjsf/form":"workspace:*","@sjsf-lab/beercss-theme":"workspace:*",ajv:"^8.17.1",beercss:"^3.13.1"},i={name:s,private:!0,version:t,type:c,scripts:r,devDependencies:o,dependencies:n},p=`<script lang="ts">
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
