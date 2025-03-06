<script
  lang="ts"
  generics="T, V extends Validator = ReturnType<typeof createFormValidator>"
>
  import { BasicForm, type Validator } from "@sjsf/form";
  import { createFormValidator } from "@sjsf/ajv8-validator";

  import { type MyFormOptions, createMyForm } from "./my-form";

  const props: MyFormOptions<T, V> = $props();

  const form = createMyForm(props);
</script>

<BasicForm {form} />
