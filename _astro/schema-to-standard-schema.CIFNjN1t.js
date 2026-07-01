import{a as e,c as t,i as n,l as r,o as i,r as a,s as o,t as s}from"./schema-transform.BNDWTQ3M.js";function c(c,l){if(!e(c,l))return l;let{ast:u,state:d}=o(l,c),f={...d,isDefaultValidatorReferenced:!1},p=r(u,f,{VariableDeclarator(e,{state:t,next:n}){let r=i(e);if(t.isSchemaTransformed||!r){n();return}t.isSchemaTransformed=!0,n()},ObjectExpression(e,{state:t,next:n}){if(t.isOptionsTransformed){n();return}let r=a(e);if(r===-1){n();return}t.isOptionsTransformed=!0;let i=n()??e;return t.isDefaultValidatorReferenced?{...i,properties:i.properties.with(r,{type:`Property`,method:!1,shorthand:!1,computed:!1,key:{type:`Identifier`,name:`schema`},value:{type:`Identifier`,name:`sjsfSchema`},kind:`init`})}:{...i,properties:i.properties.with(r,{type:`SpreadElement`,argument:{type:`CallExpression`,callee:{type:`Identifier`,name:`adapt`},arguments:[{type:`Identifier`,name:`fakeValidator`}],optional:!1}})}},CallExpression(e,{state:t,next:n}){if(t.isOptionsTransformed&&e.callee.type===`MemberExpression`&&e.callee.object.type===`Identifier`&&e.callee.object.name===`defaults`&&e.callee.property.type===`Identifier`&&e.callee.property.name===`validator`)return t.isDefaultValidatorReferenced=!0,{type:`CallExpression`,callee:{type:`Identifier`,name:`sjsfValidator`},arguments:e.arguments,optional:e.optional??!1};n()}});if(f.isSchemaTransformed&&f.isOptionsTransformed){let e=[`import { adapt } from "@sjsf/form/validators/standard-schema";`,`import type { StandardSchemaV1, StandardJSONSchemaV1 } from "@standard-schema/spec";`].join(`
`),r=s.parse(e,{sourceType:`module`,ecmaVersion:16}),i=s.parse(`const fakeValidator = {
  "~standard": {
    version: 1,
    vendor: "sjsf",
    validate(value: unknown) {
      return value && typeof value === "object"
        ? { value }
        : { issues: [{ message: "Invalid", path: [] }] };
    },
    jsonSchema: {
      input: () => schema,
      output() {
        throw new Error("not implemented");
      }
    }
  }
} as const satisfies StandardSchemaV1 & StandardJSONSchemaV1;`,{sourceType:`module`,ecmaVersion:16}),a=p.instance?.content.body;a?.unshift(...r.body);let o=n(a);if(a&&o>=0&&a.splice(o+1,0,...i.body),f.isDefaultValidatorReferenced){let e=s.parse(`const { schema: sjsfSchema, validator: sjsfValidator } = adapt(fakeValidator);`,{sourceType:`module`,ecmaVersion:16});a&&o>=0&&a.splice(o+2,0,...e.body)}return t(p).code}return l}export{c as default};