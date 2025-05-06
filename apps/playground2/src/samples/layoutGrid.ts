import type { ComponentDefinition } from '@sjsf/form';
// import { TransparentLayout } from './components';
import type { Sample } from "./Sample";

import TransparentLayout from './components/transparent-layout.svelte';

const def: ComponentDefinition<"layout"> = TransparentLayout

const layoutGrid: Sample = {
  status: "perfect",
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
    "ui:options": {
      layouts: {
        "object-properties": {
          style:
            "display: grid; grid-template-columns: repeat(12, 1fr); gap: 1rem;",
        },
      },
    },
    person: {
      "ui:components": {
        "layout": TransparentLayout
      }
    }
  },
  formData: {},
};

export default layoutGrid;
