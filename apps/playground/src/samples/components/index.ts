import MarkdownDescription from "./markdown-description.svelte";
import GeoField from "./geo-field.svelte";
import CustomLayout from './custom-layout.svelte';

// @ts-expect-error
MarkdownDescription.componentName = "MarkdownDescription";

// @ts-expect-error
GeoField.componentName = "GeoField";

// @ts-expect-error
CustomLayout.componentName = "CustomLayout";

export { MarkdownDescription, GeoField, CustomLayout };
