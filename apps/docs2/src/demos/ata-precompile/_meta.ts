import type { DemoMeta } from "@/lib/demo";

export default {
  validator: { name: "ata", draft2020: false, precompiled: true },
  fields: ["multi-enum"],
  widgets: ["checkboxes"],
} satisfies Partial<DemoMeta>;
