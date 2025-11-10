import{p as s}from"./package.C7bNT9Se.js";import{m as o,o as p}from"./advanced-examples.BhxVcp9S.js";import"./each.DT3TJ4y6.js";import"./render.C6bdgTYX.js";import"./definitions.DS7POIPg.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.B6yIEHbF.js";import"./shared.0qjUl5wn.js";import"./preload-helper.BUFao3bW.js";import"./buttons.B3VYvRBE.js";/* empty css                                                       *//* empty css                                                                 */const h={package:o(p(s),{dependencies:{"@picocss/pico":"^2.1.0"}}),formDefaults:{theme:"basic"},files:{"src/routes/+layout.svelte":`<script lang="ts">
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
