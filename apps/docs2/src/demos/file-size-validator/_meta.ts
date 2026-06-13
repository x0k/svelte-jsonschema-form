import type { DemoMeta } from "@/lib/demo";

export default {
  fields: ["file"],
  widgets: ["file"],
} satisfies Partial<DemoMeta>;
