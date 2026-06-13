import type { DemoMeta } from "@/lib/demo";

export default {
  fields: ["enum", "multi-enum", "unknown-native-file"],
  widgets: ["checkboxes", "file", "radio", "textarea", "date-picker"],
} satisfies Partial<DemoMeta>;
