import MarkdownDescription from "./markdown-description.svelte";
import GeoField from "./geo-field.svelte";

// @ts-expect-error
MarkdownDescription.componentName = "MarkdownDescription";

// @ts-expect-error
GeoField.componentName = "GeoField";

export { MarkdownDescription, GeoField };
