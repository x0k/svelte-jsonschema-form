import type { UiOptionsRegistry, UiSchemaRoot } from "@sjsf/form";
import type { RemoteForm } from "@sveltejs/kit";

export function createUiSchemaWithFormAttributes(
  remoteForm: RemoteForm<any, any>,
  schema: UiSchemaRoot | undefined,
  uiOptionsRegistry: UiOptionsRegistry | undefined
): UiSchemaRoot {
  void remoteForm;
  void schema;
  void uiOptionsRegistry;
  throw new Error(
    "@sjsf/sveltekit is stubbed until the sveltekit3 package is available"
  );
}
