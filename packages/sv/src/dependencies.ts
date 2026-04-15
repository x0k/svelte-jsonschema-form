import {
  iconSetDependencies,
  isInternalValidator,
  isSubTheme,
  themeDependencies,
  themeParent,
  validatorDependencies,
} from "meta";

import type { Context } from "./model.js";

export function dependencies({ sv, options }: Context) {
  const seen = new Set<string>();
  function setDependencies(deps: Iterable<[string, string]>) {
    for (const [name, version] of deps) {
      if (seen.has(name)) {
        continue;
      }
      seen.add(name);
      sv.dependency(name, version);
    }
  }
  setDependencies(
    themeDependencies(
      isSubTheme(options.theme) ? themeParent(options.theme) : options.theme,
    ),
  );
  if (!isInternalValidator(options.validator)) {
    setDependencies(validatorDependencies(options.validator));
  }
  if (options.icons !== "none") {
    setDependencies(iconSetDependencies(options.icons));
  }
}
