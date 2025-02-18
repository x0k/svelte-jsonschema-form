import type { UiSchema } from "@sjsf/form";

declare module "@sjsf/form" {
  interface UiSchemaContent {
    multiFieldOptionSelector?: UiSchema;
  }
}
