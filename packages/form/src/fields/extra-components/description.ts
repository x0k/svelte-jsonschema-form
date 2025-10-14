import type { ComponentCommonProps } from "../components.js";
import type { TemplateType } from "../templates.js";

declare module "../../form/index.js" {
  interface FoundationalComponents {
    description: {};
  }
  interface ComponentProps {
    description: ComponentCommonProps & {
      templateType: TemplateType;
      description: string;
    };
  }
  interface ComponentBindings {
    description: "";
  }
}
