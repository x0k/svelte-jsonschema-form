import type { WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    fileWidget: WidgetCommonProps<FileList> & {
      multiple: boolean;
      loading: boolean;
      processing: boolean;
    };
  }
  interface ComponentBindings {
    fileWidget: "value";
  }
}
