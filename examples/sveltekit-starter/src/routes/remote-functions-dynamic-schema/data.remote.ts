import { createServerValidator } from "@sjsf/sveltekit/rf/server";
import { error, invalid, redirect } from "@sveltejs/kit";

import { form, getRequestEvent, query } from "$app/server";
import { loadResults, loadSchemaById, saveResult } from "$lib/server";
import * as defaults from "$lib/form-defaults";

export const getResults = query(loadResults);

export const getCurrentSchema = query("unchecked", async (id) => {
  const schema = typeof id === "string" && (await loadSchemaById(id));
  if (!schema) {
    error(404);
  }
  return schema;
});

export const createResult = form("unchecked", async (data) => {
  const { params } = getRequestEvent();
  const schema = params.id && (await loadSchemaById(params.id));
  if (!schema) {
    error(404);
  }
  const validator = createServerValidator({
    ...defaults,
    schema,
  });
  const result = await validator.validate(data);
  if (result.issues) {
    invalid(...result.issues);
  }
  await saveResult(result.value.data);
  await getResults().refresh();
  redirect(303, "..");
});
