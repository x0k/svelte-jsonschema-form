export { default as markdownDescription } from "./markdown-description.svelte";
export { default as transparentLayout } from "./transparent-layout.svelte";

declare module "@sjsf/form" {
  interface ComponentProps {
    markdownDescription: ComponentProps["description"];
    transparentLayout: ComponentProps["layout"];
  }
  interface ComponentBindings {
    markdownDescription: "";
    transparentLayout: "";
  }
}
