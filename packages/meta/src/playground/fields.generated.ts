import aggregatedField from "@sjsf/form/fields/extra/aggregated.svelte";
import "@sjsf/form/fields/extra/aggregated.svelte";
import arrayFilesField from "@sjsf/form/fields/extra/array-files.svelte";
import "@sjsf/form/fields/extra/array-files.svelte";
import arrayNativeFilesField from "@sjsf/form/fields/extra/array-native-files.svelte";
import "@sjsf/form/fields/extra/array-native-files.svelte";
import arrayTagsField from "@sjsf/form/fields/extra/array-tags.svelte";
import "@sjsf/form/fields/extra/array-tags.svelte";
import booleanSelectField from "@sjsf/form/fields/extra/boolean-select.svelte";
import "@sjsf/form/fields/extra/boolean-select.svelte";
import enumField from "@sjsf/form/fields/extra/enum.svelte";
import "@sjsf/form/fields/extra/enum.svelte";
import fileField from "@sjsf/form/fields/extra/file.svelte";
import "@sjsf/form/fields/extra/file.svelte";
import filesField from "@sjsf/form/fields/extra/files.svelte";
import "@sjsf/form/fields/extra/files.svelte";
import multiEnumField from "@sjsf/form/fields/extra/multi-enum.svelte";
import "@sjsf/form/fields/extra/multi-enum.svelte";
import nativeFileField from "@sjsf/form/fields/extra/native-file.svelte";
import "@sjsf/form/fields/extra/native-file.svelte";
import nativeFilesField from "@sjsf/form/fields/extra/native-files.svelte";
import "@sjsf/form/fields/extra/native-files.svelte";
import objectKeyEnumField from "@sjsf/form/fields/extra/object-key-enum.svelte";
import "@sjsf/form/fields/extra/object-key-enum.svelte";
import remoteEnumField from "@sjsf/form/fields/extra/remote-enum.svelte";
import "@sjsf/form/fields/extra/remote-enum.svelte";
import tagsField from "@sjsf/form/fields/extra/tags.svelte";
import "@sjsf/form/fields/extra/tags.svelte";
import unknownNativeFileField from "@sjsf/form/fields/extra/unknown-native-file.svelte";
import "@sjsf/form/fields/extra/unknown-native-file.svelte";
export const fields = {
  aggregatedField,
  arrayFilesField,
  arrayNativeFilesField,
  arrayTagsField,
  booleanSelectField,
  enumField,
  fileField,
  filesField,
  multiEnumField,
  nativeFileField,
  nativeFilesField,
  objectKeyEnumField,
  remoteEnumField,
  tagsField,
  unknownNativeFileField
} as const