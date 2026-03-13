import{p as s}from"./package.CVr5ZI9V.js";import{m as o,o as p}from"./advanced-examples.D7nYdux4.js";import"./each.0K4qf4jV.js";import"./render.CpdcQVrh.js";import"./definitions.DQIkFhWS.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.CGPGKsLY.js";import"./shared.DAvqY4xh.js";import"./preload-helper.BUFao3bW.js";import"./buttons.BkAEGj6o.js";/* empty css                                                       *//* empty css                                                                 */const h={package:o(p(s),{dependencies:{"@picocss/pico":"^2.1.0"}}),formDefaults:{theme:"basic"},files:{"src/routes/+layout.svelte":`<script lang="ts">
  import type { Snippet } from 'svelte';

  import '@picocss/pico/css/pico.css';
  import '@sjsf/basic-theme/css/pico.css';

  const { children }: { children: Snippet } = $props()
<\/script>

{@render children()}

<style>
  :global(html) {
    padding: 2rem;
  }
</style>
`}};export{h as layer};
