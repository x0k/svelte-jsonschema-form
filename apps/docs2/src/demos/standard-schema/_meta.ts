import { extraPackage } from "meta";

import type { DemoMeta } from "@/lib/demo";

export default {
  validator: { name: "standard-schema", draft2020: false, precompiled: false },
  extraDependencies: [extraPackage("jsonSchemaToTs"), extraPackage("arktype")],
} satisfies Partial<DemoMeta>;
