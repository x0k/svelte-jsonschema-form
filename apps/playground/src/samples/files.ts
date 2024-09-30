import type { Sample } from './Sample';

const files: Sample = {
  status: "warnings",
  schema: {
    title: 'Files',
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'data-url',
        title: 'Single file',
      },
      filesAccept: {
        type: 'string',
        format: 'data-url',
        title: 'Single File with Accept attribute',
      },
      files: {
        type: 'array',
        title: 'Multiple files',
        items: {
          type: 'string',
          format: 'data-url',
        },
      },
      orderableFiles: {
        type: "array",
        title: "Multiple files with order",
        items: {
          type: "string",
          format: "data-url",
        }
      }
    },
  },
  uiSchema: {
    filesAccept: {
      'ui:options': {
        input: {
          accept: '.pdf'
        }
      },
    },
    orderableFiles: {
      "ui:options": {
        orderable: true
      }
    }
  },
  formData: {},
};

export default files;
