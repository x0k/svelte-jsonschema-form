import { describe, expect, it } from 'vitest'
import { parseSchemaValue, type SchemaValueParserOptions } from './schema-value-parser'

const PREFIX = 'root'
const defaultOptions: SchemaValueParserOptions<string> = {
  schema: {},
  entries: [],
  idPrefix: PREFIX,
  idSeparator: '.',
  idPseudoSeparator: '::',
  convertValue: (_, v) => v
}

describe("parseSchemaValue", () => {
  it("Should parse empty entries", () => {
    expect(parseSchemaValue(defaultOptions)).toBeUndefined()
  })
  it("Should parse root value", () => {
    expect(parseSchemaValue({
      ...defaultOptions,
      entries: [
        [PREFIX, 'value']
      ],
    }))
  })
})