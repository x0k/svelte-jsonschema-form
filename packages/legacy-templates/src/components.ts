import type { ComponentCommonProps } from "@sjsf/legacy-fields/exports";

export interface ParentTemplateTypes {
  field: {};
  object: {};
  array: {};
}

export type ParentTemplateType = keyof ParentTemplateTypes;

declare module "@sjsf/form" {
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
