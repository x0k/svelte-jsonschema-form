import type { Path } from "@/core/index.js";
import { DEFAULT_ID_PREFIX, type FormIdBuilder, type Id } from "@/form/main.js";

export interface IdOptions {
  idPrefix?: string;
  propertySeparator?: string;
  indexSeparator?: string;
  pseudoSeparator?: string;
}

export const DEFAULT_PROPERTY_SEPARATOR = ".";
export const DEFAULT_INDEX_SEPARATOR = "@";
export const DEFAULT_PSEUDO_SEPARATOR = "::";

export function createFormIdBuilder({
  idPrefix = DEFAULT_ID_PREFIX,
  indexSeparator = DEFAULT_INDEX_SEPARATOR,
  propertySeparator = DEFAULT_PROPERTY_SEPARATOR,
  pseudoSeparator = DEFAULT_PSEUDO_SEPARATOR,
}: IdOptions = {}): FormIdBuilder {
  function joinPath(path: Path) {
    let str = "";
    for (let i = 0; i < path.length; i++) {
      const p = path[i]!;
      str += (typeof p === "string" ? propertySeparator : indexSeparator) + p;
    }
    return str;
  }
  return {
    fromPath: (path: Path) => `${idPrefix}${joinPath(path)}` as Id,
    toPath: (id) => {
      if (!id.startsWith(idPrefix)) {
        throw new Error(
          `Invalid id "${id}", expected to be started with "${idPrefix}"`
        );
      }
      const path: Path = [];
      id = id.substring(idPrefix.length) as Id;
      if (id.length === 0) {
        return path;
      }
      let i = 0;
      let lastSep: string | undefined;
      let lastSepIndex = 0;
      const get = () => {
        const token = id.substring(lastSepIndex, i);
        switch (lastSep) {
          case propertySeparator:
            return token;
          case indexSeparator:
            return Number(token);
          default:
            throw new Error(`Unexpected last separator "${lastSep}"`);
        }
      };
      while (i < id.length) {
        let nextSep: string | undefined;
        if (id.startsWith(propertySeparator, i)) {
          nextSep = propertySeparator;
        } else if (id.startsWith(indexSeparator, i)) {
          nextSep = indexSeparator;
        } else if (id.startsWith(pseudoSeparator, i)) {
          nextSep = pseudoSeparator;
        }
        if (nextSep !== undefined) {
          if (nextSep === pseudoSeparator) {
            break;
          }
          if (lastSep !== undefined) {
            path.push(get());
          }
          lastSep = nextSep;
          i += nextSep.length;
          lastSepIndex = i;
          continue;
        }
        i++;
      }
      path.push(get());
      return path;
    },
    propertyId: (parentId, property) =>
      `${parentId}${propertySeparator}${property}` as Id,
    itemId: (parentId, index) => `${parentId}${indexSeparator}${index}` as Id,
    pseudoId: (instanceId, element) =>
      `${instanceId}${pseudoSeparator}${element}` as Id,
  };
}
