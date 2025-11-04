<script lang="ts">
  import { chain, fromFactories, fromRecord } from '@sjsf/form/lib/resolver';
  import { Content, createForm, setFormContext, type Config } from '@sjsf/form';

  import * as defaults from "@/lib/form/defaults";

  const form = createForm({
    ...defaults,
    schema: {
      type: 'object',
      properties: {
        foo: {
          type: "string"
        },
        bar: {
          type: "number"
        }
      }
    }, 
    extraUiOptions: chain(
      fromRecord({
        labelAttributes: {
          style: 'color: red'
        }
      }),
      fromFactories({
        help: (config: Config) => `${config.path.at(-1)} help`
      })
    )
  })
  setFormContext(form)
</script>

<Content />

