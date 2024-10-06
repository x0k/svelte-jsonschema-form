import "scheduler-polyfill";

const CHUNK_SIZE = 8192;

export async function dataURLtoBlob(signal: AbortSignal, dataURILike: string) {
  if (!dataURILike.startsWith("data:")) {
    throw new Error("File is invalid: URI must be a dataURI");
  }
  const dataURI = dataURILike.slice(5);
  const splitted = dataURI.split(";base64,");
  if (splitted.length !== 2) {
    throw new Error("File is invalid: dataURI must be base64");
  }
  const [media, base64] = splitted;
  const [mime, ...mediaParams] = media.split(";");
  const type = mime || "";

  const name = decodeURI(
    mediaParams
      .map((param) => param.split("="))
      .find(([key]) => key === "name")?.[1] || "unknown"
  );

  try {
    const binary = atob(base64);
    scheduler.yield({ signal });
    const array = new Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      if (i % CHUNK_SIZE === 0) {
        scheduler.yield({ signal });
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
