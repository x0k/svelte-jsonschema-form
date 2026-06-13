import type { DemoMeta } from "@/lib/demo";

export default {
  fields: ["unknown-native-file"],
  widgets: ["file"],
} satisfies Partial<DemoMeta>;
