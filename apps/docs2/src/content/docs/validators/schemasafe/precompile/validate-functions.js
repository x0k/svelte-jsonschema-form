export const [v1, v2, v3, v5, v4, v0] = (function() {
'use strict'
const ref0 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!Number.isInteger(data)) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  else {
    if (!(1 <= data)) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/minimum", instanceLocation: "#" })
      errorCount++
    }
  }
  return errorCount === 0
};
const format0 = (input) => {
    if (input.length > 318) return false
    const fast = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]{1,20}(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]{1,21}){0,2}@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,60}[a-z0-9])?){0,3}$/i
    if (fast.test(input)) return true
    if (!input.includes('@') || /(^\.|^"|\.@|\.\.)/.test(input)) return false
    const [name, host, ...rest] = input.split('@')
    if (!name || !host || rest.length !== 0 || name.length > 64 || host.length > 253) return false
    if (!/^[a-z0-9.-]+$/i.test(host) || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(name)) return false
    return host.split('.').every((part) => /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i.test(part))
  };
const ref1 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "string")) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  else {
    const prev0 = errorCount
    if (errorCount === prev0) {
      if (!format0(data)) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push({ keywordLocation: "#/format", instanceLocation: "#" })
        errorCount++
      }
    }
  }
  return errorCount === 0
};
const ref2 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!Number.isInteger(data)) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  else {
    if (!(21 <= data)) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/minimum", instanceLocation: "#" })
      errorCount++
    }
    if (!(100 >= data)) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/maximum", instanceLocation: "#" })
      errorCount++
    }
  }
  return errorCount === 0
};
const ref3 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "string")) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  else {
    if (!(data === "admin" || data === "editor" || data === "viewer")) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/enum", instanceLocation: "#" })
      errorCount++
    }
  }
  return errorCount === 0
};
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const errorMerge = ({ keywordLocation, instanceLocation }, schemaBase, dataBase) => ({
  keywordLocation: `${schemaBase}${keywordLocation.slice(1)}`,
  instanceLocation: `${dataBase}${instanceLocation.slice(1)}`,
});
const unique = (array) => {
  if (array.length < 2) return true
  if (array.length === 2) return !deepEqual(array[0], array[1])
  const objects = []
  const primitives = array.length > 20 ? new Set() : null
  let primitivesCount = 0
  let pos = 0
  for (const item of array) {
    if (typeof item === 'object') {
      objects.push(item)
    } else if (primitives) {
      primitives.add(item)
      if (primitives.size !== ++primitivesCount) return false
    } else {
      if (array.indexOf(item, pos + 1) !== -1) return false
    }
    pos++
  }
  for (let i = 1; i < objects.length; i++)
    for (let j = 0; j < i; j++) if (deepEqual(objects[i], objects[j])) return false
  return true
};
const deepEqual = (obj, obj2) => {
  if (obj === obj2) return true
  if (!obj || !obj2 || typeof obj !== typeof obj2) return false
  if (obj !== obj2 && typeof obj !== 'object') return false

  const proto = Object.getPrototypeOf(obj)
  if (proto !== Object.getPrototypeOf(obj2)) return false

  if (proto === Array.prototype) {
    if (!Array.isArray(obj) || !Array.isArray(obj2)) return false
    if (obj.length !== obj2.length) return false
    return obj.every((x, i) => deepEqual(x, obj2[i]))
  } else if (proto === Object.prototype) {
    const [keys, keys2] = [Object.keys(obj), Object.keys(obj2)]
    if (keys.length !== keys2.length) return false
    const keyset2 = new Set([...keys, ...keys2])
    return keyset2.size === keys.length && keys.every((key) => deepEqual(obj[key], obj2[key]))
  }
  return false
};
const ref4 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!Array.isArray(data)) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  else {
    const prev1 = errorCount
    if (data.length < 1) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/minItems", instanceLocation: "#" })
      errorCount++
    }
    for (let i = 0; i < data.length; i++) {
      if (i in data && hasOwn(data, i)) {
        const err0 = validate.errors
        const res0 = ref3(data[i])
        const suberr0 = ref3.errors
        validate.errors = err0
        if (!res0) {
          if (validate.errors === null) validate.errors = []
          validate.errors.push(...suberr0.map(e => errorMerge(e, "#/items/$ref", "#/"+i)))
          errorCount++
        }
      }
    }
    if (errorCount === prev1) {
      if (!unique(data)) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push({ keywordLocation: "#/uniqueItems", instanceLocation: "#" })
        errorCount++
      }
    }
  }
  return errorCount === 0
};
const pointerPart = (s) => (/~\//.test(s) ? `${s}`.replace(/~/g, '~0').replace(/\//g, '~1') : s);
const ref5 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "object" && data && !Array.isArray(data))) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  else {
    if (!("id" in data && hasOwn(data, "id"))) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/required", instanceLocation: "#/id" })
      errorCount++
    }
    if (!("email" in data && hasOwn(data, "email"))) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/required", instanceLocation: "#/email" })
      errorCount++
    }
    if (!("age" in data && hasOwn(data, "age"))) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/required", instanceLocation: "#/age" })
      errorCount++
    }
    if (!("roles" in data && hasOwn(data, "roles"))) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/required", instanceLocation: "#/roles" })
      errorCount++
    }
    if ("id" in data && hasOwn(data, "id")) {
      const err1 = validate.errors
      const res1 = ref0(data.id)
      const suberr1 = ref0.errors
      validate.errors = err1
      if (!res1) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr1.map(e => errorMerge(e, "#/properties/id/$ref", "#/id")))
        errorCount++
      }
    }
    if ("email" in data && hasOwn(data, "email")) {
      const err2 = validate.errors
      const res2 = ref1(data.email)
      const suberr2 = ref1.errors
      validate.errors = err2
      if (!res2) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr2.map(e => errorMerge(e, "#/properties/email/$ref", "#/email")))
        errorCount++
      }
    }
    if ("age" in data && hasOwn(data, "age")) {
      const err3 = validate.errors
      const res3 = ref2(data.age)
      const suberr3 = ref2.errors
      validate.errors = err3
      if (!res3) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr3.map(e => errorMerge(e, "#/properties/age/$ref", "#/age")))
        errorCount++
      }
    }
    if ("roles" in data && hasOwn(data, "roles")) {
      const err4 = validate.errors
      const res4 = ref4(data.roles)
      const suberr4 = ref4.errors
      validate.errors = err4
      if (!res4) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr4.map(e => errorMerge(e, "#/properties/roles/$ref", "#/roles")))
        errorCount++
      }
    }
    for (const key0 of Object.keys(data)) {
      if (key0 !== "id" && key0 !== "email" && key0 !== "age" && key0 !== "roles") {
        if (validate.errors === null) validate.errors = []
        validate.errors.push({ keywordLocation: "#/additionalProperties", instanceLocation: "#/"+pointerPart(key0) })
        errorCount++
      }
    }
  }
  return errorCount === 0
};
return ([
  ref0,
  ref1,
  ref2,
  ref3,
  ref4,
  ref5
])})();