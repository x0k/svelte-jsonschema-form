import{e as te,i as ie}from"./_commonjsHelpers.BLl3nBgh.js";import{r as D,p as s,i as V,f as J,s as F}from"./definitions.BNybM5uv.js";import{p as O,f as T,b as f,a as j,c as k,g as B,u as P,w as U,s as M,r as b,t as z,h as H,n as ae,aK as A,aJ as L,J as E,m as Y,e as I,W as Z}from"./render.BKpHmBbc.js";import{b as q,s as g,h as re,k as K,j as N,i as R}from"./file.CvRlAZJC.js";import{s as S}from"./snippet.D1qEB4Ta.js";import{a as le,t as se}from"./bundle-mjs.D4DBVo8c.js";import"./legacy.cQpe_v0B.js";import"./file-include.C0Yiym2C.js";import"./JSONArrow_svelte_svelte_type_style_lang.74958d3e.l0sNRNKZ.js";import"./JSONNested_svelte_svelte_type_style_lang.3c95b736.l0sNRNKZ.js";import"./PreviewList_svelte_svelte_type_style_lang.08ca2152.l0sNRNKZ.js";import"./JSONValueNode_svelte_svelte_type_style_lang.253f11b4.l0sNRNKZ.js";import"./ErrorStack_svelte_svelte_type_style_lang.d411949f.l0sNRNKZ.js";import"./JSONStringNode_svelte_svelte_type_style_lang.c4a2a02c.l0sNRNKZ.js";import"./JSONFunctionNode_svelte_svelte_type_style_lang.ceef42f6.l0sNRNKZ.js";import"./RegExpNode_svelte_svelte_type_style_lang.0aa802f4.l0sNRNKZ.js";import"./Root_svelte_svelte_type_style_lang.f7adc256.l0sNRNKZ.js";import"./form_svelte_svelte_type_style_lang.1d31125e.l0sNRNKZ.js";import"./ajv.97j1ZsEZ.js";var oe=T('<button style="display: flex; gap: 0.5rem; align-items: center; height: 2rem"><!> </button>'),ne=T('<div><div style="display: flex; flex-direction: column; gap: 1rem"></div></div>');function de(t,e){O(e,!0);const r=D(e,["$$slots","$$events","$$legacy","icons"]),v={id:"root",required:!1,schema:{},uiSchema:{},title:"title"},w={"move-array-item-up":{},"move-array-item-down":{},"remove-array-item":{},"copy-array-item":{},"remove-object-property":{}};var c=ne();q(c,()=>({style:"height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center",...r}));var u=k(c);te(u,21,()=>Object.entries(w),ie,(y,m)=>{var l=P(()=>ae(B(m),2));let o=()=>B(l)[0],d=()=>B(l)[1];const _=P(o),C=P(()=>({config:v,translation:"",params:d()}));var x=oe(),n=k(x);S(n,()=>e.icons(B(_),B(C))??U,()=>B(C));var a=M(n);b(x),z(()=>H(a,` ${o()??""}`)),f(y,x)}),b(u),b(c),f(t,c),j()}var ce=L("<title> </title>"),ve=L("<desc> </desc>"),he=L('<svg><!><!><path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 2C7.77614 2 8 2.22386 8 2.5L8 11.2929L11.1464 8.14645C11.3417 7.95118 11.6583 7.95118 11.8536 8.14645C12.0488 8.34171 12.0488 8.65829 11.8536 8.85355L7.85355 12.8536C7.75979 12.9473 7.63261 13 7.5 13C7.36739 13 7.24021 12.9473 7.14645 12.8536L3.14645 8.85355C2.95118 8.65829 2.95118 8.34171 3.14645 8.14645C3.34171 7.95118 3.65829 7.95118 3.85355 8.14645L7 11.2929L7 2.5C7 2.22386 7.22386 2 7.5 2Z"></path></svg>');function ue(t,e){O(e,!0);const r=A("iconCtx")??{};let v=s(e,"size",19,()=>r.size||"24"),w=s(e,"role",19,()=>r.role||"img"),c=s(e,"color",19,()=>r.color||"currentColor"),u=s(e,"ariaLabel",3,"arrow down"),y=D(e,["$$slots","$$events","$$legacy","size","role","color","title","desc","ariaLabel"]),m=`${e.title?.id||""} ${e.desc?.id||""}`;const l=P(()=>!!(e.title?.id||e.desc?.id));var o=he();q(o,()=>({xmlns:"http://www.w3.org/2000/svg",...y,role:w(),width:v(),height:v(),fill:c(),"aria-label":u(),"aria-describedby":B(l)?m:void 0,viewBox:"0 0 15 15"}));var d=k(o);{var _=n=>{var a=ce(),i=k(a,!0);b(a),z(()=>{g(a,"id",e.title.id),H(i,e.title.title)}),f(n,a)};V(d,n=>{e.title?.id&&e.title.title&&n(_)})}var C=M(d);{var x=n=>{var a=ve(),i=k(a,!0);b(a),z(()=>{g(a,"id",e.desc.id),H(i,e.desc.desc)}),f(n,a)};V(C,n=>{e.desc?.id&&e.desc.desc&&n(x)})}E(),b(o),f(t,o),j()}var me=L("<title> </title>"),we=L("<desc> </desc>"),ge=L('<svg><!><!><path fill-rule="evenodd" clip-rule="evenodd" d="M7.14645 2.14645C7.34171 1.95118 7.65829 1.95118 7.85355 2.14645L11.8536 6.14645C12.0488 6.34171 12.0488 6.65829 11.8536 6.85355C11.6583 7.04882 11.3417 7.04882 11.1464 6.85355L8 3.70711L8 12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5L7 3.70711L3.85355 6.85355C3.65829 7.04882 3.34171 7.04882 3.14645 6.85355C2.95118 6.65829 2.95118 6.34171 3.14645 6.14645L7.14645 2.14645Z"></path></svg>');function fe(t,e){O(e,!0);const r=A("iconCtx")??{};let v=s(e,"size",19,()=>r.size||"24"),w=s(e,"role",19,()=>r.role||"img"),c=s(e,"color",19,()=>r.color||"currentColor"),u=s(e,"ariaLabel",3,"arrow up"),y=D(e,["$$slots","$$events","$$legacy","size","role","color","title","desc","ariaLabel"]),m=`${e.title?.id||""} ${e.desc?.id||""}`;const l=P(()=>!!(e.title?.id||e.desc?.id));var o=ge();q(o,()=>({xmlns:"http://www.w3.org/2000/svg",...y,role:w(),width:v(),height:v(),fill:c(),"aria-label":u(),"aria-describedby":B(l)?m:void 0,viewBox:"0 0 15 15"}));var d=k(o);{var _=n=>{var a=me(),i=k(a,!0);b(a),z(()=>{g(a,"id",e.title.id),H(i,e.title.title)}),f(n,a)};V(d,n=>{e.title?.id&&e.title.title&&n(_)})}var C=M(d);{var x=n=>{var a=we(),i=k(a,!0);b(a),z(()=>{g(a,"id",e.desc.id),H(i,e.desc.desc)}),f(n,a)};V(C,n=>{e.desc?.id&&e.desc.desc&&n(x)})}E(),b(o),f(t,o),j()}var be=L("<title> </title>"),ye=L("<desc> </desc>"),xe=L('<svg><!><!><path fill-rule="evenodd" clip-rule="evenodd" d="M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006L2 2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00002H5.5C4.67158 4.00002 4 4.67159 4 5.50002V12.5C4 13.3284 4.67158 14 5.5 14H12.5C13.3284 14 14 13.3284 14 12.5V5.50002C14 4.67159 13.3284 4.00002 12.5 4.00002H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006H2.5C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50002C5 5.22388 5.22386 5.00002 5.5 5.00002H12.5C12.7761 5.00002 13 5.22388 13 5.50002V12.5C13 12.7762 12.7761 13 12.5 13H5.5C5.22386 13 5 12.7762 5 12.5V5.50002Z"></path></svg>');function ke(t,e){O(e,!0);const r=A("iconCtx")??{};let v=s(e,"size",19,()=>r.size||"24"),w=s(e,"role",19,()=>r.role||"img"),c=s(e,"color",19,()=>r.color||"currentColor"),u=s(e,"ariaLabel",3,"copy"),y=D(e,["$$slots","$$events","$$legacy","size","role","color","title","desc","ariaLabel"]),m=`${e.title?.id||""} ${e.desc?.id||""}`;const l=P(()=>!!(e.title?.id||e.desc?.id));var o=xe();q(o,()=>({xmlns:"http://www.w3.org/2000/svg",...y,role:w(),width:v(),height:v(),fill:c(),"aria-label":u(),"aria-describedby":B(l)?m:void 0,viewBox:"0 0 15 15"}));var d=k(o);{var _=n=>{var a=be(),i=k(a,!0);b(a),z(()=>{g(a,"id",e.title.id),H(i,e.title.title)}),f(n,a)};V(d,n=>{e.title?.id&&e.title.title&&n(_)})}var C=M(d);{var x=n=>{var a=ye(),i=k(a,!0);b(a),z(()=>{g(a,"id",e.desc.id),H(i,e.desc.desc)}),f(n,a)};V(C,n=>{e.desc?.id&&e.desc.desc&&n(x)})}E(),b(o),f(t,o),j()}var _e=L("<title> </title>"),Ce=L("<desc> </desc>"),ze=L('<svg><!><!><path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"></path></svg>');function Le(t,e){O(e,!0);const r=A("iconCtx")??{};let v=s(e,"size",19,()=>r.size||"24"),w=s(e,"role",19,()=>r.role||"img"),c=s(e,"color",19,()=>r.color||"currentColor"),u=s(e,"ariaLabel",3,"trash"),y=D(e,["$$slots","$$events","$$legacy","size","role","color","title","desc","ariaLabel"]),m=`${e.title?.id||""} ${e.desc?.id||""}`;const l=P(()=>!!(e.title?.id||e.desc?.id));var o=ze();q(o,()=>({xmlns:"http://www.w3.org/2000/svg",...y,role:w(),width:v(),height:v(),fill:c(),"aria-label":u(),"aria-describedby":B(l)?m:void 0,viewBox:"0 0 15 15"}));var d=k(o);{var _=n=>{var a=_e(),i=k(a,!0);b(a),z(()=>{g(a,"id",e.title.id),H(i,e.title.title)}),f(n,a)};V(d,n=>{e.title?.id&&e.title.title&&n(_)})}var C=M(d);{var x=n=>{var a=Ce(),i=k(a,!0);b(a),z(()=>{g(a,"id",e.desc.id),H(i,e.desc.desc)}),f(n,a)};V(C,n=>{e.desc?.id&&e.desc.desc&&n(x)})}E(),b(o),f(t,o),j()}const Me=t=>{fe(t,{size:"20"})},He=t=>{ue(t,{size:"20"})},X=t=>{Le(t,{size:"20"})},We=t=>{ke(t,{size:"20"})},Ve={"move-array-item-up":Me,"move-array-item-down":He,"remove-array-item":X,"copy-array-item":We,"remove-object-property":X},De=J(Ve);/**
 * @license @lucide/svelte v0.544.0 - ISC
 *
 * ISC License
 * 
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * 
 * ---
 * 
 * The MIT License (MIT) (for portions derived from Feather)
 * 
 * Copyright (c) 2013-2023 Cole Bemis
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */const Oe={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};var je=L("<svg><!><!></svg>");function G(t,e){O(e,!0);const r=s(e,"color",3,"currentColor"),v=s(e,"size",3,24),w=s(e,"strokeWidth",3,2),c=s(e,"absoluteStrokeWidth",3,!1),u=s(e,"iconNode",19,()=>[]),y=D(e,["$$slots","$$events","$$legacy","name","color","size","strokeWidth","absoluteStrokeWidth","iconNode","children"]);var m=je();q(m,d=>({...Oe,...y,width:v(),height:v(),stroke:r(),"stroke-width":d,class:["lucide-icon lucide",e.name&&`lucide-${e.name}`,e.class]}),[()=>c()?Number(w())*24/Number(v()):w()]);var l=k(m);te(l,17,u,ie,(d,_)=>{var C=P(()=>ae(B(_),2));let x=()=>B(C)[0],n=()=>B(C)[1];var a=Y(),i=I(a);le(i,x,!0,(h,W)=>{q(h,()=>({...n()}))}),f(d,a)});var o=M(l);S(o,()=>e.children??U),b(m),f(t,m),j()}function Be(t,e){O(e,!0);/**
 * @license @lucide/svelte v0.544.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */let r=D(e,["$$slots","$$events","$$legacy"]);const v=[["path",{d:"m5 12 7-7 7 7"}],["path",{d:"M12 19V5"}]];G(t,F({name:"arrow-up"},()=>r,{get iconNode(){return v},children:(w,c)=>{var u=Y(),y=I(u);S(y,()=>e.children??U),f(w,u)},$$slots:{default:!0}})),j()}function Ne(t,e){O(e,!0);/**
 * @license @lucide/svelte v0.544.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */let r=D(e,["$$slots","$$events","$$legacy"]);const v=[["path",{d:"M12 5v14"}],["path",{d:"m19 12-7 7-7-7"}]];G(t,F({name:"arrow-down"},()=>r,{get iconNode(){return v},children:(w,c)=>{var u=Y(),y=I(u);S(y,()=>e.children??U),f(w,u)},$$slots:{default:!0}})),j()}function qe(t,e){O(e,!0);/**
 * @license @lucide/svelte v0.544.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */let r=D(e,["$$slots","$$events","$$legacy"]);const v=[["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"}],["path",{d:"M3 6h18"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}]];G(t,F({name:"trash"},()=>r,{get iconNode(){return v},children:(w,c)=>{var u=Y(),y=I(u);S(y,()=>e.children??U),f(w,u)},$$slots:{default:!0}})),j()}function Pe(t,e){O(e,!0);/**
 * @license @lucide/svelte v0.544.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */let r=D(e,["$$slots","$$events","$$legacy"]);const v=[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"}]];G(t,F({name:"copy"},()=>r,{get iconNode(){return v},children:(w,c)=>{var u=Y(),y=I(u);S(y,()=>e.children??U),f(w,u)},$$slots:{default:!0}})),j()}const Ae=t=>{Be(t,{size:20})},Ze=t=>{Ne(t,{size:20})},p=t=>{qe(t,{size:20})},Te=t=>{Pe(t,{size:20})},Ue={"move-array-item-up":Ae,"move-array-item-down":Ze,"remove-array-item":p,"copy-array-item":Te,"remove-object-property":p},Ee=J(Ue);function Q(...t){return se(re(t))}var Se=L("<title> </title>"),Ye=L("<desc> </desc>"),Ie=L('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 14-4-4m4 4 4-4"></path></svg>');function Je(t,e){O(e,!0);const r=A("iconCtx")??{},v={xs:"w-3 h-3",sm:"w-4 h-4",md:"w-5 h-5",lg:"w-6 h-6",xl:"w-8 h-8"};let w=s(e,"size",19,()=>r.size||"md"),c=s(e,"color",19,()=>r.color||"currentColor"),u=s(e,"strokeWidth",19,()=>r.strokeWidth||2),y=D(e,["$$slots","$$events","$$legacy","size","color","title","strokeWidth","desc","class","ariaLabel"]),m=`${e.title?.id||""} ${e.desc?.id||""}`.trim();const l=!!(e.title?.id||e.desc?.id),o=!!e.ariaLabel||l;var d=Ie();q(d,i=>({xmlns:"http://www.w3.org/2000/svg",fill:"none",color:c(),...y,class:i,viewBox:"0 0 24 24","aria-label":e.ariaLabel,"aria-describedby":l?m:void 0,"aria-hidden":!o}),[()=>Q("shrink-0",v[w()],e.class)]);var _=k(d);{var C=i=>{var h=Se(),W=k(h,!0);b(h),z(()=>{g(h,"id",e.title.id),H(W,e.title.title)}),f(i,h)};V(_,i=>{e.title?.id&&e.title.title&&i(C)})}var x=M(_);{var n=i=>{var h=Ye(),W=k(h,!0);b(h),z(()=>{g(h,"id",e.desc.id),H(W,e.desc.desc)}),f(i,h)};V(x,i=>{e.desc?.id&&e.desc.desc&&i(n)})}var a=M(x);b(d),z(()=>g(a,"stroke-width",u())),f(t,d),j()}var Fe=L("<title> </title>"),Ke=L("<desc> </desc>"),Re=L('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M12 6v13m0-13 4 4m-4-4-4 4"></path></svg>');function Ge(t,e){O(e,!0);const r=A("iconCtx")??{},v={xs:"w-3 h-3",sm:"w-4 h-4",md:"w-5 h-5",lg:"w-6 h-6",xl:"w-8 h-8"};let w=s(e,"size",19,()=>r.size||"md"),c=s(e,"color",19,()=>r.color||"currentColor"),u=s(e,"strokeWidth",19,()=>r.strokeWidth||2),y=D(e,["$$slots","$$events","$$legacy","size","color","title","strokeWidth","desc","class","ariaLabel"]),m=`${e.title?.id||""} ${e.desc?.id||""}`.trim();const l=!!(e.title?.id||e.desc?.id),o=!!e.ariaLabel||l;var d=Re();q(d,i=>({xmlns:"http://www.w3.org/2000/svg",fill:"none",color:c(),...y,class:i,viewBox:"0 0 24 24","aria-label":e.ariaLabel,"aria-describedby":l?m:void 0,"aria-hidden":!o}),[()=>Q("shrink-0",v[w()],e.class)]);var _=k(d);{var C=i=>{var h=Fe(),W=k(h,!0);b(h),z(()=>{g(h,"id",e.title.id),H(W,e.title.title)}),f(i,h)};V(_,i=>{e.title?.id&&e.title.title&&i(C)})}var x=M(_);{var n=i=>{var h=Ke(),W=k(h,!0);b(h),z(()=>{g(h,"id",e.desc.id),H(W,e.desc.desc)}),f(i,h)};V(x,i=>{e.desc?.id&&e.desc.desc&&i(n)})}var a=M(x);b(d),z(()=>g(a,"stroke-width",u())),f(t,d),j()}var Qe=L("<title> </title>"),Xe=L("<desc> </desc>"),pe=L('<svg><!><!><path stroke="currentColor" stroke-linejoin="round" d="M9 8v3a1 1 0 0 1-1 1H5m11 4h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v1m4 3v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7.13a1 1 0 0 1 .24-.65L7.7 8.35A1 1 0 0 1 8.46 8H13a1 1 0 0 1 1 1Z"></path></svg>');function $e(t,e){O(e,!0);const r=A("iconCtx")??{},v={xs:"w-3 h-3",sm:"w-4 h-4",md:"w-5 h-5",lg:"w-6 h-6",xl:"w-8 h-8"};let w=s(e,"size",19,()=>r.size||"md"),c=s(e,"color",19,()=>r.color||"currentColor"),u=s(e,"strokeWidth",19,()=>r.strokeWidth||2),y=D(e,["$$slots","$$events","$$legacy","size","color","title","strokeWidth","desc","class","ariaLabel"]),m=`${e.title?.id||""} ${e.desc?.id||""}`.trim();const l=!!(e.title?.id||e.desc?.id),o=!!e.ariaLabel||l;var d=pe();q(d,i=>({xmlns:"http://www.w3.org/2000/svg",fill:"none",color:c(),...y,class:i,viewBox:"0 0 24 24","aria-label":e.ariaLabel,"aria-describedby":l?m:void 0,"aria-hidden":!o}),[()=>Q("shrink-0",v[w()],e.class)]);var _=k(d);{var C=i=>{var h=Qe(),W=k(h,!0);b(h),z(()=>{g(h,"id",e.title.id),H(W,e.title.title)}),f(i,h)};V(_,i=>{e.title?.id&&e.title.title&&i(C)})}var x=M(_);{var n=i=>{var h=Xe(),W=k(h,!0);b(h),z(()=>{g(h,"id",e.desc.id),H(W,e.desc.desc)}),f(i,h)};V(x,i=>{e.desc?.id&&e.desc.desc&&i(n)})}var a=M(x);b(d),z(()=>g(a,"stroke-width",u())),f(t,d),j()}var et=L("<title> </title>"),tt=L("<desc> </desc>"),it=L('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"></path></svg>');function at(t,e){O(e,!0);const r=A("iconCtx")??{},v={xs:"w-3 h-3",sm:"w-4 h-4",md:"w-5 h-5",lg:"w-6 h-6",xl:"w-8 h-8"};let w=s(e,"size",19,()=>r.size||"md"),c=s(e,"color",19,()=>r.color||"currentColor"),u=s(e,"strokeWidth",19,()=>r.strokeWidth||2),y=D(e,["$$slots","$$events","$$legacy","size","color","title","strokeWidth","desc","class","ariaLabel"]),m=`${e.title?.id||""} ${e.desc?.id||""}`.trim();const l=!!(e.title?.id||e.desc?.id),o=!!e.ariaLabel||l;var d=it();q(d,i=>({xmlns:"http://www.w3.org/2000/svg",fill:"none",color:c(),...y,class:i,viewBox:"0 0 24 24","aria-label":e.ariaLabel,"aria-describedby":l?m:void 0,"aria-hidden":!o}),[()=>Q("shrink-0",v[w()],e.class)]);var _=k(d);{var C=i=>{var h=et(),W=k(h,!0);b(h),z(()=>{g(h,"id",e.title.id),H(W,e.title.title)}),f(i,h)};V(_,i=>{e.title?.id&&e.title.title&&i(C)})}var x=M(_);{var n=i=>{var h=tt(),W=k(h,!0);b(h),z(()=>{g(h,"id",e.desc.id),H(W,e.desc.desc)}),f(i,h)};V(x,i=>{e.desc?.id&&e.desc.desc&&i(n)})}var a=M(x);b(d),z(()=>g(a,"stroke-width",u())),f(t,d),j()}const rt=t=>{Ge(t,{})},lt=t=>{Je(t,{})},$=t=>{at(t,{})},st=t=>{$e(t,{})},ot={"move-array-item-up":rt,"move-array-item-down":lt,"remove-array-item":$,"copy-array-item":st,"remove-object-property":$},nt=J(ot);var dt=T('<div aria-label="arrow-down" role="img"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7 7 7-7"></path><path d="M12 14v5"></path><path d="M12 5v9" class="svelte-1rktpzn"></path></svg></div>');const ct={hash:"svelte-1rktpzn",code:"div.svelte-1rktpzn {display:inline-block;}path.svelte-1rktpzn {transition:all 0.2s ease-out;}.head.svelte-1rktpzn {transform:translateY(-3px);}"};function vt(t,e){K(t,ct);let r=s(e,"color",3,"currentColor"),v=s(e,"size",3,24),w=s(e,"strokeWidth",3,2),c=s(e,"isHovered",7,!1),u=s(e,"class",3,"");function y(){c(!0),setTimeout(()=>{c(!1)},200)}var m=dt(),l=k(m),o=k(l);let d;var _=M(o);let C;E(),b(l),b(m),z((x,n)=>{N(m,1,R(u()),"svelte-1rktpzn"),g(l,"width",v()),g(l,"height",v()),g(l,"stroke",r()),g(l,"stroke-width",w()),d=N(o,0,"svelte-1rktpzn",null,d,x),C=N(_,0,"svelte-1rktpzn",null,C,n)},[()=>({head:c()}),()=>({head:c()})]),Z("mouseenter",m,y),f(t,m)}var ht=T('<div aria-label="arrow-up" role="img"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"></path><path d="M12 10V5"></path><path d="M12 19V10" class="svelte-1oh036w"></path></svg></div>');const ut={hash:"svelte-1oh036w",code:"div.svelte-1oh036w {display:inline-block;}path.svelte-1oh036w {transition:all 0.2s ease-out;}.head.svelte-1oh036w {transform:translateY(3px);}"};function mt(t,e){K(t,ut);let r=s(e,"color",3,"currentColor"),v=s(e,"size",3,24),w=s(e,"strokeWidth",3,2),c=s(e,"isHovered",7,!1),u=s(e,"class",3,"");function y(){c(!0),setTimeout(()=>{c(!1)},200)}var m=ht(),l=k(m),o=k(l);let d;var _=M(o);let C;E(),b(l),b(m),z((x,n)=>{N(m,1,R(u()),"svelte-1oh036w"),g(l,"width",v()),g(l,"height",v()),g(l,"stroke",r()),g(l,"stroke-width",w()),d=N(o,0,"svelte-1oh036w",null,d,x),C=N(_,0,"svelte-1oh036w",null,C,n)},[()=>({head:c()}),()=>({head:c()})]),Z("mouseenter",m,y),f(t,m)}var wt=T('<div aria-label="copy" role="img"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" class="svelte-1v2qtoo"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></div>');const gt={hash:"svelte-1v2qtoo",code:`div.svelte-1v2qtoo {display:inline-block;}.copy-rect.svelte-1v2qtoo,
	.copy-path.svelte-1v2qtoo {transition:transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);}.copy-rect.animate.svelte-1v2qtoo {transform:translate(-3px, -3px);}.copy-path.animate.svelte-1v2qtoo {transform:translate(3px, 3px);}svg.svelte-1v2qtoo {overflow:visible;}`};function ft(t,e){K(t,gt);let r=s(e,"color",3,"currentColor"),v=s(e,"size",3,24),w=s(e,"strokeWidth",3,2),c=s(e,"isHovered",7,!1),u=s(e,"class",3,"");function y(){c(!0)}function m(){c(!1)}var l=wt(),o=k(l),d=k(o);let _;var C=M(d);let x;b(o),b(l),z((n,a)=>{N(l,1,R(u()),"svelte-1v2qtoo"),g(o,"width",v()),g(o,"height",v()),g(o,"stroke",r()),g(o,"stroke-width",w()),_=N(d,0,"copy-rect svelte-1v2qtoo",null,_,n),x=N(C,0,"copy-path svelte-1v2qtoo",null,x,a)},[()=>({animate:c()}),()=>({animate:c()})]),Z("mouseenter",l,y),Z("mouseleave",l,m),f(t,l)}var bt=T('<div aria-label="trash" role="img"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><g><path d="M3 6h18"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></g><path d="M19 8v12c0 1-1 2-2 2H7c-1 0-2-1-2-2V8"></path></svg></div>');const yt={hash:"svelte-1na9nhd",code:"div.svelte-1na9nhd {display:inline-block;}.is-animated.svelte-1na9nhd {transform:translateY(-1px);transition:transform 0.2s ease-in;}.animate-path.svelte-1na9nhd {transform:translateY(1px);transition:transform 0.2s ease-in;}.is-animated-line.svelte-1na9nhd {transition:all 0.2s ease-in;}.is-animated-path.svelte-1na9nhd {transition:all 0.2s ease-in;}"};function xt(t,e){K(t,yt);let r=s(e,"color",3,"currentColor"),v=s(e,"size",3,24),w=s(e,"strokeWidth",3,2),c=s(e,"isHovered",7,!1),u=s(e,"class",3,"");function y(){c(!0)}function m(){c(!1)}var l=bt(),o=k(l),d=k(o);let _;var C=M(d);let x;b(o),b(l),z((n,a)=>{N(l,1,R(u()),"svelte-1na9nhd"),g(o,"width",v()),g(o,"height",v()),g(o,"stroke",r()),g(o,"stroke-width",w()),_=N(d,0,"svelte-1na9nhd",null,_,n),x=N(C,0,"svelte-1na9nhd",null,x,a)},[()=>({"is-animated":c()}),()=>({"animate-path":c()})]),Z("mouseenter",l,y),Z("mouseleave",l,m),f(t,l)}const kt=t=>{mt(t,{size:20})},_t=t=>{vt(t,{size:20})},ee=t=>{xt(t,{size:20})},Ct=t=>{ft(t,{size:20})},zt={"move-array-item-up":kt,"move-array-item-down":_t,"remove-array-item":ee,"copy-array-item":Ct,"remove-object-property":ee},Lt=J(zt);function Jt(t,e){const r={flowbite:nt,lucide:Ee,moving:Lt,radix:De};de(t,{style:"width: 100%; display: flex; align-items: center; justify-content: center",get icons(){return r[e.pkg]}})}export{Jt as default};
