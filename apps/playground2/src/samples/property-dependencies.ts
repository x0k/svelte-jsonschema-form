import type { Sample } from "@/core/index.js";

export default {

  schema: {
    title: "Property dependencies",
    description: "These samples are best viewed without live validation.",
    type: "object",
    properties: {
      unidirectional: {
        title: "Unidirectional",
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          credit_card: {
            type: "number",
          },
          billing_address: {
            type: "string",
          },
        },
        required: ["name"],
        dependencies: {
          credit_card: ["billing_address"],
        },
      },
      bidirectional: {
        title: "Bidirectional",
        description:
          "Dependencies are not bidirectional, you can, of course, define the bidirectional dependencies explicitly.",
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          credit_card: {
            type: "number",
          },
          billing_address: {
            type: "string",
          },
        },
        required: ["name"],
        dependencies: {
          credit_card: ["billing_address"],
          billing_address: ["credit_card"],
        },
      },
    },
  },
  uiSchema: {
    unidirectional: {
      credit_card: {
        "ui:options": {
          help: "If you enter anything here then billing_address will become required.",
        },
      },
      billing_address: {
        "ui:options": {
          help: "It's okay to have a billing address without a credit card number.",
        },
      },
    },
    bidirectional: {
      credit_card: {
        "ui:options": {
          help: "If you enter anything here then billing_address will become required.",
        },
      },
      billing_address: {
        "ui:options": {
          help: "If you enter anything here then credit_card will become required.",
        },
      },
    },
  },
  initialValue: {
    unidirectional: {
      name: "Tim",
    },
    bidirectional: {
      name: "Jill",
    },
  },
} satisfies Sample;
