<script lang="ts" generics="Meta extends SvelteKitFormMeta<any, any, string, any>">
  import { RawForm } from '@sjsf/form';

  import type { SvelteKitFormMeta } from './meta.js';
  import { createSvelteKitForm, type SvelteKitFormOptions2 } from './create-form.svelte.js';
  import { createSvelteKitRequest, type SveltekitRequestOptions } from './create-request.svelte.js';

  type Props = {
    meta: Meta;
  } & SveltekitRequestOptions<Meta['__actionData'], Meta['__formValue']> &
    Omit<
      SvelteKitFormOptions2<Meta['__formValue'], Meta['__validationError'], Meta['__sendSchema']>,
      'onSubmit'
    >;

  const props: Props = $props();

  const request = createSvelteKitRequest(props.meta, props);

  const form = createSvelteKitForm(
    props.meta,
    // @ts-expect-error
    new Proxy(props, {
      has(target, p) {
        if (p === 'onSubmit') {
          return true;
        }
        return Reflect.has(target, p);
      },
      get(target, p, receiver) {
        if (p === 'onSubmit') {
          return request.run;
        }
        return Reflect.get(target, p, receiver);
      }
    })
  );
</script>

<RawForm {form} method="POST" />
