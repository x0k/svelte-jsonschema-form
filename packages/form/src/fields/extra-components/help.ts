import type { ComponentCommonProps } from "../components.js";

declare module "../../form/index.js" {
  interface FoundationalComponents {
    help: {};
  }
  interface ComponentProps {
    help: ComponentCommonProps & {
      help: string;
    };
  }
  interface ComponentBindings {
    help: "";
  }
}
