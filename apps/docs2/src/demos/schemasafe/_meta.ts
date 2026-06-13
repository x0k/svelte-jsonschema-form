import type { DemoMeta } from "@/lib/demo";

export default {
  validator: { name: "schemasafe", draft2020: false, precompiled: false },
} satisfies Partial<DemoMeta>;
