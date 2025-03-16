<script
  lang="ts"
  generics="T, V extends Validator, O extends MyFormOptions<T, V>"
>
  import { BasicForm, type Validator } from "@sjsf/form";

  import { type MyFormOptions, createMyForm } from "./my-form";

  const props: O = $props();

  const form = createMyForm<T, V, O>(props);
</script>

<BasicForm {form} />
