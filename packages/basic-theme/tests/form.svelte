<script lang="ts">
  import { BasicForm, createForm, type FormOptions } from '@sjsf/form'
  
	import '../src/extra-widgets/checkboxes-include.js';
  import '../src/css/basic.css'
  
  const props: FormOptions<any> = $props()
  const form = createForm(props)
</script>

<BasicForm {form} />
