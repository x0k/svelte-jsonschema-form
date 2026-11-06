import { getOrInsertComputed, type MapLike } from "./map.js";

export function memoize<Arg, Return>(
  cache: MapLike<Arg, Return>,
  func: (arg: Arg) => Return
): (arg: Arg) => Return {
  return (arg: Arg) => getOrInsertComputed(cache, arg, func);
}

export const weakMemoize = memoize as <Arg extends object, Return>(
  cache: WeakMap<Arg, Return>,
  fn: (arg: Arg) => Return
) => (arg: Arg) => Return;
