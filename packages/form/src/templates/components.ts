import type { ComponentCommonProps } from "@/fields/exports.js";

export interface ParentTemplateTypes {
  field: {};
  object: {};
  array: {};
}

export type ParentTemplateType = keyof ParentTemplateTypes;

declare module "../form/index.js" {
  interface FoundationalComponents {
    title: {};
    description: {};
    help: {};
    errorsList: {};
  }
  interface ComponentProps {
    title: ComponentCommonProps & {
      type: ParentTemplateType;
      title: string;
      forId: string;
      required: boolean;
    };
    description: ComponentCommonProps & {
      type: ParentTemplateType;
      description: string;
    };
    help: ComponentCommonProps & {
      help: string;
    };
    errorsList: ComponentCommonProps & {
      forId: string;
    };
  }
  interface ComponentBindings {
    title: "";
    description: "";
    help: "";
    errorsList: "";
  }
}
