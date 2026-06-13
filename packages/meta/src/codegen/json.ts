import { transforms } from "@sveltejs/sv-utils";
import { isRecordEmpty } from "@sjsf/form/lib/object";

export function createJsonFile<T>(content: T) {
  return transforms.json(({ data }) => {
    if (isRecordEmpty(data)) {
      Object.assign(data, content);
    }
  });
}
