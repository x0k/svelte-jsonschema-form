import { initForm } from '$lib/server/server.js';
import type { Page } from '@sveltejs/kit';
import { render } from 'svelte/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const form = () => import('./native-form.svelte').then((m) => m.default);
function mock(page: Partial<Page>) {
  vi.doMock('$app/state', () => ({
    page
  }));
  return form();
}

describe('native form SSR', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });
  it('should render simple form', async () => {
    const Form = await mock({
      data: {
        form: initForm({
          sendSchema: true,
          schema: { title: 'Schema title', type: 'string' },
          initialValue: 'initial value'
        })
      }
    });
    const { body } = render(Form);
    expect(body).toContain('Schema title');
    expect(body).toContain('initial value');
  });
});
