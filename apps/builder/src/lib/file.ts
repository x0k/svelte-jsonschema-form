import { fileOpen, fileSave } from "browser-fs-access";

export const JSON_MIME_TYPE = "text/json";

export const JSON_FILE_EXTENSION = "json";

export function createJSONBlob(data: string): Blob {
  return new Blob([data], { type: JSON_MIME_TYPE });
}

export async function blobSave(fileName: string, blob: Blob): Promise<void> {
  await fileSave(blob, {
    fileName,
  });
}

export interface BlobOpenOptions {
  /** Acceptable file extensions. Defaults to `[""]`. */
  extensions?: string[];
  /** Suggested file description. Defaults to `""`. */
  description?: string;
  /** Acceptable MIME types. Defaults to `[]`. */
  mimeTypes?: string[];
}

export async function blobOpen(options?: BlobOpenOptions): Promise<Blob> {
  return await fileOpen(options);
}

export async function parseJSONBlob<R = unknown>(blob: Blob): Promise<R> {
  return JSON.parse(await blob.text()) as R;
}
