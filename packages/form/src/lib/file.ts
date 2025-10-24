// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/dataURItoBlob.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.
import { BROWSER } from "esm-env";

import type { SchedulerYield } from "./scheduler.js";

export interface NamedBlob {
  name: string;
  blob: Blob;
}

export type DataURLToBlob = (
  signal: AbortSignal,
  dataURILike: string
) => Promise<NamedBlob>;

const NAME_PREFIX = "name=";
const DATA_PREFIX = "data:";
const BASE64_SEPARATOR = ";base64,";
const CHUNK_SIZE = 8192;

function extractPartsFromDataURL(dataUrl: string, defaultFileName = "unknown") {
  if (!dataUrl.startsWith(DATA_PREFIX)) {
    throw new Error("File is invalid: URI must be a dataURI");
  }
  const dataURI = dataUrl.slice(DATA_PREFIX.length);
  const splitted = dataURI.split(BASE64_SEPARATOR);
  if (splitted.length !== 2) {
    throw new Error("File is invalid: dataURI must be base64");
  }
  const [media, base64content] = splitted as [string, string];
  const mediaParts = media.split(";");
  const data = {
    mime: mediaParts[0]!,
    name: defaultFileName,
    base64content,
  };
  if (mediaParts.length > 1) {
    const namePart = mediaParts.slice(1).find((p) => p.startsWith(NAME_PREFIX));
    if (namePart !== undefined) {
      data.name = decodeURIComponent(namePart.substring(NAME_PREFIX.length));
    }
  }
  return data;
}

export function createDataURLtoBlob(
  schedulerYield: SchedulerYield,
  chunkSize = CHUNK_SIZE
): DataURLToBlob {
  return BROWSER
    ? async (signal, dataUrl) => {
        const { mime, base64content, name } = extractPartsFromDataURL(dataUrl);
        try {
          const binary = atob(base64content);
          await schedulerYield({ signal });
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            if (i % chunkSize === 0) {
              await schedulerYield({ signal });
            }
            array[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([array], { type: mime });
          return { blob, name };
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            throw error;
          }
          throw new Error("File is invalid: " + (error as Error).message);
        }
      }
    : async (signal, dataUrl) => {
        const { mime, name, base64content } = extractPartsFromDataURL(dataUrl);
        const chunks: Buffer<ArrayBuffer>[] = [];
        for (let i = 0; i < base64content.length; i += chunkSize) {
          const chunkBase64 = base64content.slice(i, i + chunkSize);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          chunks.push(Buffer.from(chunkBase64, "base64"));
          await schedulerYield({ signal });
        }
        const blob = new Blob(chunks, { type: mime });
        return { blob, name };
      };
}

function base64SeparatorWithNamePart(name: string) {
  return `;${NAME_PREFIX}${encodeURIComponent(name)}${BASE64_SEPARATOR}`;
}

function browserFileToDataURL(signal: AbortSignal, file: File) {
  const reader = new FileReader();
  const onAbort = () => {
    reader.abort();
  };
  signal.addEventListener("abort", onAbort);
  return new Promise<string>((resolve, reject) => {
    reader.onerror = reject;
    reader.onabort = reject;
    reader.onload = (event) => {
      let result = event.target?.result;
      if (typeof result !== "string") {
        reject(new Error("File is invalid: result must be a string"));
        return;
      }
      result = result.replace(
        BASE64_SEPARATOR,
        base64SeparatorWithNamePart(file.name)
      );
      resolve(result);
    };
    reader.readAsDataURL(file);
  }).finally(() => {
    signal.removeEventListener("abort", onAbort);
  });
}

async function nodeFileToDataURL(
  signal: AbortSignal,
  file: File
): Promise<string> {
  const buffer = await file.arrayBuffer();
  if (signal.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const base64 = Buffer.from(buffer).toString("base64");
  const mime = file.type || "application/octet-stream";
  return `${DATA_PREFIX}${mime}${base64SeparatorWithNamePart(file.name)}${base64}`;
}

export const fileToDataURL = BROWSER ? browserFileToDataURL : nodeFileToDataURL;
