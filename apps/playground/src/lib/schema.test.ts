import { it, describe } from 'node:test'
import assert from 'node:assert'

import { typeOfSchema } from './schema.ts'

describe('typeOfSchema', () => {
  it("Should allow empty schema", () => {
    assert.equal(typeOfSchema({}), "null")
  })
})
