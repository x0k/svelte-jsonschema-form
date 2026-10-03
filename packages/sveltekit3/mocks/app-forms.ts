import { vi } from "vitest";

/**
 * Stands in for `$app/forms`, whose real implementation needs a running router.
 * Aliased only in the `client-unit` vitest project.
 */
export const applyAction = vi.fn(async () => {});

export function deserialize(text: string) {
  return JSON.parse(text);
}

export const enhance = vi.fn();
