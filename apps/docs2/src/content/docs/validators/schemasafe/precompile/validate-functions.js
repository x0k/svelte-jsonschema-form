export const [v20, v19, v19ag, v21, v21ag, v1, v2, v15, v15ag, v3, v4, v5, v7, v6, v8, v9, v16, v16ag, v10, v11, v17, v17ag, v12, v13, v14, v18, v0] = (function() {
'use strict'
const ref0 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "string")) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  return errorCount === 0
};
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const errorMerge = ({ keywordLocation, instanceLocation }, schemaBase, dataBase) => ({
  keywordLocation: `${schemaBase}${keywordLocation.slice(1)}`,
  instanceLocation: `${dataBase}${instanceLocation.slice(1)}`,
});
const ref3 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "string")) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  return errorCount === 0
};
const ref2 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  const err1 = validate.errors
  const res1 = ref3(data)
  const suberr1 = ref3.errors
  validate.errors = err1
  if (!res1) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push(...suberr1.map(e => errorMerge(e, "#/$ref", "#")))
    errorCount++
  }
  return errorCount === 0
};
const ref1 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if ("firstName" in data && hasOwn(data, "firstName")) {
      const err0 = validate.errors
      const res0 = ref0(data.firstName)
      const suberr0 = ref0.errors
      validate.errors = err0
      if (!res0) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr0.map(e => errorMerge(e, "#/properties/firstName/$ref", "#/firstName")))
        errorCount++
      }
    }
    if ("lastName" in data && hasOwn(data, "lastName")) {
      const err2 = validate.errors
      const res2 = ref2(data.lastName)
      const suberr2 = ref2.errors
      validate.errors = err2
      if (!res2) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr2.map(e => errorMerge(e, "#/properties/lastName/$ref", "#/lastName")))
        errorCount++
      }
    }
  }
  return errorCount === 0
};
const ref4 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  const err3 = validate.errors
  const res3 = ref1(data)
  const suberr3 = ref1.errors
  validate.errors = err3
  if (!res3) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push(...suberr3.map(e => errorMerge(e, "#/allOf/0/$ref", "#")))
    errorCount++
  }
  let suberr4 = null
  const sub0 = (() => {
    let errorCount = 0
    if (typeof data === "object" && data && !Array.isArray(data)) {
      if (!("firstName" in data && hasOwn(data, "firstName"))) {
        if (suberr4 === null) suberr4 = []
        suberr4.push({ keywordLocation: "#/allOf/1/anyOf/0/required", instanceLocation: "#/firstName" })
        errorCount++
      }
    }
    return errorCount === 0
  })()
  if (!sub0) {
    const sub1 = (() => {
      let errorCount = 0
      if (typeof data === "object" && data && !Array.isArray(data)) {
        if (!("lastName" in data && hasOwn(data, "lastName"))) {
          if (suberr4 === null) suberr4 = []
          suberr4.push({ keywordLocation: "#/allOf/1/anyOf/1/required", instanceLocation: "#/lastName" })
          errorCount++
        }
      }
      return errorCount === 0
    })()
    if (!sub1) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/allOf/1/anyOf", instanceLocation: "#" })
      if (suberr4) validate.errors.push(...suberr4)
      errorCount++
    }
  }
  return errorCount === 0
};
const ref5 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if ("idCode" in data && hasOwn(data, "idCode")) {
      const err4 = validate.errors
      const res4 = ref2(data.idCode)
      const suberr5 = ref2.errors
      validate.errors = err4
      if (!res4) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr5.map(e => errorMerge(e, "#/properties/idCode/$ref", "#/idCode")))
        errorCount++
      }
    }
  }
  return errorCount === 0
};
const ref6 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  const err5 = validate.errors
  const res5 = ref5(data)
  const suberr6 = ref5.errors
  validate.errors = err5
  if (!res5) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push(...suberr6.map(e => errorMerge(e, "#/allOf/0/$ref", "#")))
    errorCount++
  }
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (!("idCode" in data && hasOwn(data, "idCode"))) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/allOf/1/allOf/0/required", instanceLocation: "#/idCode" })
      errorCount++
    }
  }
  return errorCount === 0
};
const ref7 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "string")) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  return errorCount === 0
};
const ref8 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "object" && data && !Array.isArray(data))) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  else {
    if ("name" in data && hasOwn(data, "name")) {
      const err6 = validate.errors
      const res6 = ref7(data.name)
      const suberr7 = ref7.errors
      validate.errors = err6
      if (!res6) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr7.map(e => errorMerge(e, "#/properties/name/$ref", "#/name")))
        errorCount++
      }
    }
  }
  return errorCount === 0
};
const ref9 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  const err7 = validate.errors
  const res7 = ref8(data)
  const suberr8 = ref8.errors
  validate.errors = err7
  if (!res7) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push(...suberr8.map(e => errorMerge(e, "#/allOf/0/$ref", "#")))
    errorCount++
  }
  if (!("name" in data && hasOwn(data, "name"))) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/allOf/1/allOf/0/required", instanceLocation: "#/name" })
    errorCount++
  }
  return errorCount === 0
};
const isMultipleOf = (value, divisor, factor, factorMultiple) => {
  if (value % divisor === 0) return true
  let multiple = value * factor
  if (multiple === Infinity || multiple === -Infinity) multiple = value
  if (multiple % factorMultiple === 0) return true
  const normal = Math.floor(multiple + 0.5)
  return normal / factor === value && normal % factorMultiple === 0
};
const ref10 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "number")) {
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
    if (!isMultipleOf(data, 0.03, 1e2, 3)) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/multipleOf", instanceLocation: "#" })
      errorCount++
    }
  }
  return errorCount === 0
};
const ref11 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "string")) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  return errorCount === 0
};
const ref12 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "string")) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  return errorCount === 0
};
const ref13 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "string")) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  return errorCount === 0
};
const ref14 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!Array.isArray(data)) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  else {
    for (let i = 0; i < data.length; i++) {
      if (i in data && hasOwn(data, i)) {
        const err8 = validate.errors
        const res8 = ref13(data[i])
        const suberr9 = ref13.errors
        validate.errors = err8
        if (!res8) {
          if (validate.errors === null) validate.errors = []
          validate.errors.push(...suberr9.map(e => errorMerge(e, "#/items/$ref", "#/"+i)))
          errorCount++
        }
      }
    }
  }
  return errorCount === 0
};
const ref15 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "string")) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  else {
    if (!(data === "one")) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/const", instanceLocation: "#" })
      errorCount++
    }
  }
  return errorCount === 0
};
const ref16 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "number")) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  return errorCount === 0
};
const ref17 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "object" && data && !Array.isArray(data))) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  else {
    if ("choice" in data && hasOwn(data, "choice")) {
      const err9 = validate.errors
      const res9 = ref15(data.choice)
      const suberr10 = ref15.errors
      validate.errors = err9
      if (!res9) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr10.map(e => errorMerge(e, "#/properties/choice/$ref", "#/choice")))
        errorCount++
      }
    }
    if ("other" in data && hasOwn(data, "other")) {
      const err10 = validate.errors
      const res10 = ref16(data.other)
      const suberr11 = ref16.errors
      validate.errors = err10
      if (!res10) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr11.map(e => errorMerge(e, "#/properties/other/$ref", "#/other")))
        errorCount++
      }
    }
  }
  return errorCount === 0
};
const ref18 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  const err11 = validate.errors
  const res11 = ref17(data)
  const suberr12 = ref17.errors
  validate.errors = err11
  if (!res11) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push(...suberr12.map(e => errorMerge(e, "#/allOf/0/$ref", "#")))
    errorCount++
  }
  let suberr13 = null
  const sub2 = (() => {
    let errorCount = 0
    if (!("choice" in data && hasOwn(data, "choice"))) {
      if (suberr13 === null) suberr13 = []
      suberr13.push({ keywordLocation: "#/allOf/1/anyOf/0/required", instanceLocation: "#/choice" })
      errorCount++
    }
    return errorCount === 0
  })()
  if (!sub2) {
    const sub3 = (() => {
      let errorCount = 0
      if (!("other" in data && hasOwn(data, "other"))) {
        if (suberr13 === null) suberr13 = []
        suberr13.push({ keywordLocation: "#/allOf/1/anyOf/1/required", instanceLocation: "#/other" })
        errorCount++
      }
      return errorCount === 0
    })()
    if (!sub3) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/allOf/1/anyOf", instanceLocation: "#" })
      if (suberr13) validate.errors.push(...suberr13)
      errorCount++
    }
  }
  return errorCount === 0
};
const ref19 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "string")) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  else {
    if (!(data === "two")) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/const", instanceLocation: "#" })
      errorCount++
    }
  }
  return errorCount === 0
};
const ref20 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "string")) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  return errorCount === 0
};
const ref21 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "object" && data && !Array.isArray(data))) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  else {
    if ("choice" in data && hasOwn(data, "choice")) {
      const err12 = validate.errors
      const res12 = ref19(data.choice)
      const suberr14 = ref19.errors
      validate.errors = err12
      if (!res12) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr14.map(e => errorMerge(e, "#/properties/choice/$ref", "#/choice")))
        errorCount++
      }
    }
    if ("more" in data && hasOwn(data, "more")) {
      const err13 = validate.errors
      const res13 = ref20(data.more)
      const suberr15 = ref20.errors
      validate.errors = err13
      if (!res13) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr15.map(e => errorMerge(e, "#/properties/more/$ref", "#/more")))
        errorCount++
      }
    }
  }
  return errorCount === 0
};
const ref22 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  const err14 = validate.errors
  const res14 = ref21(data)
  const suberr16 = ref21.errors
  validate.errors = err14
  if (!res14) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push(...suberr16.map(e => errorMerge(e, "#/allOf/0/$ref", "#")))
    errorCount++
  }
  let suberr17 = null
  const sub4 = (() => {
    let errorCount = 0
    if (!("choice" in data && hasOwn(data, "choice"))) {
      if (suberr17 === null) suberr17 = []
      suberr17.push({ keywordLocation: "#/allOf/1/anyOf/0/required", instanceLocation: "#/choice" })
      errorCount++
    }
    return errorCount === 0
  })()
  if (!sub4) {
    const sub5 = (() => {
      let errorCount = 0
      if (!("more" in data && hasOwn(data, "more"))) {
        if (suberr17 === null) suberr17 = []
        suberr17.push({ keywordLocation: "#/allOf/1/anyOf/1/required", instanceLocation: "#/more" })
        errorCount++
      }
      return errorCount === 0
    })()
    if (!sub5) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/allOf/1/anyOf", instanceLocation: "#" })
      if (suberr17) validate.errors.push(...suberr17)
      errorCount++
    }
  }
  return errorCount === 0
};
const ref23 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "string")) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  return errorCount === 0
};
const format0 = new RegExp("^data:([a-z]+\\/[a-z0-9-+.]+)?;(?:name=(.*);)?base64,(.*)$", "");
const ref24 = function validate(data) {
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
      if (!format0.test(data)) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push({ keywordLocation: "#/format", instanceLocation: "#" })
        errorCount++
      }
    }
  }
  return errorCount === 0
};
const format1 = new RegExp("\\(?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{4}$", "");
const ref25 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "string")) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  else {
    const prev1 = errorCount
    if (errorCount === prev1) {
      if (!format1.test(data)) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push({ keywordLocation: "#/format", instanceLocation: "#" })
        errorCount++
      }
    }
  }
  return errorCount === 0
};
const ref26 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "string")) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  return errorCount === 0
};
const ref28 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  const err16 = validate.errors
  const res16 = ref10(data)
  const suberr19 = ref10.errors
  validate.errors = err16
  if (!res16) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push(...suberr19.map(e => errorMerge(e, "#/$ref", "#")))
    errorCount++
  }
  return errorCount === 0
};
const ref29 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "object" && data && !Array.isArray(data))) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  else {
    if (!("pass1" in data && hasOwn(data, "pass1"))) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/required", instanceLocation: "#/pass1" })
      errorCount++
    }
    if (!("pass2" in data && hasOwn(data, "pass2"))) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/required", instanceLocation: "#/pass2" })
      errorCount++
    }
    if ("pass1" in data && hasOwn(data, "pass1")) {
      const err18 = validate.errors
      const res18 = ref11(data.pass1)
      const suberr21 = ref11.errors
      validate.errors = err18
      if (!res18) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr21.map(e => errorMerge(e, "#/properties/pass1/$ref", "#/pass1")))
        errorCount++
      }
    }
    if ("pass2" in data && hasOwn(data, "pass2")) {
      const err19 = validate.errors
      const res19 = ref12(data.pass2)
      const suberr22 = ref12.errors
      validate.errors = err19
      if (!res19) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr22.map(e => errorMerge(e, "#/properties/pass2/$ref", "#/pass2")))
        errorCount++
      }
    }
  }
  return errorCount === 0
};
const ref30 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  const err23 = validate.errors
  const res23 = ref8(data)
  const suberr26 = ref8.errors
  validate.errors = err23
  if (!res23) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push(...suberr26.map(e => errorMerge(e, "#/$ref", "#")))
    errorCount++
  }
  return errorCount === 0
};
const ref31 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  const err25 = validate.errors
  const res25 = ref14(data)
  const suberr28 = ref14.errors
  validate.errors = err25
  if (!res25) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push(...suberr28.map(e => errorMerge(e, "#/$ref", "#")))
    errorCount++
  }
  return errorCount === 0
};
const ref32 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  const err27 = validate.errors
  const res27 = ref17(data)
  const suberr31 = ref17.errors
  validate.errors = err27
  if (!res27) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push(...suberr31.map(e => errorMerge(e, "#/$ref", "#")))
    errorCount++
  }
  return errorCount === 0
};
const ref33 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  const err29 = validate.errors
  const res29 = ref21(data)
  const suberr33 = ref21.errors
  validate.errors = err29
  if (!res29) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push(...suberr33.map(e => errorMerge(e, "#/$ref", "#")))
    errorCount++
  }
  return errorCount === 0
};
const pointerPart = (s) => (/~\//.test(s) ? `${s}`.replace(/~/g, '~0').replace(/\//g, '~1') : s);
const ref27 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "object" && data && !Array.isArray(data))) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  else {
    if ("foo" in data && hasOwn(data, "foo")) {
      const err15 = validate.errors
      const res15 = ref23(data.foo)
      const suberr18 = ref23.errors
      validate.errors = err15
      if (!res15) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr18.map(e => errorMerge(e, "#/properties/foo/$ref", "#/foo")))
        errorCount++
      }
    }
    if ("price" in data && hasOwn(data, "price")) {
      const err17 = validate.errors
      const res17 = ref28(data.price)
      const suberr20 = ref28.errors
      validate.errors = err17
      if (!res17) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr20.map(e => errorMerge(e, "#/properties/price/$ref", "#/price")))
        errorCount++
      }
    }
    if ("passwords" in data && hasOwn(data, "passwords")) {
      const err20 = validate.errors
      const res20 = ref29(data.passwords)
      const suberr23 = ref29.errors
      validate.errors = err20
      if (!res20) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr23.map(e => errorMerge(e, "#/properties/passwords/$ref", "#/passwords")))
        errorCount++
      }
    }
    if ("dataUrlWithName" in data && hasOwn(data, "dataUrlWithName")) {
      const err21 = validate.errors
      const res21 = ref24(data.dataUrlWithName)
      const suberr24 = ref24.errors
      validate.errors = err21
      if (!res21) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr24.map(e => errorMerge(e, "#/properties/dataUrlWithName/$ref", "#/dataUrlWithName")))
        errorCount++
      }
    }
    if ("phone" in data && hasOwn(data, "phone")) {
      const err22 = validate.errors
      const res22 = ref25(data.phone)
      const suberr25 = ref25.errors
      validate.errors = err22
      if (!res22) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr25.map(e => errorMerge(e, "#/properties/phone/$ref", "#/phone")))
        errorCount++
      }
    }
    if ("multi" in data && hasOwn(data, "multi")) {
      const err24 = validate.errors
      const res24 = ref30(data.multi)
      const suberr27 = ref30.errors
      validate.errors = err24
      if (!res24) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr27.map(e => errorMerge(e, "#/properties/multi/allOf/0/$ref", "#/multi")))
        errorCount++
      }
    }
    if ("list" in data && hasOwn(data, "list")) {
      const err26 = validate.errors
      const res26 = ref31(data.list)
      const suberr29 = ref31.errors
      validate.errors = err26
      if (!res26) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr29.map(e => errorMerge(e, "#/properties/list/$ref", "#/list")))
        errorCount++
      }
    }
    if ("single" in data && hasOwn(data, "single")) {
      let passes0 = 0
      let suberr30 = null
      const sub6 = (() => {
        let errorCount = 0
        const err28 = validate.errors
        const res28 = ref32(data.single)
        const suberr32 = ref32.errors
        validate.errors = err28
        if (!res28) {
          if (validate.errors === null) validate.errors = []
          validate.errors.push(...suberr32.map(e => errorMerge(e, "#/properties/single/oneOf/0/$ref", "#/single")))
          errorCount++
        }
        return errorCount === 0
      })()
      if (sub6) passes0++
      const sub7 = (() => {
        let errorCount = 0
        const err30 = validate.errors
        const res30 = ref33(data.single)
        const suberr34 = ref33.errors
        validate.errors = err30
        if (!res30) {
          if (validate.errors === null) validate.errors = []
          validate.errors.push(...suberr34.map(e => errorMerge(e, "#/properties/single/oneOf/1/$ref", "#/single")))
          errorCount++
        }
        return errorCount === 0
      })()
      if (sub7) passes0++
      if (passes0 !== 1) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push({ keywordLocation: "#/properties/single/oneOf", instanceLocation: "#/single" })
        errorCount++
      }
      if (passes0 === 0) {
        if (suberr30) validate.errors.push(...suberr30)
      }
    }
    if ("anything" in data && hasOwn(data, "anything")) {
      if (!(typeof data.anything === "object" && data.anything && !Array.isArray(data.anything))) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push({ keywordLocation: "#/properties/anything/type", instanceLocation: "#/anything" })
        errorCount++
      }
      else {
        for (const key0 of Object.keys(data.anything)) {
          if (data.anything[key0] !== undefined) {
            const err31 = validate.errors
            const res31 = ref26(data.anything[key0])
            const suberr35 = ref26.errors
            validate.errors = err31
            if (!res31) {
              if (validate.errors === null) validate.errors = []
              validate.errors.push(...suberr35.map(e => errorMerge(e, "#/properties/anything/additionalProperties/$ref", "#/anything/"+pointerPart(key0))))
              errorCount++
            }
          }
        }
      }
    }
    let suberr36 = null
    const sub8 = (() => {
      let errorCount = 0
      const err32 = validate.errors
      const res32 = ref1(data)
      const suberr37 = ref1.errors
      validate.errors = err32
      if (!res32) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr37.map(e => errorMerge(e, "#/anyOf/0/$ref", "#")))
        errorCount++
      }
      return errorCount === 0
    })()
    if (!sub8) {
      const sub9 = (() => {
        let errorCount = 0
        const err33 = validate.errors
        const res33 = ref5(data)
        const suberr38 = ref5.errors
        validate.errors = err33
        if (!res33) {
          if (validate.errors === null) validate.errors = []
          validate.errors.push(...suberr38.map(e => errorMerge(e, "#/anyOf/1/$ref", "#")))
          errorCount++
        }
        return errorCount === 0
      })()
      if (!sub9) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push({ keywordLocation: "#/anyOf", instanceLocation: "#" })
        if (suberr36) validate.errors.push(...suberr36)
        errorCount++
      }
    }
  }
  return errorCount === 0
};
return ([
  ref0,
  ref1,
  ref4,
  ref5,
  ref6,
  ref3,
  ref7,
  ref8,
  ref9,
  ref10,
  ref11,
  ref12,
  ref13,
  ref14,
  ref15,
  ref16,
  ref17,
  ref18,
  ref19,
  ref20,
  ref21,
  ref22,
  ref23,
  ref24,
  ref25,
  ref26,
  ref27
])})();