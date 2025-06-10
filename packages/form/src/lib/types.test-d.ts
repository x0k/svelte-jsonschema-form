import { expectTypeOf, test } from "vitest";
import type { JsonPaths } from "./types.js";

test("JsonPaths", () => {
  interface SimpleFields {
    id: number;
    name: string;
    email?: string;
  }
  expectTypeOf<JsonPaths<SimpleFields>>().toEqualTypeOf<keyof SimpleFields>();

  interface TuplesAndArrays {
    tuple: [number, boolean];
    coordinates?: [number, number, number];
    tags?: string[];
  }
  expectTypeOf<JsonPaths<TuplesAndArrays>>().toEqualTypeOf<
    | "tuple"
    | "tuple.0"
    | "tuple.1"
    | "coordinates"
    | "coordinates.0"
    | "coordinates.1"
    | "coordinates.2"
    | "tags"
    | `tags.${number}`
  >();
  interface Nested {
    metadata?: {
      createdAt: string;
      updatedAt?: string;
      author?: {
        name: string;
        avatar?: string;
      };
    };
  }
  expectTypeOf<JsonPaths<Nested>>().toEqualTypeOf<
    | "metadata"
    | "metadata.createdAt"
    | "metadata.updatedAt"
    | "metadata.author"
    | "metadata.author.name"
    | "metadata.author.avatar"
  >();

  interface TooDeep {
    nested1: {
      nested2: {
        nested3: {
          nested4: {
            foo: string;
          };
        };
      };
    };
  }
  expectTypeOf<JsonPaths<TooDeep, 3>>().toEqualTypeOf<
    | "nested1"
    | "nested1.nested2"
    | "nested1.nested2.nested3"
    | "nested1.nested2.nested3.nested4"
  >();
});
