export { default as markdownDescription } from "./markdown-description.svelte";
export { default as geoField } from "./geo-field.svelte";
export { default as customLayout } from "./custom-layout.svelte";
export { default as transparentLayout } from "./transparent-layout.svelte";

declare module "@sjsf/form" {
  interface ComponentProps {
    markdownDescription: ComponentProps["description"];
    geoField: ComponentProps["objectField"];
    customLayout: ComponentProps["layout"];
    transparentLayout: ComponentProps["layout"];
  }
  interface ComponentBindings {
    markdownDescription: "";
    geoField: "value";
    customLayout: "";
    transparentLayout: "";
  }
}
