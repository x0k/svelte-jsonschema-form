import { extraPackage } from "meta";
import type { DemoMeta } from "@/lib/demo";

export default {
  extraDependencies: [extraPackage("lucideSvelte")],
} satisfies Partial<DemoMeta>;
