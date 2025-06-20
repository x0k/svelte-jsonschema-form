import { render } from 'svelte/server';
import type { Page } from '@sveltejs/kit';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { pathToId } from '@sjsf/form';

import type { ValidatedFormData } from '$lib/model.js';
import { initForm } from '$lib/server/server.js';

async function renderForm(page: Partial<Page>) {
  vi.doMock('$app/state', () => ({
    page
  }));
  const m = await import('./native-form.svelte');
  return render(m.default);
}

describe('native form SSR', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });
  it('should render initial values', async () => {
    const { body } = await renderForm({
      data: {
        form: initForm({
          sendSchema: true,
          schema: { title: 'Schema title', type: 'string' },
          initialValue: 'initial value',
          initialErrors: [
            {
              instanceId: pathToId([]),
              propertyTitle: 'Property',
              message: 'error message',
              error: null
            }
          ]
        })
      }
    });
    expect(body).toContain('Schema title');
    expect(body).toContain('initial value');
    expect(body).toContain('error message');
  });
  it('should render action result', async () => {
    const { body } = await renderForm({
      data: {
        form: initForm({
          sendSchema: true,
          schema: { title: 'Schema title', type: 'string' },
          initialValue: 'initial value',
          initialErrors: [
            {
              instanceId: pathToId([]),
              propertyTitle: 'Property',
              message: 'error message',
              error: null
            }
          ]
        })
      },
      form: {
        form: {
          isValid: false,
          sendData: true,
          data: 'validated value',
          errors: [
            {
              instanceId: pathToId([]),
              propertyTitle: 'Validated property',
              message: 'validation error message',
              error: null
            }
          ]
        } satisfies ValidatedFormData<null, true>
      }
    });
    expect(body).toContain('Schema title');
    expect(body).toContain('validated value');
    expect(body).toContain('validation error message');
  });
  it('should display the initial values if the validation was successful', async () => {
    const { body } = await renderForm({
      data: {
        form: initForm({
          sendSchema: true,
          schema: { title: 'Schema title', type: 'string' },
          initialValue: 'initial value',
          initialErrors: [
            {
              instanceId: pathToId([]),
              propertyTitle: 'Property',
              message: 'error message',
              error: null
            }
          ]
        })
      },
      form: {
        form: {
          isValid: true,
          sendData: true,
          data: 'validated value',
          errors: [
            {
              instanceId: pathToId([]),
              propertyTitle: 'Validated property',
              message: 'validation error message',
              error: null
            }
          ]
        } satisfies ValidatedFormData<null, true>
      }
    });
    expect(body).toContain('Schema title');
    expect(body).toContain('initial value');
    expect(body).toContain('error message');
  });
});
