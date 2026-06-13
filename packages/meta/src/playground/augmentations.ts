// NOTE: DO NOT REMOVE
import type { ComponentProps } from "@sjsf/form";
import type { EnumValueMapperBuilder } from "@sjsf/form/options.svelte";

declare module "@sjsf/form" {
  interface ComponentProps {
    markdownDescription: ComponentProps["description"];
    transparentLayout: ComponentProps["layout"];
  }
  interface ComponentBindings {
    markdownDescription: "";
    transparentLayout: "";
  }
  interface UiOptionsRegistry {
    stringEnumValueMapper: () => EnumValueMapperBuilder;
  }
}
