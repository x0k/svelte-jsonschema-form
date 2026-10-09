import { loadResults } from "#lib/server.js";

import type { LayoutServerLoad } from "./$types.js";

export const trailingSlash = "always";

export const load: LayoutServerLoad = async () => {
  return {
    results: await loadResults(),
  };
};
