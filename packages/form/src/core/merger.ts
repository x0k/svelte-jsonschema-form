import type { Schema } from './schema.js';

export interface Merger {
  mergeAllOf(schema: Schema): Schema
}
