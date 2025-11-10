import{p as s}from"./package.C7bNT9Se.js";import{m as o,o as p}from"./advanced-examples.CwYqb_9b.js";import"./each.DGpQ3d0C.js";import"./render.DQZAjqjS.js";import"./definitions.CBHryth7.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.CYYQo0fI.js";import"./shared.B3UibPy3.js";import"./preload-helper.BUFao3bW.js";import"./buttons.C3u4I-7f.js";/* empty css                                                       *//* empty css                                                                 */const h={package:o(p(s),{dependencies:{"@picocss/pico":"^2.1.0"}}),formDefaults:{theme:"basic"},files:{"src/routes/+layout.svelte":`<script lang="ts">
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
