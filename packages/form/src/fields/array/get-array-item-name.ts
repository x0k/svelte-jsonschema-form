import type { Config } from "@/form/index.js";

export function getArrayItemName(arrayConfig: Config, index: number) {
  return `${arrayConfig.name}__${index}`;
}

export function titleWithIndex(arrayConfig: Config, index: number) {
  return `${arrayConfig._title}-${index + 1}`;
}
