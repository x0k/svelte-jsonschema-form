import type { Draft2020, Precompiled } from "../codegen/index.ts";
import {
  type PlaygroundValidator,
  type PlaygroundValidator2,
} from "./model.ts";
import {
  toDraft07,
  toDraft2020,
  toFactory,
  toPrecompiledDraft07,
  type ValidatorFactory,
  type ValidatorFactoryOptions,
} from "./validator-factory.ts";

const DRAFT_07: Record<
  Extract<PlaygroundValidator, Precompiled<false> & Draft2020<false>>["name"],
  ValidatorFactory
> = {
  ajv8: toDraft07(() => import("./validator-factories/ajv.ts")),
  cfworker: toDraft07(() => import("./validator-factories/cfworker.ts")),
  schemasafe: toDraft07(() => import("./validator-factories/schemasafe.ts")),
  ata: toDraft07(() => import("./validator-factories/ata.ts")),
  zod4: toFactory(() => import("./validator-factories/zod4.ts")),
  valibot: toFactory(() => import("./validator-factories/valibot.ts")),
};

const DRAFT_2020: Record<
  Extract<PlaygroundValidator, Draft2020<true> & Precompiled<false>>["name"],
  ValidatorFactory
> = {
  ajv8: toDraft2020(() => import("./validator-factories/ajv.ts")),
  cfworker: toDraft2020(() => import("./validator-factories/cfworker.ts")),
  schemasafe: toDraft2020(() => import("./validator-factories/schemasafe.ts")),
  ata: toDraft2020(() => import("./validator-factories/ata.ts")),
};

const PRECOMPILED_DRAFT_07: Record<
  Extract<PlaygroundValidator, Precompiled<true> & Draft2020<false>>["name"],
  ValidatorFactory
> = {
  ajv8: toPrecompiledDraft07(
    () => import("./validator-factories/ajv-precompiled.ts")
  ),
  schemasafe: toPrecompiledDraft07(
    () => import("./validator-factories/schemasafe-precompiled.ts")
  ),
  hyperjump: toPrecompiledDraft07(
    () => import("./validator-factories/hyperjump-precompiled.ts")
  ),
  ata: toPrecompiledDraft07(
    () => import("./validator-factories/ata-precompiled.ts")
  ),
};

export function playgroundValidator<T>(options: ValidatorFactoryOptions) {
  const v: PlaygroundValidator2 = options.validator;
  const factory = v.precompiled
    ? PRECOMPILED_DRAFT_07[v.name]
    : v.draft2020
      ? DRAFT_2020[v.name]
      : DRAFT_07[v.name];
  return factory<T>(options);
}
