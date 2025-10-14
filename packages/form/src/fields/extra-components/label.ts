import type { ComponentCommonProps } from "../components.js";

declare module "../../form/index.js" {
  interface FoundationalComponents {
    label: {};
  }
  interface ComponentProps {
    label: ComponentCommonProps & {
      title: string;
    };
  }
  interface ComponentBindings {
    label: "";
  }
}
