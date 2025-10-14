import type { ComponentCommonProps } from "../components.js";

declare module "../../form/index.js" {
  interface FoundationalComponents {
    errorsList: {};
  }
  interface ComponentProps {
    errorsList: ComponentCommonProps;
  }
  interface ComponentBindings {
    errorsList: "";
  }
}
