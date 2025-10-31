/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEV } from 'esm-env';
import type { ActionResult } from '@sveltejs/kit';
import { createTask, type TaskOptions } from '@sjsf/form/lib/task.svelte';
import { DEFAULT_ID_PREFIX, SJSF_ID_PREFIX, type FormValue } from '@sjsf/form';

import { applyAction, deserialize } from '$app/forms';
import { invalidateAll } from '$app/navigation';
import { chunks } from '$lib/internal.js';

import { FORM_DATA_FILE_PREFIX, JSON_CHUNKS_KEY } from '../model.js';

import type { SvelteKitFormMeta } from './meta.js';

export type SveltekitRequestOptions<ActionData, V> = Omit<
  TaskOptions<[V | FormValue, SubmitEvent], ActionResult<NonNullable<ActionData>>, unknown>,
  'execute'
> & {
  /** @default DEFAULT_ID_PREFIX */
  idPrefix?: string;
  /** By default, handles conversion of `File` */
  createReplacer?: (formData: FormData) => (key: string, value: any) => any;
  /** @default 500000 */
  jsonChunkSize?: number;
  /** @default true */
  reset?: boolean;
  /** @default true */
  invalidateAll?: boolean;
};

function createDefaultReplacer(formData: FormData) {
  const seen = new Set<string>();
  return (key: string, value: any) => {
    if (!(value instanceof File)) {
      return value;
    }
    const initialKey = `${FORM_DATA_FILE_PREFIX}${key}`;
    let fdKey = initialKey;
    let i = 1;
    while (seen.has(fdKey)) fdKey = `${initialKey}__${i++}`;
    formData.append(fdKey, value);
    return fdKey;
  };
}

export function createSvelteKitRequest<Meta extends SvelteKitFormMeta<any, any, any, any>>(
  _meta: Meta,
  options: SveltekitRequestOptions<Meta['__actionData'], Meta['__formValue']>
) {
  const jsonChunkSize = $derived(options.jsonChunkSize ?? 500000);
  const createReplacer = $derived(options.createReplacer ?? createDefaultReplacer);
  return createTask({
    // Based on https://github.com/sveltejs/kit/blob/92b2686314a7dbebee1761c3da7719d599f003c7/packages/kit/src/runtime/app/forms.js
    async execute(signal: AbortSignal, data: Meta['__formValue'] | FormValue, e: SubmitEvent) {
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
        if (enctype !== 'multipart/form-data') {
          const formData = new FormData(formElement);
          for (const value of formData.values()) {
            if (value instanceof File) {
              throw new Error(
                'Your form contains <input type="file"> fields, but is missing the necessary `enctype="multipart/form-data"` attribute. This will lead to inconsistent behavior between enhanced and native forms. For more details, see https://github.com/sveltejs/kit/issues/9819.'
              );
            }
          }
        }
      }

      const formData = new FormData();
      formData.append(SJSF_ID_PREFIX, options.idPrefix ?? DEFAULT_ID_PREFIX);
      for (const chunk of chunks(JSON.stringify(data, createReplacer(formData)), jsonChunkSize)) {
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
