import {
  defineMetadata,
  definePreset,
  FormPresetCategory,
  PresetTag,
  jsonSchema,
  jsonUiSchema,
  jsonValue,
} from "../form-preset.ts";

export const meta = defineMetadata({
  category: FormPresetCategory.UiCustomization,
  schema: { type: "json", draft2020: false },
  title: "Ordering",
  description:
    "Field ordering and rearrangement using ui-schema order configuration.",
  tags: [PresetTag.Layout],
});

export default definePreset({
  schema: jsonSchema({
    title: "A registration form",
    type: "object",
    required: ["firstName", "lastName"],
    properties: {
      password: {
        type: "string",
        title: "Password",
      },
      lastName: {
        type: "string",
        title: "Last name",
      },
      bio: {
        type: "string",
        title: "Bio",
      },
      firstName: {
        type: "string",
        title: "First name",
      },
      age: {
        type: "integer",
        title: "Age",
      },
    },
  }),
  uiSchema: jsonUiSchema({
    "ui:options": {
      order: ["firstName", "lastName", "*", "password"],
    },
    // age: {
    //   'ui:widget': 'updown',
    // },
    bio: {
      "ui:components": {
        textWidget: "textareaWidget",
      },
    },
    password: {
      "ui:options": {
        text: {
          type: "password",
        },
        flowbite3Text: {
          type: "password",
        },
        shadcn4Text: {
          type: "password",
        },
      },
    },
  }),
  initialValue: jsonValue({
    firstName: "Chuck",
    lastName: "Norris",
    age: 75,
    bio: "Roundhouse kicking asses since 1940",
    password: "noneed",
  }),
});
