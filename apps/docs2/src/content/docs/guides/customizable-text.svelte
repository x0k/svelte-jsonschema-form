<script lang="ts">
  import { Content, createForm, setFormContext } from '@sjsf/form';

  import * as defaults from "@/lib/form/defaults";

  let width = $state(50)

  const form = createForm({
    ...defaults,
    schema: {type: 'string' },
    uiSchema: {
      'ui:options': {
        text: {
          get style() {
            return `flex-grow: 0; width: ${width}%`
          }
        }
      }
    }
  })
  setFormContext(form)
</script>

<input style="width: 100%;" type="range" bind:value={width} />

<Content />
