import { createForm } from "@sjsf/form";
import { fromRecord } from "@sjsf/form/lib/resolver";

import * as defaults from "@/lib/sjsf/defaults";

const form = createForm({
  ...defaults,
  schema: {},
  extraUiOptions: fromRecord({
    titleAttributes: {
      style: "font-weight: bolder;",
    },
  }),
});
