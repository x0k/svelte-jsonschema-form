import { fromRecord } from "@sjsf/form/lib/resolver";
import { createForm } from '@sjsf/form';

import * as defaults from "@/lib/form/defaults";

const form = createForm({
  ...defaults,
  schema: {},
  extraUiOptions: fromRecord({
    titleAttributes: {
      style: "font-weight: bolder;",
    },
  }),
});
