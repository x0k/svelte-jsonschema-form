import type { Snippet } from "svelte";

import type { SchemaValue } from "@/form/index.js";

import type { TemplateCommonProps } from "../templates.js";

declare module "../../form/index.js" {
  interface FoundationalComponents {
    arrayItemTemplate: {};
  }
  interface ComponentProps {
    arrayItemTemplate: TemplateCommonProps<SchemaValue> & {
      index: number;
      buttons?: Snippet;
    };
  }
  interface ComponentBindings {
    arrayItemTemplate: "";
  }
}
