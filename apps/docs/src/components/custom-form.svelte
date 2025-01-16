<script lang="ts" generics="T, E">
  import { RawForm } from '@sjsf/form';

  import { createCustomForm, type CustomOptions } from '@/components/custom-form'

  const props: CustomOptions<T, E> = $props()

  const form = createCustomForm(props)
</script>

<RawForm {form} />
