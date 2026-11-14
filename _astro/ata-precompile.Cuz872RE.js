import{r as e}from"./rolldown-runtime.BCiCTKAo.js";import{a as t,i as n}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{Et as r,Mt as i,Nt as a,Pt as o,et as s,lt as c,nn as l,st as u,tn as d}from"./client.b8lPZIo2.js";import{n as f}from"./precompile.B2PlEOjU.js";import{X as p,i as m,u as h}from"./form.D7agbGVP.js";import{i as g,u as _}from"./playground.BNUvg7dD.js";import{t as v}from"./input-schema.D8cf2JKT.js";var y={title:`User`,type:`object`,required:[`id`,`email`,`age`,`roles`],properties:{id:{type:`integer`,minimum:1,$id:`v1`},email:{type:`string`,format:`email`,$id:`v2`},age:{type:`integer`,minimum:21,maximum:100,$id:`v3`},roles:{type:`array`,items:{type:`string`,enum:[`admin`,`editor`,`viewer`],$id:`v5`},uniqueItems:!0,minItems:1,$id:`v4`}},additionalProperties:!1,$id:`v0`},b=e({v0:()=>V,v1:()=>I,v2:()=>L,v3:()=>R,v4:()=>B,v5:()=>z});function x(e){{let t=e.length,n=-1,r,i,a=46;if(e.charCodeAt(0)===34){if(n=e.lastIndexOf(`@`),n<2||e.charCodeAt(n-1)!==34)return!1;for(r=1;r<n-1;r++)if(i=e.charCodeAt(r),i===92){if(i=e.charCodeAt(++r),i<32||i>126||r>=n-1)return!1}else if(i<32||i>126||i===34)return!1;a=0}else for(r=0;r<t;r++){if(i=e.charCodeAt(r),i===64){n=r;break}if(i===46?a===46:!((i<64?i<32?0:2751458554:i<96?3355443198:i<128?2147483647:0)>>>i&1))return!1;a=i}if(n<1||n>64||n===t-1||a===46)return!1;if(e.charCodeAt(n+1)===91){if(e.charCodeAt(t-1)!==93||t-n<4)return!1;let r=e.slice(n+2,-1);if(/^ipv6:/i.test(r)){let e=r.slice(5);if(e.length>45||!/^(?:(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)|::(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?|::(?:(?:[0-9A-Fa-f]{1,4}:){0,5})?(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)|(?:[0-9A-Fa-f]{1,4}:){0}[0-9A-Fa-f]{1,4}::(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?|(?:[0-9A-Fa-f]{1,4}:){0}[0-9A-Fa-f]{1,4}::(?:(?:[0-9A-Fa-f]{1,4}:){0,4})?(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)|(?:[0-9A-Fa-f]{1,4}:){1}[0-9A-Fa-f]{1,4}::(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?|(?:[0-9A-Fa-f]{1,4}:){1}[0-9A-Fa-f]{1,4}::(?:(?:[0-9A-Fa-f]{1,4}:){0,3})?(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)|(?:[0-9A-Fa-f]{1,4}:){2}[0-9A-Fa-f]{1,4}::(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?|(?:[0-9A-Fa-f]{1,4}:){2}[0-9A-Fa-f]{1,4}::(?:(?:[0-9A-Fa-f]{1,4}:){0,2})?(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)|(?:[0-9A-Fa-f]{1,4}:){3}[0-9A-Fa-f]{1,4}::(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?|(?:[0-9A-Fa-f]{1,4}:){3}[0-9A-Fa-f]{1,4}::(?:(?:[0-9A-Fa-f]{1,4}:){0,1})?(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)|(?:[0-9A-Fa-f]{1,4}:){4}[0-9A-Fa-f]{1,4}::(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?|(?:[0-9A-Fa-f]{1,4}:){4}[0-9A-Fa-f]{1,4}::(?:(?:[0-9A-Fa-f]{1,4}:){0,0})?(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)|(?:[0-9A-Fa-f]{1,4}:){5}[0-9A-Fa-f]{1,4}::(?:(?:[0-9A-Fa-f]{1,4}:){0,0}[0-9A-Fa-f]{1,4})?|(?:[0-9A-Fa-f]{1,4}:){6}[0-9A-Fa-f]{1,4}::)$/.test(e))return!1}else if(r.length>15||!/^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/.test(r))return!1}else{if(e.length-(n+1)>253)return!1;let t=0,r=46;for(let i=n+1;i<e.length;i++){let n=e.charCodeAt(i);if(n===46){if(t===0||r===45)return!1;t=0}else if(!((n<64?n<32?0:67051520:n<96||n<128?134217726:0)>>>n&1)||n===45&&r===46||++t>63)return!1;r=n}if(t===0||r===45)return!1}}return!0}function S(e,t){if(e===t)return!0;if(e===null||t===null||typeof e!=`object`||typeof t!=`object`)return!1;var n=Array.isArray(e);if(n!==Array.isArray(t))return!1;var r,i,a,o;if(n){if(e.length!==t.length)return!1;for(r=e.length;r--!==0;)if(!S(e[r],t[r]))return!1;return!0}var s=Object.keys(e);if(s.length!==Object.keys(t).length)return!1;for(r=s.length;r--!==0;)if(i=s[r],!Object.prototype.hasOwnProperty.call(t,i)||(a=e[i],o=t[i],a!==o&&(a===null||o===null||typeof a!=`object`||typeof o!=`object`)))return!1;for(r=s.length;r--!==0;)if(i=s[r],a=e[i],typeof a==`object`&&a&&!S(a,t[i]))return!1;return!0}function C(e){if(e===null)return 1;var t=typeof e,n,r;if(t===`boolean`)return e?2:3;if(t===`number`){if(e===0)return 4;if(n=e|0,n===e)return Math.imul(n,2654435761)^5;var i=C.f||=new Float64Array(1),a=C.w||=new Uint32Array(i.buffer);return i[0]=e,Math.imul(a[0]^Math.imul(a[1],2654435761),2246822507)^5}if(t===`string`){for(n=2166136261^e.length,r=0;r<e.length;r++)n=Math.imul(n^e.charCodeAt(r),16777619);return n}if(t!==`object`)return 6;if(Array.isArray(e)){for(n=625341585^e.length,r=0;r<e.length;r++)n=Math.imul(n^C(e[r]),16777619);return n}var o=Object.keys(e);for(n=1821285621^o.length,r=0;r<o.length;r++)n=n+Math.imul(C(o[r])^Math.imul(C(e[o[r]]),1540483477),668265261)|0;return n}function w(e){var t=e.length,n,r;if(t<2)return!0;if(t<=12){for(n=1;n<t;n++)for(r=0;r<n;r++)if(S(e[n],e[r]))return!1;return!0}var i=!0;for(n=0;n<t;n++){var a=e[n];if(typeof a==`object`&&a){i=!1;break}}if(i){var o=new Set;for(n=0;n<t;n++){if(o.has(e[n]))return!1;o.add(e[n])}return!0}var s=new Map;for(n=0;n<t;n++){var c=C(e[n]),l=s.get(c);if(l===void 0)s.set(c,n);else if(typeof l==`number`){if(S(e[l],e[n]))return!1;s.set(c,[l,n])}else{for(r=0;r<l.length;r++)if(S(e[l[r]],e[n]))return!1;l.push(n)}}return!0}var T=0;function E(e){var t=e.length,n,r;if(t<2)return-1;if(t<=12){for(n=0;n<t-1;n++)for(r=n+1;r<t;r++)if(S(e[n],e[r]))return T=n,r;return-1}var i=!0;for(n=0;n<t;n++){var a=e[n];if(typeof a==`object`&&a){i=!1;break}}var o=-1,s=-1,c=new Map;if(i)for(n=0;n<t;n++){var l=c.get(e[n]);l===void 0?c.set(e[n],n):l>=0&&((o<0||l<o)&&(o=l,s=n),c.set(e[n],-1))}else{var u=null;for(n=0;n<t;n++){var d=C(e[n]),f=c.get(d),p=-1;if(f===void 0)c.set(d,n);else{if(typeof f==`number`)S(e[f],e[n])?p=f:c.set(d,[f,n]);else{for(r=0;r<f.length;r++)if(S(e[f[r]],e[n])){p=f[r];break}p<0&&f.push(n)}p>=0&&(u===null&&(u=new Set),u.has(p)||(u.add(p),(o<0||p<o)&&(o=p,s=n)))}}}return o<0?-1:(T=o,s)}var D={}.__proto__===Object.prototype,O=Object.prototype,k=Object.getPrototypeOf,A=Object.prototype.hasOwnProperty;function j(e,t){return A.call(e,t)}function M(e,t){return(D?e.__proto__:k(e))===O||Object.keys(e).length!==t}var N=Object.freeze({valid:!0,errors:Object.freeze([])}),P=[function(e,t){return function(n){return!Number.isInteger(n)||n<1?t(n):e}},function(e,t){return function(n){return typeof n!=`string`||!x(n)?t(n):e}},function(e,t){return function(n){return!Number.isInteger(n)||n<21||n>100?t(n):e}},function(e,t){return function(n){return typeof n!=`string`||n!==`admin`&&n!==`editor`&&n!==`viewer`?t(n):e}},function(e,t){return function(n){if(!Array.isArray(n)||n.length<1||!w(n))return t(n);for(let e=0;e<n.length;e++){let r=n[e];if(typeof r!=`string`||r!==`admin`&&r!==`editor`&&r!==`viewer`)return t(n)}return e}},function(e,t){return function(n){let r=typeof n==`object`&&!!n&&(D?n.__proto__:k(n))===O;if(typeof n!=`object`||!n||Array.isArray(n)||n.id===void 0||!(r||j(n,`id`))||n.email===void 0||!(r||j(n,`email`))||n.age===void 0||!(r||j(n,`age`))||n.roles===void 0||!(r||j(n,`roles`))||!Number.isInteger(n.id)||n.id<1||typeof n.email!=`string`||!x(n.email)||!Number.isInteger(n.age)||n.age<21||n.age>100||!Array.isArray(n.roles)||n.roles.length<1||!w(n.roles))return t(n);for(let e=0;e<n.roles.length;e++){let r=n.roles[e];if(typeof r!=`string`||r!==`admin`&&r!==`editor`&&r!==`viewer`)return t(n)}var i=0;for(var a in n)i++;return i!==4&&(r||M(n,4))?t(n):e}}],F=[function(e){var t=!0;let n=[];return!Number.isInteger(e)&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:``,schemaPath:`#/type`,params:{type:`integer`},message:`must be integer`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t)||typeof e==`number`&&e<1&&(n.push({code:`ATA2003`,keyword:`minimum`,instancePath:``,schemaPath:`#/minimum`,params:{comparison:`>=`,limit:1},message:`must be >= 1`,docUrl:`https://ata-validator.com/e/ATA2003`}),!t)?{valid:!1,errors:n}:{valid:n.length===0,errors:n}},function(e){var t=!0;let n=[];if(typeof e!=`string`&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:``,schemaPath:`#/type`,params:{type:`string`},message:`must be string`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t))return{valid:!1,errors:n};_fmt0:if(typeof e==`string`&&!x(e)){if(n.push({code:`ATA3001`,keyword:`format`,instancePath:``,schemaPath:`#/format`,params:{format:`email`},message:`must match format "email"`,docUrl:`https://ata-validator.com/e/ATA3001`}),!t)return{valid:!1,errors:n};break _fmt0}return{valid:n.length===0,errors:n}},function(e){var t=!0;let n=[];return!Number.isInteger(e)&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:``,schemaPath:`#/type`,params:{type:`integer`},message:`must be integer`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t)||typeof e==`number`&&e<21&&(n.push({code:`ATA2003`,keyword:`minimum`,instancePath:``,schemaPath:`#/minimum`,params:{comparison:`>=`,limit:21},message:`must be >= 21`,docUrl:`https://ata-validator.com/e/ATA2003`}),!t)||typeof e==`number`&&e>100&&(n.push({code:`ATA2004`,keyword:`maximum`,instancePath:``,schemaPath:`#/maximum`,params:{comparison:`<=`,limit:100},message:`must be <= 100`,docUrl:`https://ata-validator.com/e/ATA2004`}),!t)?{valid:!1,errors:n}:{valid:n.length===0,errors:n}},function(e){var t=!0;let n=[];return typeof e!=`string`&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:``,schemaPath:`#/type`,params:{type:`string`},message:`must be string`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t)||e!==`admin`&&e!==`editor`&&e!==`viewer`&&(n.push({code:`ATA6001`,keyword:`enum`,instancePath:``,schemaPath:`#/enum`,params:{allowedValues:[`admin`,`editor`,`viewer`]},message:`must be equal to one of the allowed values`,docUrl:`https://ata-validator.com/e/ATA6001`}),!t)?{valid:!1,errors:n}:{valid:n.length===0,errors:n}},function(e){var t=!0;let n=[];if(!Array.isArray(e)&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:``,schemaPath:`#/type`,params:{type:`array`},message:`must be array`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t)||Array.isArray(e)&&e.length<1&&(n.push({code:`ATA2008`,keyword:`minItems`,instancePath:``,schemaPath:`#/minItems`,params:{limit:1},message:`must NOT have fewer than 1 items`,docUrl:`https://ata-validator.com/e/ATA2008`}),!t))return{valid:!1,errors:n};if(Array.isArray(e)){let r=E(e);if(r>=0){let e=T;if(n.push({code:`ATA2012`,keyword:`uniqueItems`,instancePath:``,schemaPath:`#/uniqueItems`,params:{i:e,j:r},message:`must NOT have duplicate items (items ## `+r+` and `+e+` are identical)`,docUrl:`https://ata-validator.com/e/ATA2012`}),!t)return{valid:!1,errors:n}}}if(Array.isArray(e))for(let r=0;r<e.length;r++){let i=e[r];if(typeof i!=`string`&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:`/`+r,schemaPath:`#/items/type`,params:{type:`string`},message:`must be string`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t)||i!==`admin`&&i!==`editor`&&i!==`viewer`&&(n.push({code:`ATA6001`,keyword:`enum`,instancePath:`/`+r,schemaPath:`#/items/enum`,params:{allowedValues:[`admin`,`editor`,`viewer`]},message:`must be equal to one of the allowed values`,docUrl:`https://ata-validator.com/e/ATA6001`}),!t))return{valid:!1,errors:n}}return{valid:n.length===0,errors:n}},function(e){var t=!0;let n=[],r=new Set([`id`,`email`,`age`,`roles`]),i=typeof e==`object`&&!!e&&(D?e.__proto__:k(e))===O;if((typeof e!=`object`||!e||Array.isArray(e))&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:``,schemaPath:`#/type`,params:{type:`object`},message:`must be object`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t)||typeof e==`object`&&e&&!Array.isArray(e)&&(e.id===void 0||!(i||j(e,`id`)))&&(n.push({code:`ATA7001`,keyword:`required`,instancePath:``,schemaPath:`#/required`,params:{missingProperty:`id`},message:`must have required property 'id'`,docUrl:`https://ata-validator.com/e/ATA7001`}),!t)||typeof e==`object`&&e&&!Array.isArray(e)&&(e.email===void 0||!(i||j(e,`email`)))&&(n.push({code:`ATA7001`,keyword:`required`,instancePath:``,schemaPath:`#/required`,params:{missingProperty:`email`},message:`must have required property 'email'`,docUrl:`https://ata-validator.com/e/ATA7001`}),!t)||typeof e==`object`&&e&&!Array.isArray(e)&&(e.age===void 0||!(i||j(e,`age`)))&&(n.push({code:`ATA7001`,keyword:`required`,instancePath:``,schemaPath:`#/required`,params:{missingProperty:`age`},message:`must have required property 'age'`,docUrl:`https://ata-validator.com/e/ATA7001`}),!t)||typeof e==`object`&&e&&!Array.isArray(e)&&(e.roles===void 0||!(i||j(e,`roles`)))&&(n.push({code:`ATA7001`,keyword:`required`,instancePath:``,schemaPath:`#/required`,params:{missingProperty:`roles`},message:`must have required property 'roles'`,docUrl:`https://ata-validator.com/e/ATA7001`}),!t))return{valid:!1,errors:n};if(typeof e==`object`&&e&&!Array.isArray(e)){let a=0;for(let t in e)if(!i&&!A.call(e,t))continue;else if(t!==`id`&&t!==`email`&&t!==`age`&&t!==`roles`){a=1;break}if(a){let i=Object.keys(e);for(let e=0;e<i.length;e++)if(!r.has(i[e])&&(n.push({code:`ATA7002`,keyword:`additionalProperties`,instancePath:``,schemaPath:`#/additionalProperties`,params:{additionalProperty:i[e]},message:`must NOT have additional properties`,docUrl:`https://ata-validator.com/e/ATA7002`}),!t))return{valid:!1,errors:n}}}if(typeof e==`object`&&e&&!Array.isArray(e)){let r=e.id;if(r!==void 0&&(i?`id`in e:j(e,`id`))&&(!Number.isInteger(r)&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:`/id`,schemaPath:`#/properties/id/type`,params:{type:`integer`},message:`must be integer`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t)||typeof r==`number`&&r<1&&(n.push({code:`ATA2003`,keyword:`minimum`,instancePath:`/id`,schemaPath:`#/properties/id/minimum`,params:{comparison:`>=`,limit:1},message:`must be >= 1`,docUrl:`https://ata-validator.com/e/ATA2003`}),!t)))return{valid:!1,errors:n}}if(typeof e==`object`&&e&&!Array.isArray(e)){let r=e.email;if(r!==void 0&&(i?`email`in e:j(e,`email`))){if(typeof r!=`string`&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:`/email`,schemaPath:`#/properties/email/type`,params:{type:`string`},message:`must be string`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t))return{valid:!1,errors:n};_fmt5:if(typeof r==`string`&&!x(r)){if(n.push({code:`ATA3001`,keyword:`format`,instancePath:`/email`,schemaPath:`#/properties/email/format`,params:{format:`email`},message:`must match format "email"`,docUrl:`https://ata-validator.com/e/ATA3001`}),!t)return{valid:!1,errors:n};break _fmt5}}}if(typeof e==`object`&&e&&!Array.isArray(e)){let r=e.age;if(r!==void 0&&(i?`age`in e:j(e,`age`))&&(!Number.isInteger(r)&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:`/age`,schemaPath:`#/properties/age/type`,params:{type:`integer`},message:`must be integer`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t)||typeof r==`number`&&r<21&&(n.push({code:`ATA2003`,keyword:`minimum`,instancePath:`/age`,schemaPath:`#/properties/age/minimum`,params:{comparison:`>=`,limit:21},message:`must be >= 21`,docUrl:`https://ata-validator.com/e/ATA2003`}),!t)||typeof r==`number`&&r>100&&(n.push({code:`ATA2004`,keyword:`maximum`,instancePath:`/age`,schemaPath:`#/properties/age/maximum`,params:{comparison:`<=`,limit:100},message:`must be <= 100`,docUrl:`https://ata-validator.com/e/ATA2004`}),!t)))return{valid:!1,errors:n}}if(typeof e==`object`&&e&&!Array.isArray(e)){let r=e.roles;if(r!==void 0&&(i?`roles`in e:j(e,`roles`))){if(!Array.isArray(r)&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:`/roles`,schemaPath:`#/properties/roles/type`,params:{type:`array`},message:`must be array`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t)||Array.isArray(r)&&r.length<1&&(n.push({code:`ATA2008`,keyword:`minItems`,instancePath:`/roles`,schemaPath:`#/properties/roles/minItems`,params:{limit:1},message:`must NOT have fewer than 1 items`,docUrl:`https://ata-validator.com/e/ATA2008`}),!t))return{valid:!1,errors:n};if(Array.isArray(r)){let e=E(r);if(e>=0){let r=T;if(n.push({code:`ATA2012`,keyword:`uniqueItems`,instancePath:`/roles`,schemaPath:`#/properties/roles/uniqueItems`,params:{i:r,j:e},message:`must NOT have duplicate items (items ## `+e+` and `+r+` are identical)`,docUrl:`https://ata-validator.com/e/ATA2012`}),!t)return{valid:!1,errors:n}}}if(Array.isArray(r))for(let e=0;e<r.length;e++){let i=r[e];if(typeof i!=`string`&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:`/roles/`+e,schemaPath:`#/properties/roles/items/type`,params:{type:`string`},message:`must be string`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t)||i!==`admin`&&i!==`editor`&&i!==`viewer`&&(n.push({code:`ATA6001`,keyword:`enum`,instancePath:`/roles/`+e,schemaPath:`#/properties/roles/items/enum`,params:{allowedValues:[`admin`,`editor`,`viewer`]},message:`must be equal to one of the allowed values`,docUrl:`https://ata-validator.com/e/ATA6001`}),!t))return{valid:!1,errors:n}}}}return{valid:n.length===0,errors:n}}],[I,L,R,z,B,V]=[P[0](N,F[0]),P[1](N,F[1]),P[2](N,F[2]),P[3](N,F[3]),P[4](N,F[4]),P[5](N,F[5])],H=c(`<!> <pre> </pre>`,1);function U(e,n){l(n,!0);let{defaults:c}=t(),v=h({...c,schema:y,validator:f({validatorRetriever:_(b)}),fieldsValidationMode:11,resolver:g});var x=H(),S=i(x);m(S,{get form(){return v},novalidate:!0});var C=o(S,2),w=a(C,!0);r(e=>s(w,e),[()=>JSON.stringify(p(v),null,2)]),u(e,x),d()}var W={files:{"src/routes/+page.svelte":n(`<script lang="ts">
  import { createFormValidatorFactory } from "@sjsf/ata-validator/precompile";
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { resolver } from "@sjsf/form/resolvers/compat";
  import { fromValidators } from "@sjsf/form/validators/precompile";

  import { getDemoContext } from "@/lib/demo";

  import { schema, fieldsValidationMode } from "./patched-schema";
  import * as validateFunctions from "./validate-functions";

  const { defaults } = getDemoContext();

  const form = createForm({
    ...defaults,
    schema,
    validator: createFormValidatorFactory({
      validatorRetriever: fromValidators(validateFunctions),
    }),
    fieldsValidationMode,
    resolver,
  });
<\/script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
`),"src/routes/compile-schema-script.ts":`import fs from "node:fs";
import path from "node:path";

import { DEFAULT_PRECOMPILED_VALIDATOR_OPTIONS } from "@sjsf/ata-validator/precompile";
import { ON_ARRAY_CHANGE, ON_CHANGE, ON_INPUT } from "@sjsf/form";
import {
  insertSubSchemaIds,
  fragmentSchema,
} from "@sjsf/form/validators/precompile";
import { bundleCompact } from "ata-validator/build";

import inputSchema from "../input-schema.json" with { type: "json" };

const fieldsValidationMode = ON_INPUT | ON_CHANGE | ON_ARRAY_CHANGE;

// NOTE: After calling this function, be sure to save the \`schema\` and
// use it to generate the form
const patch = insertSubSchemaIds(inputSchema as any, {
  fieldsValidationMode,
});

// It is easier to save as a TS file
// https://github.com/microsoft/TypeScript/issues/32063
fs.writeFileSync(
  path.join(import.meta.dirname, "patched-schema.ts"),
  \`import type { Schema } from "@sjsf/form";
export const fieldsValidationMode = \${fieldsValidationMode}
export const schema = \${JSON.stringify(patch.schema, null, 2)} as const satisfies Schema;\`
);

const base = { $schema: "http://json-schema.org/draft-07/schema" };
const schemas = fragmentSchema(patch);
const bundle = bundleCompact(
  schemas.map((s) => Object.assign(s, base)),
  DEFAULT_PRECOMPILED_VALIDATOR_OPTIONS
)
  .replace(
    "const validators",
    \`export const [\${schemas.map((s) => s.$id).join(", ")}]\`
  )
  .slice(0, -50);

fs.writeFileSync(
  path.join(import.meta.dirname, "validate-functions.js"),
  bundle
);
`,"src/input-schema.json":v,"src/routes/patched-schema.ts":`import type { Schema } from "@sjsf/form";
export const fieldsValidationMode = 11
export const schema = {
  "title": "User",
  "type": "object",
  "required": [
    "id",
    "email",
    "age",
    "roles"
  ],
  "properties": {
    "id": {
      "type": "integer",
      "minimum": 1,
      "$id": "v1"
    },
    "email": {
      "type": "string",
      "format": "email",
      "$id": "v2"
    },
    "age": {
      "type": "integer",
      "minimum": 21,
      "maximum": 100,
      "$id": "v3"
    },
    "roles": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "admin",
          "editor",
          "viewer"
        ],
        "$id": "v5"
      },
      "uniqueItems": true,
      "minItems": 1,
      "$id": "v4"
    }
  },
  "additionalProperties": false,
  "$id": "v0"
} as const satisfies Schema;`,"src/routes/validate-functions.js":`// Auto-generated by ata-validator 1.63.2, do not edit
function _em(_s){{const _n0=_s.length;let _at=-1,_qi,_qc,_pd=46;if(_s.charCodeAt(0)===34){_at=_s.lastIndexOf('@');if(_at<2||_s.charCodeAt(_at-1)!==34)return false;for(_qi=1;_qi<_at-1;_qi++){_qc=_s.charCodeAt(_qi);if(_qc===92){_qc=_s.charCodeAt(++_qi);if(_qc<32||_qc>126||_qi>=_at-1)return false}else if(_qc<32||_qc>126||_qc===34)return false}_pd=0}else for(_qi=0;_qi<_n0;_qi++){_qc=_s.charCodeAt(_qi);if(_qc===64){_at=_qi;break}if(_qc===46?_pd===46:!((_qc<64?_qc<32?0:2751458554:_qc<96?3355443198:_qc<128?2147483647:0)>>>_qc&1))return false;_pd=_qc}if(_at<1||_at>64||_at===_n0-1||_pd===46)return false;if(_s.charCodeAt(_at+1)===91){if(_s.charCodeAt(_n0-1)!==93||_n0-_at<4)return false;const _in=_s.slice(_at+2,-1);if(/^ipv6:/i.test(_in)){const _i6=_in.slice(5);if(_i6.length>45||!/^(?:(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)|::(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?|::(?:(?:[0-9A-Fa-f]{1,4}:){0,5})?(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)|(?:[0-9A-Fa-f]{1,4}:){0}[0-9A-Fa-f]{1,4}::(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?|(?:[0-9A-Fa-f]{1,4}:){0}[0-9A-Fa-f]{1,4}::(?:(?:[0-9A-Fa-f]{1,4}:){0,4})?(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)|(?:[0-9A-Fa-f]{1,4}:){1}[0-9A-Fa-f]{1,4}::(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?|(?:[0-9A-Fa-f]{1,4}:){1}[0-9A-Fa-f]{1,4}::(?:(?:[0-9A-Fa-f]{1,4}:){0,3})?(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)|(?:[0-9A-Fa-f]{1,4}:){2}[0-9A-Fa-f]{1,4}::(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?|(?:[0-9A-Fa-f]{1,4}:){2}[0-9A-Fa-f]{1,4}::(?:(?:[0-9A-Fa-f]{1,4}:){0,2})?(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)|(?:[0-9A-Fa-f]{1,4}:){3}[0-9A-Fa-f]{1,4}::(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?|(?:[0-9A-Fa-f]{1,4}:){3}[0-9A-Fa-f]{1,4}::(?:(?:[0-9A-Fa-f]{1,4}:){0,1})?(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)|(?:[0-9A-Fa-f]{1,4}:){4}[0-9A-Fa-f]{1,4}::(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?|(?:[0-9A-Fa-f]{1,4}:){4}[0-9A-Fa-f]{1,4}::(?:(?:[0-9A-Fa-f]{1,4}:){0,0})?(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)|(?:[0-9A-Fa-f]{1,4}:){5}[0-9A-Fa-f]{1,4}::(?:(?:[0-9A-Fa-f]{1,4}:){0,0}[0-9A-Fa-f]{1,4})?|(?:[0-9A-Fa-f]{1,4}:){6}[0-9A-Fa-f]{1,4}::)$/.test(_i6))return false}else if(_in.length>15||!/^(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)$/.test(_in))return false}else{if(_s.length-(_at+1)>253)return false;let _ll=0,_pv=46;for(let _i=_at+1;_i<_s.length;_i++){const _c=_s.charCodeAt(_i);if(_c===46){if(_ll===0||_pv===45)return false;_ll=0}else if(!((_c<64?_c<32?0:67051520:_c<96?134217726:_c<128?134217726:0)>>>_c&1)||_c===45&&_pv===46||++_ll>63)return false;_pv=_c}if(_ll===0||_pv===45)return false}}return true}
function _deq(a,b){if(a===b)return true;if(a===null||b===null||typeof a!=='object'||typeof b!=='object')return false;var aa=Array.isArray(a);if(aa!==Array.isArray(b))return false;var i,k,x,y;if(aa){if(a.length!==b.length)return false;for(i=a.length;i--!==0;)if(!_deq(a[i],b[i]))return false;return true}var ka=Object.keys(a);if(ka.length!==Object.keys(b).length)return false;for(i=ka.length;i--!==0;){k=ka[i];if(!Object.prototype.hasOwnProperty.call(b,k))return false;x=a[k];y=b[k];if(x!==y&&(x===null||y===null||typeof x!=='object'||typeof y!=='object'))return false}for(i=ka.length;i--!==0;){k=ka[i];x=a[k];if(x!==null&&typeof x==='object'&&!_deq(x,b[k]))return false}return true}
function _uqh(x) {
if (x === null) return 1;
var t = typeof x, h, i;
if (t === 'boolean') return x ? 2 : 3;
if (t === 'number') {
if (x === 0) return 4;
h = x | 0;
if (h === x) return Math.imul(h, 0x9e3779b1) ^ 5;
var f = _uqh.f || (_uqh.f = new Float64Array(1)), w = _uqh.w || (_uqh.w = new Uint32Array(f.buffer));
f[0] = x;
return Math.imul(w[0] ^ Math.imul(w[1], 0x9e3779b1), 0x85ebca6b) ^ 5;
}
if (t === 'string') {
h = 0x811c9dc5 ^ x.length;
for (i = 0; i < x.length; i++) h = Math.imul(h ^ x.charCodeAt(i), 16777619);
return h;
}
if (t !== 'object') return 6;
if (Array.isArray(x)) {
h = 0x2545f491 ^ x.length;
for (i = 0; i < x.length; i++) h = Math.imul(h ^ _uqh(x[i]), 16777619);
return h;
}
var ks = Object.keys(x);
h = 0x6c8e9cf5 ^ ks.length;
for (i = 0; i < ks.length; i++) h = (h + Math.imul(_uqh(ks[i]) ^ Math.imul(_uqh(x[ks[i]]), 0x5bd1e995), 0x27d4eb2d)) | 0;
return h;
}function _uq(a) {
var n = a.length, i, k;
if (n < 2) return true;
if (n <= 12) {
for (i = 1; i < n; i++) for (k = 0; k < i; k++) if (_deq(a[i], a[k])) return false;
return true;
}
var prim = true;
for (i = 0; i < n; i++) { var x = a[i]; if (x !== null && typeof x === 'object') { prim = false; break; } }
if (prim) {
var s = new Set();
for (i = 0; i < n; i++) { if (s.has(a[i])) return false; s.add(a[i]); }
return true;
}
var m = new Map();
for (i = 0; i < n; i++) {
var hh = _uqh(a[i]), b = m.get(hh);
if (b === undefined) m.set(hh, i);
else if (typeof b === 'number') { if (_deq(a[b], a[i])) return false; m.set(hh, [b, i]); }
else { for (k = 0; k < b.length; k++) if (_deq(a[b[k]], a[i])) return false; b.push(i); }
}
return true;
}
var _uqpI=0;function _uqp(a) {
var n = a.length, i, k;
if (n < 2) return -1;
if (n <= 12) {
for (i = 0; i < n - 1; i++) for (k = i + 1; k < n; k++) if (_deq(a[i], a[k])) { _uqpI = i; return k; }
return -1;
}
var prim = true;
for (i = 0; i < n; i++) { var x = a[i]; if (x !== null && typeof x === 'object') { prim = false; break; } }
var bi = -1, bj = -1, m = new Map();
if (prim) {
for (i = 0; i < n; i++) {
var p = m.get(a[i]);
if (p === undefined) m.set(a[i], i);
else if (p >= 0) { if (bi < 0 || p < bi) { bi = p; bj = i; } m.set(a[i], -1); }
}
} else {
var paired = null;
for (i = 0; i < n; i++) {
var hh = _uqh(a[i]), b = m.get(hh), r = -1;
if (b === undefined) { m.set(hh, i); continue; }
if (typeof b === 'number') { if (_deq(a[b], a[i])) r = b; else m.set(hh, [b, i]); }
else { for (k = 0; k < b.length; k++) if (_deq(a[b[k]], a[i])) { r = b[k]; break; } if (r < 0) b.push(i); }
if (r >= 0) {
if (paired === null) paired = new Set();
if (!paired.has(r)) { paired.add(r); if (bi < 0 || r < bi) { bi = r; bj = i; } }
}
}
}
if (bi < 0) return -1;
_uqpI = bi;
return bj;
}
const _PN=({}).__proto__===Object.prototype;const _OP=Object.prototype;const _gp=Object.getPrototypeOf;
const _hop=Object.prototype.hasOwnProperty;
function _h(o,k){return _hop.call(o,k)}
function _nk(o,n){return (_PN?o.__proto__:_gp(o))===_OP||Object.keys(o).length!==n}
const R=Object.freeze({valid:true,errors:Object.freeze([])});
const H=[
function(R,E){return function(d){if(!Number.isInteger(d))return E(d)
  if(d<1)return E(d)
  return R}},
function(R,E){return function(d){if(typeof d!=='string')return E(d)
  if(!_em(d))return E(d)
  return R}},
function(R,E){return function(d){if(!Number.isInteger(d))return E(d)
  if(d<21)return E(d)
  if(d>100)return E(d)
  return R}},
function(R,E){return function(d){if(typeof d!=='string')return E(d)
  if(!(d==="admin"||d==="editor"||d==="viewer"))return E(d)
  return R}},
function(R,E){return function(d){if(!Array.isArray(d))return E(d)
  if(d.length<1)return E(d)
  {if(!_uq(d))return E(d)}
  for(let _j1=0;_j1<d.length;_j1++){const _e1=d[_j1]
  if(typeof _e1!=='string')return E(d)
  if(!(_e1==="admin"||_e1==="editor"||_e1==="viewer"))return E(d)
  }
  return R}},
function(R,E){return function(d){const _pk0=typeof d==='object'&&d!==null&&((_PN?d.__proto__:_gp(d))===_OP)
  if(typeof d!=='object'||d===null||Array.isArray(d))return E(d)
  if(d["id"]===undefined||!(_pk0||_h(d,"id"))||d["email"]===undefined||!(_pk0||_h(d,"email"))||d["age"]===undefined||!(_pk0||_h(d,"age"))||d["roles"]===undefined||!(_pk0||_h(d,"roles")))return E(d)
  if(!Number.isInteger(d["id"]))return E(d)
  if(d["id"]<1)return E(d)
  if(typeof d["email"]!=='string')return E(d)
  if(!_em(d["email"]))return E(d)
  if(!Number.isInteger(d["age"]))return E(d)
  if(d["age"]<21)return E(d)
  if(d["age"]>100)return E(d)
  if(!Array.isArray(d["roles"]))return E(d)
  if(d["roles"].length<1)return E(d)
  {if(!_uq(d["roles"]))return E(d)}
  for(let _j2=0;_j2<d["roles"].length;_j2++){const _e2=d["roles"][_j2]
  if(typeof _e2!=='string')return E(d)
  if(!(_e2==="admin"||_e2==="editor"||_e2==="viewer"))return E(d)
  }
  var _n=0;for(var _k in d)_n++;if(_n!==4&&(_pk0||_nk(d,4)))return E(d)
  return R}}
];
const EF=[
function(d){var _all=true;const _e=[];
  const _cpLen=s=>{let n=0;for(const _ of s)n++;return n}
  if(!(Number.isInteger(d))){_e.push({code:'ATA1001',keyword:'type',instancePath:"",schemaPath:'#/type',params:{type:'integer'},message:'must be integer',docUrl:'https://ata-validator.com/e/ATA1001'});if(!_all)return{valid:false,errors:_e}}
  if(typeof d==='number'&&d<1){_e.push({code:'ATA2003',keyword:'minimum',instancePath:"",schemaPath:'#/minimum',params:{comparison:'>=',limit:1},message:'must be >= 1',docUrl:'https://ata-validator.com/e/ATA2003'});if(!_all)return{valid:false,errors:_e}}
  return{valid:_e.length===0,errors:_e}},
function(d){var _all=true;const _e=[];
  const _cpLen=s=>{let n=0;for(const _ of s)n++;return n}
  
  if(!(typeof d==='string')){_e.push({code:'ATA1001',keyword:'type',instancePath:"",schemaPath:'#/type',params:{type:'string'},message:'must be string',docUrl:'https://ata-validator.com/e/ATA1001'});if(!_all)return{valid:false,errors:_e}}
  _fmt0:{if(typeof d==='string'&&!_em(d)){_e.push({code:'ATA3001',keyword:'format',instancePath:"",schemaPath:'#/format',params:{format:'email'},message:'must match format "email"',docUrl:'https://ata-validator.com/e/ATA3001'});if(!_all)return{valid:false,errors:_e};break _fmt0}}
  return{valid:_e.length===0,errors:_e}},
function(d){var _all=true;const _e=[];
  const _cpLen=s=>{let n=0;for(const _ of s)n++;return n}
  if(!(Number.isInteger(d))){_e.push({code:'ATA1001',keyword:'type',instancePath:"",schemaPath:'#/type',params:{type:'integer'},message:'must be integer',docUrl:'https://ata-validator.com/e/ATA1001'});if(!_all)return{valid:false,errors:_e}}
  if(typeof d==='number'&&d<21){_e.push({code:'ATA2003',keyword:'minimum',instancePath:"",schemaPath:'#/minimum',params:{comparison:'>=',limit:21},message:'must be >= 21',docUrl:'https://ata-validator.com/e/ATA2003'});if(!_all)return{valid:false,errors:_e}}
  if(typeof d==='number'&&d>100){_e.push({code:'ATA2004',keyword:'maximum',instancePath:"",schemaPath:'#/maximum',params:{comparison:'<=',limit:100},message:'must be <= 100',docUrl:'https://ata-validator.com/e/ATA2004'});if(!_all)return{valid:false,errors:_e}}
  return{valid:_e.length===0,errors:_e}},
function(d){var _all=true;const _e=[];
  const _cpLen=s=>{let n=0;for(const _ of s)n++;return n}
  if(!(typeof d==='string')){_e.push({code:'ATA1001',keyword:'type',instancePath:"",schemaPath:'#/type',params:{type:'string'},message:'must be string',docUrl:'https://ata-validator.com/e/ATA1001'});if(!_all)return{valid:false,errors:_e}}
  if(!(d==="admin"||d==="editor"||d==="viewer")){_e.push({code:'ATA6001',keyword:'enum',instancePath:"",schemaPath:'#/enum',params:{allowedValues:["admin","editor","viewer"]},message:'must be equal to one of the allowed values',docUrl:'https://ata-validator.com/e/ATA6001'});if(!_all)return{valid:false,errors:_e}}
  return{valid:_e.length===0,errors:_e}},
function(d){var _all=true;const _e=[];
  const _cpLen=s=>{let n=0;for(const _ of s)n++;return n}
  
  
  
  if(!(Array.isArray(d))){_e.push({code:'ATA1001',keyword:'type',instancePath:"",schemaPath:'#/type',params:{type:'array'},message:'must be array',docUrl:'https://ata-validator.com/e/ATA1001'});if(!_all)return{valid:false,errors:_e}}
  if(Array.isArray(d)&&d.length<1){_e.push({code:'ATA2008',keyword:'minItems',instancePath:"",schemaPath:'#/minItems',params:{limit:1},message:'must NOT have fewer than 1 items',docUrl:'https://ata-validator.com/e/ATA2008'});if(!_all)return{valid:false,errors:_e}}
  if(Array.isArray(d)){const _j0=_uqp(d);if(_j0>=0){const _i0=_uqpI;_e.push({code:'ATA2012',keyword:'uniqueItems',instancePath:"",schemaPath:'#/uniqueItems',params:{i:_i0,j:_j0},message:'must NOT have duplicate items (items ## '+_j0+' and '+_i0+' are identical)',docUrl:'https://ata-validator.com/e/ATA2012'});if(!_all)return{valid:false,errors:_e}}}
  if(Array.isArray(d)){for(let _j1=0;_j1<d.length;_j1++){const _ei1=d[_j1]
  if(!(typeof _ei1==='string')){_e.push({code:'ATA1001',keyword:'type',instancePath:'/'+_j1,schemaPath:'#/items/type',params:{type:'string'},message:'must be string',docUrl:'https://ata-validator.com/e/ATA1001'});if(!_all)return{valid:false,errors:_e}}
  if(!(_ei1==="admin"||_ei1==="editor"||_ei1==="viewer")){_e.push({code:'ATA6001',keyword:'enum',instancePath:'/'+_j1,schemaPath:'#/items/enum',params:{allowedValues:["admin","editor","viewer"]},message:'must be equal to one of the allowed values',docUrl:'https://ata-validator.com/e/ATA6001'});if(!_all)return{valid:false,errors:_e}}
  }}
  return{valid:_e.length===0,errors:_e}},
function(d){var _all=true;const _e=[];
  const _cpLen=s=>{let n=0;for(const _ of s)n++;return n}
  
  
  
  const _a1=new Set(["id","email","age","roles"])
  
  
  
  
  const _pk0=typeof d==='object'&&d!==null&&((_PN?d.__proto__:_gp(d))===_OP)
  if(!((typeof d==='object'&&d!==null&&!Array.isArray(d)))){_e.push({code:'ATA1001',keyword:'type',instancePath:"",schemaPath:'#/type',params:{type:'object'},message:'must be object',docUrl:'https://ata-validator.com/e/ATA1001'});if(!_all)return{valid:false,errors:_e}}
  if(typeof d==='object'&&d!==null&&!Array.isArray(d)&&(d["id"]===undefined||!(_pk0||_h(d,"id")))){_e.push({code:'ATA7001',keyword:'required',instancePath:"",schemaPath:'#/required',params:{missingProperty:'id'},message:"must have required property 'id'",docUrl:'https://ata-validator.com/e/ATA7001'});if(!_all)return{valid:false,errors:_e}}
  if(typeof d==='object'&&d!==null&&!Array.isArray(d)&&(d["email"]===undefined||!(_pk0||_h(d,"email")))){_e.push({code:'ATA7001',keyword:'required',instancePath:"",schemaPath:'#/required',params:{missingProperty:'email'},message:"must have required property 'email'",docUrl:'https://ata-validator.com/e/ATA7001'});if(!_all)return{valid:false,errors:_e}}
  if(typeof d==='object'&&d!==null&&!Array.isArray(d)&&(d["age"]===undefined||!(_pk0||_h(d,"age")))){_e.push({code:'ATA7001',keyword:'required',instancePath:"",schemaPath:'#/required',params:{missingProperty:'age'},message:"must have required property 'age'",docUrl:'https://ata-validator.com/e/ATA7001'});if(!_all)return{valid:false,errors:_e}}
  if(typeof d==='object'&&d!==null&&!Array.isArray(d)&&(d["roles"]===undefined||!(_pk0||_h(d,"roles")))){_e.push({code:'ATA7001',keyword:'required',instancePath:"",schemaPath:'#/required',params:{missingProperty:'roles'},message:"must have required property 'roles'",docUrl:'https://ata-validator.com/e/ATA7001'});if(!_all)return{valid:false,errors:_e}}
  if(typeof d==='object'&&d!==null&&!Array.isArray(d)){let _x1=0;for(const _f1 in d)if(!_pk0&&!_hop.call(d,_f1))continue;else {if(_f1!=="id"&&_f1!=="email"&&_f1!=="age"&&_f1!=="roles"){_x1=1;break}}if(_x1){const _k1=Object.keys(d);for(let _i=0;_i<_k1.length;_i++){if(!_a1.has(_k1[_i])){_e.push({code:'ATA7002',keyword:'additionalProperties',instancePath:"",schemaPath:'#/additionalProperties',params:{additionalProperty:_k1[_i]},message:'must NOT have additional properties',docUrl:'https://ata-validator.com/e/ATA7002'});if(!_all)return{valid:false,errors:_e}}}}}
  if(typeof d==='object'&&d!==null&&!Array.isArray(d)){const _c3=d["id"];if(_c3!==undefined&&(_pk0?"id" in d:_h(d,"id"))){
  if(!(Number.isInteger(_c3))){_e.push({code:'ATA1001',keyword:'type',instancePath:'/id',schemaPath:'#/properties/id/type',params:{type:'integer'},message:'must be integer',docUrl:'https://ata-validator.com/e/ATA1001'});if(!_all)return{valid:false,errors:_e}}
  if(typeof _c3==='number'&&_c3<1){_e.push({code:'ATA2003',keyword:'minimum',instancePath:'/id',schemaPath:'#/properties/id/minimum',params:{comparison:'>=',limit:1},message:'must be >= 1',docUrl:'https://ata-validator.com/e/ATA2003'});if(!_all)return{valid:false,errors:_e}}
  }}
  if(typeof d==='object'&&d!==null&&!Array.isArray(d)){const _c4=d["email"];if(_c4!==undefined&&(_pk0?"email" in d:_h(d,"email"))){
  if(!(typeof _c4==='string')){_e.push({code:'ATA1001',keyword:'type',instancePath:'/email',schemaPath:'#/properties/email/type',params:{type:'string'},message:'must be string',docUrl:'https://ata-validator.com/e/ATA1001'});if(!_all)return{valid:false,errors:_e}}
  _fmt5:{if(typeof _c4==='string'&&!_em(_c4)){_e.push({code:'ATA3001',keyword:'format',instancePath:'/email',schemaPath:'#/properties/email/format',params:{format:'email'},message:'must match format "email"',docUrl:'https://ata-validator.com/e/ATA3001'});if(!_all)return{valid:false,errors:_e};break _fmt5}}
  }}
  if(typeof d==='object'&&d!==null&&!Array.isArray(d)){const _c6=d["age"];if(_c6!==undefined&&(_pk0?"age" in d:_h(d,"age"))){
  if(!(Number.isInteger(_c6))){_e.push({code:'ATA1001',keyword:'type',instancePath:'/age',schemaPath:'#/properties/age/type',params:{type:'integer'},message:'must be integer',docUrl:'https://ata-validator.com/e/ATA1001'});if(!_all)return{valid:false,errors:_e}}
  if(typeof _c6==='number'&&_c6<21){_e.push({code:'ATA2003',keyword:'minimum',instancePath:'/age',schemaPath:'#/properties/age/minimum',params:{comparison:'>=',limit:21},message:'must be >= 21',docUrl:'https://ata-validator.com/e/ATA2003'});if(!_all)return{valid:false,errors:_e}}
  if(typeof _c6==='number'&&_c6>100){_e.push({code:'ATA2004',keyword:'maximum',instancePath:'/age',schemaPath:'#/properties/age/maximum',params:{comparison:'<=',limit:100},message:'must be <= 100',docUrl:'https://ata-validator.com/e/ATA2004'});if(!_all)return{valid:false,errors:_e}}
  }}
  if(typeof d==='object'&&d!==null&&!Array.isArray(d)){const _c7=d["roles"];if(_c7!==undefined&&(_pk0?"roles" in d:_h(d,"roles"))){
  if(!(Array.isArray(_c7))){_e.push({code:'ATA1001',keyword:'type',instancePath:'/roles',schemaPath:'#/properties/roles/type',params:{type:'array'},message:'must be array',docUrl:'https://ata-validator.com/e/ATA1001'});if(!_all)return{valid:false,errors:_e}}
  if(Array.isArray(_c7)&&_c7.length<1){_e.push({code:'ATA2008',keyword:'minItems',instancePath:'/roles',schemaPath:'#/properties/roles/minItems',params:{limit:1},message:'must NOT have fewer than 1 items',docUrl:'https://ata-validator.com/e/ATA2008'});if(!_all)return{valid:false,errors:_e}}
  if(Array.isArray(_c7)){const _j8=_uqp(_c7);if(_j8>=0){const _i8=_uqpI;_e.push({code:'ATA2012',keyword:'uniqueItems',instancePath:'/roles',schemaPath:'#/properties/roles/uniqueItems',params:{i:_i8,j:_j8},message:'must NOT have duplicate items (items ## '+_j8+' and '+_i8+' are identical)',docUrl:'https://ata-validator.com/e/ATA2012'});if(!_all)return{valid:false,errors:_e}}}
  if(Array.isArray(_c7)){for(let _j9=0;_j9<_c7.length;_j9++){const _ei9=_c7[_j9]
  if(!(typeof _ei9==='string')){_e.push({code:'ATA1001',keyword:'type',instancePath:'/roles'+'/'+_j9,schemaPath:'#/properties/roles/items/type',params:{type:'string'},message:'must be string',docUrl:'https://ata-validator.com/e/ATA1001'});if(!_all)return{valid:false,errors:_e}}
  if(!(_ei9==="admin"||_ei9==="editor"||_ei9==="viewer")){_e.push({code:'ATA6001',keyword:'enum',instancePath:'/roles'+'/'+_j9,schemaPath:'#/properties/roles/items/enum',params:{allowedValues:["admin","editor","viewer"]},message:'must be equal to one of the allowed values',docUrl:'https://ata-validator.com/e/ATA6001'});if(!_all)return{valid:false,errors:_e}}
  }}
  }}
  return{valid:_e.length===0,errors:_e}}
];
export const [v1, v2, v3, v5, v4, v0]=[H[0](R,EF[0]),H[1](R,EF[1]),H[2](R,EF[2]),H[3](R,EF[3]),H[4](R,EF[4]),H[5](R,EF[5])];
`},Component:U,meta:{validator:{name:`ata`,draft2020:!1,precompiled:!0},fields:[`multi-enum`],widgets:[`checkboxes`]}};export{W as default};