import{Gt as e}from"./client.BXzhBlXN.js";var t=/import\s*(type)?\s*{.+?}\s*from\s+"@\/lib\/demo"/,n=/const\s*{.+?}\s*=\s*getDemoContext\(\);?/,r=/\n\s*\n+/g;function i(e){return e.replace(t,`import * as defaults from "$lib/sjsf/defaults"`).replace(n,``).replaceAll(r,`

`)}var[a,o]=e();export{a as n,o as r,i as t};