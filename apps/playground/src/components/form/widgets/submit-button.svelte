<script lang="ts">
  import type { ComponentsResolver } from "../resolver";
  import type { Schema } from "../schema";
  import type { UiSchema } from "../ui-schema";
  import type { Translator } from '../translation';

  interface Props {
    components: ComponentsResolver;
    translator: Translator
    schema: Schema;
    uiSchema: UiSchema;
  }

  const { schema, uiSchema, components, translator }: Props = $props();
  const options = $derived({ schema, uiSchema })
  const Button = $derived(components("button", options));
  const submitText = $derived(translator("submit", options))
</script>

<Button type="submit">
  {submitText}
</Button>
