import type { Snippet } from "svelte";

import type { ComponentCommonProps } from "../components.js";

declare module "../../form/index.js" {
  interface FoundationalComponents {
    label: {};
  }
  interface ComponentProps {
    label: ComponentCommonProps & {
      title: string;
      append?: Snippet;
    };
  }
  interface ComponentBindings {
    label: "";
  }
}
