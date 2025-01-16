<script lang="ts" generics="T, E">
  import { createForm3, type FormOptions } from "./create-form.svelte.js";
  import Raw from './raw.svelte'

  const props: FormOptions<T, E> = $props();

  const form = createForm3(props);
</script>

<Raw {form} />
