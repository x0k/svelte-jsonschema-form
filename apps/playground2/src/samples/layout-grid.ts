import type { UiOptions, UiSchema, UiSchemaRef } from "@sjsf/form";

import type { Sample } from "@/core/index.js";

function propertyStyles(
  style: string,
  layouts?: UiOptions["layouts"]
): UiSchema {
  return {
    "ui:options": {
      layouts: {
        ...layouts,
        "object-property": {
          style,
        },
      },
    },
  };
}

function ref($ref: string): UiSchemaRef {
  return {
    $ref,
  };
}

const transparent: UiSchema = {
  "ui:components": {
    layout: "transparentLayout",
  },
  "ui:options": {
    hideTitle: true,
  },
};

export default {
  resolver: "compat",
  schema: {
    type: "object",
    properties: {
      person: {
        title: "Person Info",
        $ref: "#/definitions/Person",
      },
      employment: {
        title: "Employment",
        discriminator: {
          propertyName: "job_type",
        },
        oneOf: [
          {
            $ref: "#/definitions/Company",
          },
          {
            $ref: "#/definitions/Education",
          },
          {
            $ref: "#/definitions/Other",
          },
        ],
      },
    },
    definitions: {
      PersonName: {
        type: "object",
        properties: {
          first: {
            title: "First Name",
            minLength: 1,
            maxLength: 200,
            type: "string",
          },
          middle: {
            title: "Middle Name",
            minLength: 1,
            maxLength: 200,
            type: "string",
          },
          last: {
            title: "Last Name",
            minLength: 1,
            maxLength: 1000,
            type: "string",
          },
        },
        required: ["first", "last"],
      },
      Race: {
        title: "Race",
        type: "array",
        items: {
          type: "string",
          oneOf: [
            {
              const: "native_american",
              title: "American Indian / Alaska Native",
            },
            {
              const: "asian",
              title: "Asian",
            },
            {
              const: "black",
              title: "Black / African American",
            },
            {
              const: "pacific_islander",
              title: "Native Hawaiian / Other Pacific Islander",
            },
            {
              const: "white",
              title: "White",
            },
          ],
        },
        uniqueItems: true,
      },
      Person: {
        type: "object",
        properties: {
          name: {
            $ref: "#/definitions/PersonName",
          },
          birth_date: {
            title: "Date of Birth",
            type: "string",
            format: "date",
          },
          race: {
            title: "Race",
            description: "(Check all that apply)",
            $ref: "#/definitions/Race",
          },
          address: {
            title: "Address",
            $ref: "#/definitions/Address",
          },
        },
        required: ["name", "birth_date", "race", "address"],
      },
      StateAbrv: {
        title: "StateAbrv",
        enum: [
          "AL",
          "AK",
          "AS",
          "AZ",
          "AR",
          "CA",
          "CO",
          "CT",
          "DE",
          "DC",
          "FL",
          "GA",
          "GU",
          "HI",
          "ID",
          "IL",
          "IN",
          "IA",
          "KS",
          "KY",
          "LA",
          "ME",
          "MD",
          "MA",
          "MI",
          "MN",
          "MS",
          "MO",
          "MT",
          "NE",
          "NV",
          "NH",
          "NJ",
          "NM",
          "NY",
          "NC",
          "ND",
          "MP",
          "OH",
          "OK",
          "OR",
          "PA",
          "PR",
          "RI",
          "SC",
          "SD",
          "TN",
          "TX",
          "UT",
          "VT",
          "VA",
          "VI",
          "WA",
          "WV",
          "WI",
          "WY",
        ],
        type: "string",
      },
      Address: {
        type: "object",
        properties: {
          line_1: {
            title: "Address",
            minLength: 1,
            maxLength: 200,
            type: "string",
          },
          line_2: {
            title: "Address 2",
            minLength: 1,
            maxLength: 200,
            type: "string",
          },
          city: {
            title: "City",
            minLength: 1,
            maxLength: 50,
            type: "string",
          },
          state: {
            title: "State",
            $ref: "#/definitions/StateAbrv",
          },
          postal_code: {
            title: "ZIP Code",
            pattern: "^\\d{5}(?:[-\\s]\\d{4})?$",
            type: "string",
          },
        },
        required: ["line_1", "city", "state", "postal_code"],
      },
      Location: {
        type: "object",
        properties: {
          city: {
            title: "City",
            type: "string",
          },
          state: {
            title: "State",
            $ref: "#/definitions/StateAbrv",
          },
        },
        required: ["city", "state"],
      },
      Company: {
        type: "object",
        properties: {
          job_type: {
            title: "Company",
            default: "company",
            enum: ["company"],
            type: "string",
          },
          business: {
            title: "Company Name",
            type: "string",
          },
          title: {
            title: "Job Title",
            type: "string",
          },
          location: {
            $ref: "#/definitions/Location",
          },
        },
        required: ["job_type", "business", "location"],
      },
      Education: {
        type: "object",
        properties: {
          job_type: {
            title: "Education",
            default: "education",
            enum: ["education"],
            type: "string",
          },
          district: {
            title: "District Name",
            type: "string",
          },
          school: {
            title: "School Name",
            type: "string",
          },
          title: {
            title: "Job Title",
            type: "string",
          },
          location: {
            $ref: "#/definitions/Location",
          },
        },
        required: ["job_type", "school", "location"],
      },
      Other: {
        type: "object",
        properties: {
          job_type: {
            title: "Other",
            default: "other",
            enum: ["other"],
            type: "string",
          },
          description: {
            title: "Describe your job",
            type: "string",
          },
        },
        required: ["job_type", "description"],
      },
    },
  },
  uiSchema: {
    "ui:definitions": {
      oneSecond: propertyStyles("grid-column: span 6;"),
      oneThird: propertyStyles("grid-column: span 4;"),
      oneFourth: propertyStyles("grid-column: span 3;"),
      jobTitle: {
        "ui:options": {
          layouts: {
            "object-property": {
              style: "display: none;",
            },
          },
        },
      },
    },
    "ui:options": {
      title: "Person info",
      layouts: {
        "object-properties": {
          style:
            "display: grid; grid-template-columns: repeat(12, 1fr); gap: 1rem;",
        },
      },
    },
    person: {
      ...transparent,
      name: {
        ...transparent,
        first: ref("oneThird"),
        middle: ref("oneThird"),
        last: ref("oneThird"),
      },
      birth_date: ref("oneThird"),
      race: propertyStyles("grid-column: 5/13;", {
        "field-content": {
          style: "display: flex; flex-direction: column; gap: 0.3rem;",
        },
      }),
      address: {
        ...transparent,
        line_1: ref("oneSecond"),
        line_2: ref("oneSecond"),
        city: ref("oneSecond"),
        state: ref("oneFourth"),
        postal_code: ref("oneFourth"),
      },
    },
    employment: {
      "ui:components": {
        selectWidget: "radioWidget",
        layout: "transparentLayout",
      },
      "ui:options": {
        layouts: {
          "multi-field-controls": {
            style:
              "grid-area: 3/7/4/13; display: flex; flex-direction: row; gap: 0.5rem;",
          },
        },
      },
      combinationFieldOptionSelector: {
        "ui:options": {
          shadcn4RadioGroup: {
            style: "grid-template-columns: repeat(3, 1fr);",
          },
        },
      },
      oneOf: [
        {
          ...transparent,
          job_type: ref("jobTitle"),
          business: propertyStyles("grid-area: 4/7/5/13;"),
          title: propertyStyles("grid-area: 5/7/6/13;"),
          location: {
            ...transparent,
            city: ref("oneFourth"),
            state: ref("oneFourth"),
          },
        },
        {
          ...transparent,
          job_type: ref("jobTitle"),
          district: propertyStyles("grid-area: 4/7/5/13;"),
          school: propertyStyles("grid-area: 5/7/6/13;"),
          title: propertyStyles("grid-area: 6/7/7/13;"),
          location: {
            ...transparent,
            city: propertyStyles("grid-area: 7/7/8/10"),
            state: propertyStyles("grid-area: 7/10/8/13;"),
          },
        },
        {
          ...transparent,
          job_type: ref("jobTitle"),
          description: {
            "ui:components": {
              textWidget: "textareaWidget",
            },
            "ui:options": {
              // NOTE: Stretching the textarea by the amount of free space
              // is possible, but we don't do it because a universal version
              // that takes into account all themes would be too complicated.
              textarea: {
                rows: 8,
              },
              flowbite3Textarea: {
                rows: 8,
              },
              layouts: {
                "object-property": {
                  style:
                    "grid-area: 4/7/7/13; display: flex; align-items: stretch;",
                },
                // field: {
                //   style:
                //     "height: 100%; display: flex; flex-direction: column; gap: 0.2rem",
                // },
                // "field-content": {
                //   style: "flex-grow: 1;",
                // },
              },
            },
          },
        },
      ],
    },
  },
  initialValue: {},
} satisfies Sample;
