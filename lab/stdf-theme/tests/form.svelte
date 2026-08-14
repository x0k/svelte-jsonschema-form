<script lang="ts">
  import { BasicForm, createForm, type FormOptions } from "@sjsf/form";
  import { ConfigProvider } from "stdf";

  import "../src/lib/extra-widgets/checkboxes-include.js";

  const props: FormOptions<any> = $props();

  const form = createForm(props);
</script>

<ConfigProvider>
  <BasicForm {form} />
</ConfigProvider>
