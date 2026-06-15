// NOTE: DO NOT REMOVE
import type { ComponentProps as _ComponentProps } from "@sjsf/form";
import type { EnumValueMapperBuilder } from "@sjsf/form/options.svelte";

declare module "@sjsf/form" {
  interface ComponentProps {
    markdownDescription: _ComponentProps["description"];
    transparentLayout: _ComponentProps["layout"];
  }
  interface ComponentBindings {
    markdownDescription: "";
    transparentLayout: "";
  }
  interface UiOptionsRegistry {
    stringEnumValueMapper: () => EnumValueMapperBuilder;
  }
}
