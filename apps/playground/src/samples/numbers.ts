import type { Sample } from './Sample';

const numbers: Sample = {
  status: "perfect",
  schema: {
    type: 'object',
    title: 'Number fields & widgets',
    properties: {
      number: {
        title: 'Number',
        type: 'number',
      },
      integer: {
        title: 'Integer',
        type: 'integer',
      },
      numberEnum: {
        type: 'number',
        title: 'Number enum',
        enum: [1, 2, 3],
      },
      numberEnumRadio: {
        type: 'number',
        title: 'Number enum',
        enum: [1, 2, 3],
      },
      integerRange: {
        title: 'Integer range',
        type: 'integer',
        minimum: -50,
        maximum: 50,
      },
      integerRangeSteps: {
        title: 'Integer range (by 10)',
        type: 'integer',
        minimum: 50,
        maximum: 100,
        multipleOf: 10,
      },
    },
  },
  uiSchema: {
    numberEnumRadio: {
      'ui:widget': 'radio',
    },
    integerRange: {
      'ui:options': {
        "input": {
          type: "range"
        }
      }
    },
    integerRangeSteps: {
      'ui:options': {
        "input": {
          type: "range"
        }
      }
    },
  },
  formData: {
    number: 3.14,
    integer: 42,
    numberEnum: 2,
    integerRange: 42,
    integerRangeSteps: 80,
  },
};

export default numbers;
