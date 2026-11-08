import { getValueSnapshot, setValueAtPath, type Schema } from "@sjsf/form";
import { tick } from "svelte";
import { describe, expect, test } from "vitest";

import { renderFieldForm } from "./helpers.js";

/**
 * Ports the acceptance cases of RJSF #5464, where a `dependencies` or
 * `if`/`then`/`else` swap applies the newly selected branch's default over the
 * one the swapped-away branch left in place.
 *
 * The stub case is expressed through `patternProperties` instead of
 * `additionalProperties`: a dependency branch declares no `mode`, so resolving
 * it stubs that key with the additional properties schema, and the modern
 * merger refuses the resulting type intersection. The same stub is produced
 * through a pattern, and the guard under test is unchanged.
 */

const cfgFor = (name: string): Schema => ({
  type: "object",
  default: { name },
  properties: { name: { type: "string" } },
});

const kindFor = (v: string): Schema => ({
  type: "object",
  default: { v },
  properties: { v: { type: "string" } },
});

/**
 * Two hops: `mode` swaps `kind`, and the `kind` written for the newly selected
 * branch retypes `cfg`, whose own refill was written while `kind` was gone.
 * `finalCfg` is what the second hop retypes `cfg` to.
 */
const retypingCascade = (finalCfg: Schema): Schema =>
  ({
    type: "object",
    properties: {
      mode: { type: "string", enum: ["a", "b"], default: "a" },
      kind: { type: "object", properties: { v: { type: "string" } } },
    },
    allOf: [
      {
        if: { properties: { mode: { const: "a" } }, required: ["mode"] },
        then: { properties: { kind: kindFor("k1") } },
        else: { properties: { kind: kindFor("k2") } },
      },
      {
        if: {
          properties: {
            kind: { properties: { v: { const: "k2" } }, required: ["v"] },
          },
          required: ["kind"],
        },
        then: { properties: { cfg: finalCfg } },
        else: {
          properties: {
            cfg: { type: "object", properties: { name: { type: "string" } } },
          },
          allOf: [
            {
              if: {
                properties: { mode: { const: "a" } },
                required: ["mode"],
              },
              then: { properties: { cfg: cfgFor("a") } },
              else: { properties: { cfg: cfgFor("mid") } },
            },
          ],
        },
      },
    ],
  }) as Schema;

const retypingCascadeData = {
  mode: "a",
  kind: { v: "k1" },
  cfg: { name: "a" },
};

function modeSwap(branchA: Schema, branchB: Schema): Schema {
  return {
    type: "object",
    properties: { mode: { type: "string", enum: ["a", "b"], default: "a" } },
    dependencies: {
      mode: {
        oneOf: [
          {
            ...branchA,
            properties: { mode: { const: "a" }, ...branchA.properties },
          },
          {
            ...branchB,
            properties: { mode: { const: "b" }, ...branchB.properties },
          },
        ],
      },
    },
  } as Schema;
}

async function renderAndSwap(schema: Schema, initialValue?: unknown) {
  const { form } = await renderFieldForm({ schema, initialValue });
  setValueAtPath(form, ["mode"], "b");
  await tick();
  return getValueSnapshot(form);
}

