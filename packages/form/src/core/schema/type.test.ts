import { expect, describe, it } from 'vitest'

import { typeOfSchema } from './type'

describe('typeOfSchema', () => {
  it("Should allow empty schema", () => {
    expect(typeOfSchema({})).toBe("null")
  })
})
