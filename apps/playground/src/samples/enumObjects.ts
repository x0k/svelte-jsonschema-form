import type { Sample } from './Sample';

const enumObjects: Sample = {
  status: "broken",
  schema: {
    definitions: {
      locations: {
        // @ts-expect-error -- enumNames an RJSF keyword and is not in the JSON Schema spec
        enumNames: ['New York', 'Amsterdam', 'Hong Kong'],
        enum: [
          {
            name: 'New York',
            lat: 40,
            lon: 74,
          },
          {
            name: 'Amsterdam',
            lat: 52,
            lon: 5,
          },
          {
            name: 'Hong Kong',
            lat: 22,
            lon: 114,
          },
        ],
      },
    },
    type: 'object',
    properties: {
      location: {
        title: 'Location',
        $ref: '#/definitions/locations',
      },
      locationRadio: {
        title: 'Location Radio',
        $ref: '#/definitions/locations',
      },
      multiSelect: {
        title: 'Locations',
        type: 'array',
        uniqueItems: true,
        items: {
          $ref: '#/definitions/locations',
        },
      },
      checkboxes: {
        title: 'Locations Checkboxes',
        type: 'array',
        uniqueItems: true,
        items: {
          $ref: '#/definitions/locations',
        },
      },
    },
  },
  uiSchema: {
    locationRadio: {
      'ui:widget': 'radio',
    },
    checkboxes: {
      'ui:widget': 'checkboxes',
    },
  },
  formData: {
    location: {
      name: 'Amsterdam',
      lat: 52,
      lon: 5,
    },
  },
};

export default enumObjects;
