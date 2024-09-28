import type { Sample } from './Sample';

import { GeoField } from './components'

const custom: Sample = {
  status: "perfect",
  schema: {
    title: 'A localisation form',
    type: 'object',
    required: ['lat', 'lon'],
    properties: {
      lat: {
        type: 'number',
      },
      lon: {
        type: 'number',
      },
    },
  },
  uiSchema: {
    'ui:field': GeoField
  },
  formData: {
    lat: 0,
    lon: 0,
  },
};

export default custom;
