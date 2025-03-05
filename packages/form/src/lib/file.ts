// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/dataURItoBlob.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.
import type { SchedulerYield } from "./scheduler.js";

const CHUNK_SIZE = 8192;

export interface NamedBlob {
  name: string;
  blob: Blob;
}

export type DataURLToBlob = (
  signal: AbortSignal,
  dataURILike: string
) => Promise<NamedBlob>;

export function createDataURLtoBlob(
  schedulerYield: SchedulerYield
): DataURLToBlob {
  return async (signal, dataURILike) => {
    if (!dataURILike.startsWith("data:")) {
      throw new Error("File is invalid: URI must be a dataURI");
    }
    const dataURI = dataURILike.slice(5);
    const splitted = dataURI.split(";base64,");
    if (splitted.length !== 2) {
      throw new Error("File is invalid: dataURI must be base64");
    }
    const [media, base64] = splitted as [string, string];
    const [mime, ...mediaParams] = media.split(";");
    const type = mime || "";

    const name = decodeURI(
      mediaParams
        .map((param) => param.split("="))
        .find(([key]) => key === "name")?.[1] || "unknown"
    );

    try {
      const binary = atob(base64);
      await schedulerYield({ signal });
      const array = new Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        if (i % CHUNK_SIZE === 0) {
          await schedulerYield({ signal });
        }
        array[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([new Uint8Array(array)], { type });
      return { blob, name };
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }
      throw new Error("File is invalid: " + (error as Error).message);
    }
  };
}

function addNameToDataURL(dataURL: string, name: string) {
  return dataURL.replace(";base64", `;name=${encodeURIComponent(name)};base64`);
}

export function fileToDataURL(signal: AbortSignal, file: File) {
  const reader = new FileReader();
  const onAbort = () => {
    reader.abort();
  };
  signal.addEventListener("abort", onAbort);
  return new Promise<string>((resolve, reject) => {
    reader.onerror = reject;
    reader.onabort = reject;
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result !== "string") {
        reject(new Error("File is invalid: result must be a string"));
        return;
      }
      resolve(addNameToDataURL(result, file.name));
    };
    reader.readAsDataURL(file);
  }).finally(() => {
    signal.removeEventListener("abort", onAbort);
  });
}
