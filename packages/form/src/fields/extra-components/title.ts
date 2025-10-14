import type { ComponentCommonProps } from "../components.js";
import type { TemplateType } from "../templates.js";

declare module "../../form/index.js" {
  interface FoundationalComponents {
    title: {};
  }
  interface ComponentProps {
    title: ComponentCommonProps & {
      title: string;
      templateType: TemplateType;
    };
  }
  interface ComponentBindings {
    title: "";
  }
}
