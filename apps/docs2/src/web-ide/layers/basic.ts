import { dependencies } from "%/basic-starter/package.json";

import type { Layer } from "../layer";

export const layer = {
  package: {
    dependencies,
  },
  formDefaults: { theme: "basic" },
} satisfies Layer;
