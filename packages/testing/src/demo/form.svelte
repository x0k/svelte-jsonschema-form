<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import Tree from "@sveltejs/svelte-json-tree";
  import { setFromContext, RawForm, type FormInternals } from "@sjsf/form";

  import { ShadowHost } from "../components/shadow";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    form: FormInternals;
  }

  const { form }: Props = $props();
  setFromContext(form.context);
</script>

<div>
  <div class="code">
    <ShadowHost>
      <Tree value={form.formValue} />
    </ShadowHost>
  </div>
  <RawForm {form} style="display: flex; flex-direction: column; gap: 1rem;" />
</div>

<style>
  .code {
    height: 30vh;
    overflow-y: auto;
    position: sticky;
    top: 0;
    background-color: white;
    /* background-color: var(--dark-bg-color, #1e293b); Dark mode: slate-900 */
    z-index: 50;
    border-bottom: 1px solid #e5e7eb; /* Border color (if needed, customize as desired) */
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
  }
</style>
