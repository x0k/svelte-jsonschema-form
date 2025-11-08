import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

export function encodeJson<T>(data: T) {
  return compressToEncodedURIComponent(JSON.stringify(data));
}

export function decodeJson<T>(data: string): T {
  return JSON.parse(decompressFromEncodedURIComponent(data));
}
