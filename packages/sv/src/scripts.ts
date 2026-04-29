import { isEndsWithPrecompiled, type Context } from "./model.js";
import { transforms } from "./sv-utils.js";

export function scriptsFolder({
  options,
  isTs,
  directory,
  language,
  sv,
}: Context) {
  const { validatorWithSuffix } = options;
  if (!isEndsWithPrecompiled(validatorWithSuffix)) {
    return;
  }

  sv.file(
    `scripts/compile-validators.${language}`,
    transforms.script(({ ast, comments, js }) => {
      validatorWithSuffix;
    }),
  );
}
