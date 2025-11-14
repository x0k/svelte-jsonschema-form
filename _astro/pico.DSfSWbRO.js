import{p as s}from"./package.C7bNT9Se.js";import{m as o,o as p}from"./advanced-examples.v33nwk6C.js";import"./each.BqUK7mNK.js";import"./render.CzOj0u-p.js";import"./definitions.Dd0A7QR4.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.Wjih3T4S.js";import"./shared.KN5oriJZ.js";import"./preload-helper.BUFao3bW.js";import"./buttons.g3G-i0Ju.js";/* empty css                                                       *//* empty css                                                                 */const h={package:o(p(s),{dependencies:{"@picocss/pico":"^2.1.0"}}),formDefaults:{theme:"basic"},files:{"src/routes/+layout.svelte":`<script lang="ts">
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
