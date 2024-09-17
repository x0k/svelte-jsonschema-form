import { it, describe } from 'node:test'
import assert from 'node:assert/strict'

import { typeOfSchema } from './type.ts'

describe('typeOfSchema', () => {
  it("Should allow empty schema", () => {
    assert.equal(typeOfSchema({}), "null")
  })
})
