import { vi } from "vitest";

/**
 * Stands in for `$app/navigation`, whose real implementation needs a running
 * router. Aliased only in the `client-unit` vitest project.
 */
export const goto = vi.fn(async () => {});

export const refreshAll = vi.fn(async () => {});
