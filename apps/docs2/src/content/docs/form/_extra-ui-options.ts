import { fromRecord } from "@sjsf/form/lib/resolver";

import { createMyForm } from "@/components/my-form";

const form = createMyForm({
  schema: {},
  extraUiOptions: fromRecord({
    titleAttributes: {
      style: "font-weight: bolder;",
    },
  }),
});
