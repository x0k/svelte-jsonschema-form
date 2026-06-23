import { expectTypeOf, test } from "vitest";

import { createQuery } from "./task.svelte.js";

test("createQuery", () => {
  const query = createQuery({
    execute: () => Promise.resolve(1),
  });
  expectTypeOf(query.current).toEqualTypeOf<number | undefined>();
  expectTypeOf(query.runAsync).returns.resolves.toEqualTypeOf<number>();

  const queryWithInitialValue = createQuery({
    initialValue: 0,
    execute: () => Promise.resolve(1),
  });
  expectTypeOf(queryWithInitialValue.current).toEqualTypeOf<number>();
  expectTypeOf(
    queryWithInitialValue.runAsync
  ).returns.resolves.toEqualTypeOf<number>();

  const queryWithEmptyArray = createQuery({
    initialValue: [],
    execute: () => Promise.resolve(["foo"]),
  });
  expectTypeOf(queryWithEmptyArray.current).toEqualTypeOf<string[]>();
  expectTypeOf(queryWithEmptyArray.runAsync).returns.resolves.toEqualTypeOf<
    string[]
  >();

  const queryWithNull = createQuery({
    initialValue: null,
    execute: () => Promise.resolve("foo"),
  });
  expectTypeOf(queryWithNull.current).toEqualTypeOf<string | null>();
  expectTypeOf(queryWithNull.runAsync).returns.resolves.toEqualTypeOf<string>();
});