describe("RJSF #5464 parity", () => {
  test("object default", async () => {
    expect(
      await renderAndSwap(
        modeSwap(
          { properties: { cfg: cfgFor("a") } },
          { properties: { cfg: cfgFor("b") } }
        )
      )
    ).toEqual({ mode: "b", cfg: { name: "b" } });
  });

  test("merges the new branch's default with its leaf defaults", async () => {
    const cfgWithRatio = (name: string): Schema => ({
      type: "object",
      default: { name },
      properties: {
        name: { type: "string" },
        ratio: { type: "number", default: 0.5 },
      },
    });
    expect(
      await renderAndSwap(
        modeSwap(
          { properties: { cfg: cfgWithRatio("a") } },
          { properties: { cfg: cfgWithRatio("b") } }
        )
      )
    ).toEqual({ mode: "b", cfg: { name: "b", ratio: 0.5 } });
  });

  test("array default", async () => {
    const numsFor = (mode: string): Schema => ({
      type: "array",
      items: { type: "number" },
      default: [mode === "a" ? 1 : 2],
    });
    expect(
      await renderAndSwap(
        modeSwap(
          { properties: { nums: numsFor("a") } },
          { properties: { nums: numsFor("b") } }
        )
      )
    ).toEqual({ mode: "b", nums: [2] });
  });

  test("array default expanded to minItems", async () => {
    const numsFor = (mode: string): Schema => ({
      type: "array",
      items: { type: "number", default: 0 },
      minItems: 2,
      default: [mode === "a" ? 1 : 2],
    });
    expect(
      await renderAndSwap(
        modeSwap(
          { properties: { nums: numsFor("a") } },
          { properties: { nums: numsFor("b") } }
        )
      )
    ).toEqual({ mode: "b", nums: [2, 0] });
  });

  test("type change object -> array", async () => {
    expect(
      await renderAndSwap(
        modeSwap(
          { properties: { cfg: cfgFor("a") } },
          {
            properties: {
              cfg: { type: "array", items: { type: "string" }, default: ["x"] },
            },
          }
        )
      )
    ).toEqual({ mode: "b", cfg: ["x"] });
  });

  test("retypes a leaf inside the refill", async () => {
    expect(
      await renderAndSwap(
        modeSwap(
          {
            properties: {
              cfg: {
                type: "object",
                default: { name: "a", tags: "one" },
                properties: {
                  name: { type: "string" },
                  tags: { type: "string" },
                },
              },
            },
          },
          {
            properties: {
              cfg: {
                type: "object",
                default: { name: "b", tags: ["x"] },
                properties: {
                  name: { type: "string" },
                  tags: { type: "array", items: { type: "string" } },
                },
              },
            },
          }
        )
      )
    ).toEqual({ mode: "b", cfg: { name: "b", tags: ["x"] } });
  });

  test("retypes its only leaf", async () => {
    expect(
      await renderAndSwap(
        modeSwap(
          {
            properties: {
              cfg: {
                type: "object",
                default: { v: "x" },
                properties: { v: { type: "string" } },
              },
            },
          },
          {
            properties: {
              cfg: {
                type: "object",
                default: { v: 5 },
                properties: { v: { type: "number" } },
              },
            },
          }
        )
      )
    ).toEqual({ mode: "b", cfg: { v: 5 } });
  });

  test("new branch declares through its own default object", async () => {
    const schema = {
      type: "object",
      properties: {
        mode: { type: "string", enum: ["a", "b"], default: "a" },
        cfg: { type: "object", properties: { name: { type: "string" } } },
      },
      if: { properties: { mode: { const: "a" } } },
      then: { default: { cfg: { name: "a" } } },
      else: { default: { cfg: { name: "b" } } },
    } as Schema;
    expect(await renderAndSwap(schema)).toEqual({
      mode: "b",
      cfg: { name: "b" },
    });
  });

  test("anyOf selects no properties", async () => {
    const schema = {
      type: "object",
      properties: {
        mode: { type: "string", enum: ["a", "b"], default: "a" },
        other: { type: "string" },
      },
      if: { properties: { mode: { const: "a" } } },
      then: { properties: { cfg: cfgFor("a") } },
      else: { properties: { cfg: cfgFor("b") } },
      anyOf: [{ required: ["mode"] }, { required: ["other"] }],
    } as Schema;
    expect(await renderAndSwap(schema)).toEqual({
      mode: "b",
      cfg: { name: "b" },
    });
  });

  test("nested branch default under a oneOf that declares properties", async () => {
    const dietFor = (food: string): Schema => ({
      type: "object",
      default: { food },
      properties: { food: { type: "string" } },
    });
    const schema = {
      type: "object",
      properties: {
        m: {
          type: "object",
          properties: {
            animal: { type: "string", enum: ["Cat", "Fish"], default: "Fish" },
          },
          dependencies: {
            animal: {
              oneOf: [
                {
                  properties: {
                    animal: { const: "Cat" },
                    diet: dietFor("meat"),
                  },
                },
                {
                  properties: {
                    animal: { const: "Fish" },
                    diet: dietFor("worms"),
                  },
                },
              ],
            },
          },
        },
      },
      oneOf: [
        { title: "A", properties: { x: { type: "string" } } },
        { title: "B", properties: { y: { type: "string" } } },
      ],
    } as Schema;
    const { form } = await renderFieldForm({ schema });
    setValueAtPath(form, ["m", "animal"], "Cat");
    await tick();
    expect(getValueSnapshot(form)).toEqual({
      m: { animal: "Cat", diet: { food: "meat" } },
    });
  });

  test("puts the old value back where dropping collapses the branch", async () => {
    const schema = {
      type: "object",
      properties: {
        mode: { type: "string", enum: ["a", "b"], default: "a" },
        cfg: { type: "object", properties: { name: { type: "string" } } },
      },
      allOf: [
        {
          if: {
            properties: { mode: { const: "a" } },
            required: ["mode", "cfg"],
          },
          then: { properties: { cfg: cfgFor("a") } },
        },
        {
          if: {
            properties: { mode: { const: "b" } },
            required: ["mode", "cfg"],
          },
          then: { properties: { cfg: cfgFor("b") } },
        },
      ],
    } as Schema;
    expect(
      await renderAndSwap(schema, { mode: "a", cfg: { name: "a" } })
    ).toEqual({
      mode: "b",
      cfg: { name: "a" },
    });
  });

  test("keeps a sibling the dropped key's own dependency declares", async () => {
    const withCfg = (name: string): Schema => ({
      dependencies: {
        cfg: { properties: { cfg: cfgFor(name), extra: { type: "string" } } },
      },
    });
    const schema = {
      type: "object",
      properties: { mode: { type: "string", enum: ["a", "b"], default: "a" } },
      if: { properties: { mode: { const: "a" } } },
      then: withCfg("a"),
      else: withCfg("b"),
    } as Schema;
    expect(
      await renderAndSwap(schema, {
        mode: "a",
        cfg: { name: "a" },
        extra: "user text",
      })
    ).toEqual({
      mode: "b",
      extra: "user text",
      cfg: { name: "a" },
    });
  });

  test("applies a default that replacing another key brings into reach", async () => {
    const optsFor = (o: string): Schema => ({
      type: "object",
      default: { o },
      properties: { o: { type: "string" } },
    });
    const kindFor = (k: string): Schema => ({
      type: "string",
      enum: ["k1", "k2"],
      default: k,
    });
    const schema = {
      type: "object",
      properties: { mode: { type: "string", enum: ["a", "b"], default: "a" } },
      allOf: [
        {
          if: { properties: { mode: { const: "a" } } },
          then: { properties: { kind: kindFor("k1") } },
          else: { properties: { kind: kindFor("k2") } },
        },
        {
          if: { properties: { kind: { const: "k1" } } },
          then: { properties: { opts: optsFor("k1") } },
          else: { properties: { opts: optsFor("k2") } },
        },
      ],
    } as Schema;
    expect(await renderAndSwap(schema)).toEqual({
      mode: "b",
      kind: "k2",
      opts: { o: "k2" },
    });
  });

  test("resolves a replacement's own conditionals against the value written for it", async () => {
    const petFor = (branch: string): Schema => ({
      type: "object",
      default: { animal: "Fish" },
      properties: { animal: { type: "string", enum: ["Cat", "Fish"] } },
      if: { properties: { animal: { const: "Cat" } } },
      then: {
        properties: { diet: { type: "string", default: `${branch} meat` } },
      },
      else: {
        properties: { tank: { type: "string", default: `${branch} tank` } },
        required: ["tank"],
      },
    });
    const schema = {
      type: "object",
      properties: { mode: { type: "string", enum: ["a", "b"], default: "a" } },
      if: { properties: { mode: { const: "a" } } },
      then: { properties: { pet: petFor("a") } },
      else: { properties: { pet: petFor("b") } },
    } as Schema;
    expect(await renderAndSwap(schema)).toMatchObject({
      mode: "b",
      pet: { animal: "Fish", tank: "b tank" },
    });
  });

  test("keeps a value under a stubbed additional property", async () => {
    const extraFor = (tag: string): Schema => ({
      type: "object",
      default: { tag },
      properties: { tag: { type: "string" } },
    });
    // The branches describe `extra` through `patternProperties` so that
    // `mode`, which the dependency resolution leaves undeclared in the branch,
    // stubs to its own value's type instead of the additional properties
    // schema. The value under test is still held only because the data has it,
    // which is what makes it a stub.
    const branchFor = (tag: string): Schema => ({
      patternProperties: { "^extra$": extraFor(tag) },
      additionalProperties: true,
    });
    const schema = modeSwap(branchFor("a"), branchFor("b"));
    expect(
      await renderAndSwap(schema, { mode: "a", extra: { tag: "a" } })
    ).toEqual({
      mode: "b",
      extra: { tag: "a" },
    });
  });

  test("nested dependency two object levels down", async () => {
    const animalSchema = {
      type: "object",
      properties: {
        animal: { type: "string", enum: ["Cat", "Fish"], default: "Fish" },
      },
      dependencies: {
        animal: {
          oneOf: [
            {
              properties: {
                animal: { const: "Cat" },
                diet: {
                  type: "object",
                  default: { food: "meat" },
                  properties: { food: { type: "string" } },
                },
              },
            },
            {
              properties: {
                animal: { const: "Fish" },
                diet: {
                  type: "object",
                  default: { food: "worms" },
                  properties: { food: { type: "string" } },
                },
              },
            },
          ],
        },
      },
    } as Schema;
    const schema = {
      type: "object",
      properties: {
        outer: { type: "object", properties: { m: animalSchema } },
      },
    } as Schema;
    const { form } = await renderFieldForm({ schema });
    setValueAtPath(form, ["outer", "m", "animal"], "Cat");
    await tick();
    expect(getValueSnapshot(form)).toEqual({
      outer: { m: { animal: "Cat", diet: { food: "meat" } } },
    });
  });

  test("leaves a required object with no default of its own alone", async () => {
    const schema = modeSwap(
      { properties: { cfg: cfgFor("a") } },
      {
        required: ["cfg"],
        properties: {
          cfg: { type: "object", properties: { name: { type: "string" } } },
        },
      }
    );
    expect(await renderAndSwap(schema)).toEqual({
      mode: "b",
      cfg: { name: "a" },
    });
  });

  test("leaves a required array with no default of its own alone", async () => {
    const numsFor = (defaults: boolean): Schema => ({
      type: "array",
      items: { type: "number" },
      ...(defaults && { default: [1, 2] }),
    });
    const schema = modeSwap(
      { properties: { nums: numsFor(true) } },
      { required: ["nums"], properties: { nums: numsFor(false) } }
    );
    expect(await renderAndSwap(schema)).toEqual({
      mode: "b",
      nums: [1, 2],
    });
  });

  test("leaves a value alone where only the new branch's leaf defaults differ", async () => {
    const cfgWithLeaves = (host?: string, port?: number): Schema => ({
      type: "object",
      properties: {
        port: {
          type: "number",
          ...(port !== undefined && { default: port }),
        },
        host: {
          type: "string",
          ...(host !== undefined && { default: host }),
        },
      },
    });
    const schema = modeSwap(
      { properties: { cfg: cfgWithLeaves(undefined, 80) } },
      { properties: { cfg: cfgWithLeaves("h") } }
    );
    expect(await renderAndSwap(schema)).toEqual({
      mode: "b",
      cfg: { port: 80, host: "h" },
    });
  });

  test("leaves an array the new branch only refills to its minItems alone", async () => {
    const tagsWithMin = (minItems: number): Schema => ({
      type: "array",
      items: { type: "string", default: "x" },
      minItems,
    });
    const schema = modeSwap(
      { properties: { tags: tagsWithMin(2) } },
      { properties: { tags: tagsWithMin(1) } }
    );
    expect(await renderAndSwap(schema)).toEqual({
      mode: "b",
      tags: ["x", "x"],
    });
  });

  test("leaves a required boolean the old branch declared no default for alone", async () => {
    const agreeFor = (defaults: boolean): Schema => ({
      type: "boolean",
      ...(defaults && { default: true }),
    });
    const schema = modeSwap(
      {
        required: ["agree"],
        properties: { agree: agreeFor(false) },
      },
      {
        required: ["agree"],
        properties: { agree: agreeFor(true) },
      }
    );
    // `false` is what the form computes for a required boolean, so the value is
    // supplied the way the old branch's fill computes it rather than as a
    // declaration the branch makes.
    expect(await renderAndSwap(schema, { mode: "a", agree: false })).toEqual({
      mode: "b",
      agree: false,
    });
  });

  test("leaves a required array the old branch declared no default for alone", async () => {
    const numsFor = (defaults: boolean): Schema => ({
      type: "array",
      items: { type: "number" },
      ...(defaults && { default: [7] }),
    });
    const schema = modeSwap(
      { required: ["nums"], properties: { nums: numsFor(false) } },
      { required: ["nums"], properties: { nums: numsFor(true) } }
    );
    expect(await renderAndSwap(schema)).toEqual({
      mode: "b",
      nums: [],
    });
  });

  test("never looks at a property both branches declare identically", async () => {
    const meta: Schema = {
      type: "object",
      readOnly: true,
      default: { createdBy: "placeholder" },
      properties: { createdBy: { type: "string" } },
    };
    const schema = modeSwap(
      { properties: { cfg: cfgFor("a"), meta } },
      { properties: { cfg: cfgFor("b"), meta } }
    );
    expect(
      await renderAndSwap(schema, {
        mode: "a",
        cfg: { name: "a" },
        meta: { createdBy: "server" },
      })
    ).toEqual({
      mode: "b",
      cfg: { name: "b" },
      meta: { createdBy: "server" },
    });
  });

  test("swaps alongside a property one branch declares as a boolean subschema", async () => {
    const schema = modeSwap(
      {
        properties: {
          cfg: cfgFor("a"),
          anything: true,
          unvalued: { type: "string" },
        },
      },
      {
        properties: {
          cfg: cfgFor("b"),
          anything: { type: "string" },
          unvalued: true,
        },
      }
    );
    expect(
      await renderAndSwap(schema, { mode: "a", anything: "kept" })
    ).toEqual({
      mode: "b",
      cfg: { name: "b" },
      anything: "kept",
    });
  });

  // The second hop retypes the key the first hop replaced: the `kind` written
  // for the newly selected branch selects a `cfg` that the refill written while
  // `kind` was gone no longer fits. Each refill is judged at its own key, by
  // the schema that describes it once the data has settled against the one it
  // was written under, so this one is dropped again and the fill answers the
  // schema that rejected it.
  test("replaces a refill that a later iteration retypes", async () => {
    const { form } = await renderFieldForm({
      schema: retypingCascade({ type: "string", default: "final" }),
      initialValue: retypingCascadeData,
    });
    setValueAtPath(form, ["mode"], "b");
    await tick();
    expect(getValueSnapshot(form)).toEqual({
      mode: "b",
      kind: { v: "k2" },
      cfg: "final",
    });
  });

  // The same two hops, with nothing declared for `cfg` under the schema the
  // second hop retypes it to, so no fill answers the key. What the drop
  // recorded is no answer either: it is the value the swap moved away from,
  // two schema movements out of date, and putting it back would settle the key
  // on an object a string schema rejects.
  test("leaves a key empty when the schema that rejected its refill declares nothing", async () => {
    const { form } = await renderFieldForm({
      schema: retypingCascade({ type: "string" }),
      initialValue: retypingCascadeData,
    });
    setValueAtPath(form, ["mode"], "b");
    await tick();
    expect(getValueSnapshot(form)).toEqual({
      mode: "b",
      kind: { v: "k2" },
    });
  });

  // `retrieveSchema()` resolves the conditionals of the schema it is handed, so
  // a swap decided inside a property leaves the root schema the same object
  // from one iteration to the next. A refill is judged at its own key for that
  // reason: judged by the root pair, a replacement one level down would be
  // judged by two schemas that cannot have moved.
  test("judges a replacement at its own level when the swap is decided inside a property", async () => {
    // `mode` swaps `kind` and declares `cfg`'s value through the branch's own
    // `default`, while `kind.v` decides `cfg`'s type — so no state of this
    // form declares `cfg` twice, and each one is valid on its own terms.
    const wrapped: Schema = {
      type: "object",
      properties: {
        mode: { type: "string", enum: ["a", "b"], default: "a" },
        kind: { type: "object", properties: { v: { type: "string" } } },
      },
      dependencies: {
        mode: {
          oneOf: [
            {
              properties: { mode: { const: "a" }, kind: kindFor("k1") },
              default: { cfg: { name: "a" } },
            },
            {
              properties: { mode: { const: "b" }, kind: kindFor("k2") },
              default: { cfg: { name: "mid" } },
            },
          ],
        },
      },
      allOf: [
        {
          if: {
            properties: {
              kind: { properties: { v: { const: "k2" } }, required: ["v"] },
            },
            required: ["kind"],
          },
          then: { properties: { cfg: { type: "string", default: "final" } } },
          else: {
            properties: {
              cfg: {
                type: "object",
                properties: { name: { type: "string" } },
              },
            },
          },
        },
      ],
    } as Schema;
    const { form } = await renderFieldForm({
      schema: { type: "object", properties: { wrap: wrapped } } as Schema,
      initialValue: {
        wrap: { mode: "a", kind: { v: "k1" }, cfg: { name: "a" } },
      },
    });
    setValueAtPath(form, ["wrap", "mode"], "b");
    await tick();
    expect(getValueSnapshot(form)).toEqual({
      wrap: { mode: "b", kind: { v: "k2" } },
    });
  });
});
