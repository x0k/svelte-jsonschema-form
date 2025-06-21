import packageJson from "%/basic-starter/package.json";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  formDefaults: { theme: "basic" },
} satisfies Layer;
