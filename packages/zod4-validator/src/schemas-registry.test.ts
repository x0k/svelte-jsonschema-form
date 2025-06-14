import { describe, expect, it } from "vitest";
import { toJSONSchema } from "zod/v4/core";
import { z as zz } from "zod/v4";
import { z as zm } from "zod/v4-mini";

import { createAugmentedSchema as createAugmentedSchemaClassic } from "./classic/index.js";
import { createAugmentedSchema as createAugmentedSchemaMini } from "./mini/index.js";
import { createSchemaRegistry } from "./schemas-registry.js";
import { createAugmentedId } from "./model.js";

describe("SchemasRegistry", () => {
  it.each([
    ["classic", createAugmentedSchemaClassic, zz],
    ["mini", createAugmentedSchemaMini, zm],
  ])(
    "should create augmented zod schemas for object union members (%s)",
    async (_, createAugmentedSchema, z) => {
      const registry = createSchemaRegistry({ createAugmentedSchema });
      const { anyOf } = toJSONSchema(
        z.union([
          z.object({ foo: z.string() }),
          z.object({ bar: z.string(), baz: z.number() }),
        ]),
        {
          target: "draft-7",
          override: registry.register,
        }
      );
      const [first, second] = (anyOf ?? []).map(({ $id: id }, i) => {
        if (id === undefined) {
          throw new Error(`$id is undefined for anyOf[${i}] item`);
        }
        const schema = registry.get(createAugmentedId(id));
        if (schema === undefined) {
          throw new Error(`Augmented schema is undefined for anyOf[${i}] item`);
        }
        return schema;
      });
      if (first === undefined || second === undefined) {
        throw new Error(`Augmented schemas are invalid`);
      }
      expect(z.safeParse(first, {})).toHaveProperty("success", false);
      expect(z.safeParse(first, { foo: "foo" })).toHaveProperty(
        "success",
        true
      );
      expect(z.safeParse(second, { foo: "foo" })).toHaveProperty(
        "success",
        false
      );
      expect(z.safeParse(second, { bar: "bar" })).toHaveProperty(
        "success",
        true
      );
    }
  );
});
