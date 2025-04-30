/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEV } from 'esm-env';
import type { ActionResult } from '@sveltejs/kit';
import { createAction, type ActionOptions } from '@sjsf/form/lib/action.svelte';

import { applyAction, deserialize } from '$app/forms';
import { invalidateAll } from '$app/navigation';

import { JSON_CHUNKS_KEY } from '../model.js';

import type { SvelteKitFormMeta } from './meta.js';

export type SveltekitRequestOptions<ActionData, V> = Omit<
  ActionOptions<[V, SubmitEvent], ActionResult<NonNullable<ActionData>>, unknown>,
  'execute'
> & {
  /** @default 500000 */
  jsonChunkSize?: number;
  /** @default true */
  reset?: boolean;
  /** @default true */
  invalidateAll?: boolean;
};

export function createSvelteKitRequest<Meta extends SvelteKitFormMeta<any, any, any, any>>(
  _meta: Meta,
  options: SveltekitRequestOptions<Meta['__actionData'], Meta['__formValue']>
) {
  const jsonChunkSize = $derived(options.jsonChunkSize ?? 500000);
  return createAction({
    // Based on https://github.com/sveltejs/kit/blob/92b2686314a7dbebee1761c3da7719d599f003c7/packages/kit/src/runtime/app/forms.js
    async execute(signal: AbortSignal, data: Meta['__formValue'], e: SubmitEvent) {
      const formElement = e.currentTarget;
      if (!(formElement instanceof HTMLFormElement)) {
        throw new Error(`Event currentTarget is not an HTMLFormElement`);
      }
      const getAttribute = makeFormAttributeAccessor(clone(formElement), getSubmitter(e));
      const method = getAttribute('method');
      const action = new URL(getAttribute('action'));
      const enctype = getAttribute('enctype');

      if (DEV) {
        if (method !== 'post') {
          throw new Error('use:enhance can only be used on <form> fields with method="POST"');
        }
        const formData = new FormData(formElement);
        for (const value of formData.values()) {
          if (value instanceof File) {
            throw new Error(
              'Your form contains <input type="file"> fields, but is missing the necessary `enctype="multipart/form-data"` attribute. This will lead to inconsistent behavior between enhanced and native forms. For more details, see https://github.com/sveltejs/kit/issues/9819.'
            );
          }
        }
      }

      const formData = new FormData();
      for (const chunk of chunks(JSON.stringify(data), jsonChunkSize)) {
        formData.append(JSON_CHUNKS_KEY, chunk);
      }

      let result: ActionResult<NonNullable<Meta['__actionData']>>;
      try {
        const headers = new Headers({
          accept: 'application/json',
          'x-sveltekit-action': 'true'
        });

        // do not explicitly set the `Content-Type` header when sending `FormData`
        // or else it will interfere with the browser's header setting
        // see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_FormData_Objects#sect4
        if (enctype !== 'multipart/form-data') {
          headers.set(
            'Content-Type',
            /^(:?application\/x-www-form-urlencoded|text\/plain)$/.test(enctype)
              ? enctype
              : 'application/x-www-form-urlencoded'
          );
        }

        const body =
          // @ts-expect-error `URLSearchParams(form_data)` is kosher, but typescript doesn't know that
          enctype === 'multipart/form-data' ? formData : new URLSearchParams(formData);

        const response = await fetch(action, {
          method: 'POST',
          headers,
          cache: 'no-cache',
          body,
          signal
        });

        result = deserialize(await response.text());
        if (result.type === 'error') result.status = response.status;
      } catch (error) {
        result = { type: 'error', error };
      }

      if (result.type === 'success') {
        if (options.reset !== false) {
          // We call reset from the prototype to avoid DOM clobbering
          HTMLFormElement.prototype.reset.call(formElement);
        }
        if (options.invalidateAll !== false) {
          await invalidateAll();
        }
      }
      // For success/failure results, only apply action if it belongs to the
      // current page, otherwise `form` will be updated erroneously
      if (
        location.origin + location.pathname === action.origin + action.pathname ||
        result.type === 'redirect' ||
        result.type === 'error'
      ) {
        await applyAction(result);
      }
      return result;
    },
    get onSuccess() {
      return options.onSuccess;
    },
    get onFailure() {
      return options.onFailure;
    },
    get combinator() {
      return options.combinator;
    },
    get delayedMs() {
      return options.delayedMs;
    },
    get timeoutMs() {
      return options.timeoutMs;
    }
  });
}

function clone<T extends HTMLElement>(element: T): T {
  return HTMLElement.prototype.cloneNode.call(element) as T;
}

function capitalize<T extends string>(str: T): Capitalize<T> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
}

function getSubmitter(e: SubmitEvent) {
  if (e.submitter instanceof HTMLButtonElement || e.submitter instanceof HTMLInputElement) {
    return e.submitter;
  }
  return null;
}

function makeFormAttributeAccessor(
  form: HTMLFormElement,
  submitter: HTMLButtonElement | HTMLInputElement | null
) {
  return (attribute: 'method' | 'action' | 'enctype') =>
    submitter?.hasAttribute(`form${attribute}`)
      ? submitter[`form${capitalize(attribute)}`]
      : form[attribute];
}

// https://stackoverflow.com/a/29202760/70894
function* chunks(str: string, size: number) {
  const numChunks = Math.ceil(str.length / size);
  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    yield str.substring(o, o + size);
  }
}
