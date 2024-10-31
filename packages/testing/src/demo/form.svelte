<script lang="ts" generics="T, E">
  import type { HTMLAttributes } from "svelte/elements";
  import {
    setFromContext,
    SimpleForm,
    type FormAPI,
    type FormContext,
  } from "@sjsf/form";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    context: FormContext;
    form: FormAPI<T, E>;
  }

  const { context, form }: Props = $props();

  setFromContext(context);
</script>

<div>
  <div class="code">
    <pre><code>{JSON.stringify(form.formValue, null, 2)}</code></pre>
  </div>
  <SimpleForm
    {form}
    style="display: flex; flex-direction: column; gap: 1rem;"
  />
</div>

<style>
  .code {
    max-height: 40vh;
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
