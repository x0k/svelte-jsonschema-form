import{e as te,i as ie}from"./each.fmg2rbnc.js";import{r as D,p as n,i as W,f as I,s as F}from"./definitions.QuHyn0Ht.js";import{p as O,f as T,c as f,a as j,h as g,g as q,u as A,w as E,s as M,r as w,t as z,e as H,n as ae,aQ as P,W as L,J as U,m as J,b as Q,aj as Z}from"./render.DeHagEKI.js";import{b as N,s as m,h as re,i as R,j as B,k as S}from"./file.BL1XEqjg.js";import{s as Y}from"./snippet.C6u1hRlR.js";import{I as G}from"./Icon.C5GnaFJk.js";import{t as se}from"./bundle-mjs.yHtcOSAs.js";import"./legacy.I47LKkzk.js";import"./multi-enum-include.Df7ZNjXz.js";import"./file-include.BBzPsHw6.js";import"./JSONArrow_svelte_svelte_type_style_lang.a1599035.l0sNRNKZ.js";import"./JSONNested_svelte_svelte_type_style_lang.fd22bc41.l0sNRNKZ.js";import"./PreviewList_svelte_svelte_type_style_lang.5dcdbcb5.l0sNRNKZ.js";import"./JSONValueNode_svelte_svelte_type_style_lang.a6137416.l0sNRNKZ.js";import"./ErrorStack_svelte_svelte_type_style_lang.ca573138.l0sNRNKZ.js";import"./JSONStringNode_svelte_svelte_type_style_lang.bacee525.l0sNRNKZ.js";import"./JSONFunctionNode_svelte_svelte_type_style_lang.c631ed6b.l0sNRNKZ.js";import"./RegExpNode_svelte_svelte_type_style_lang.43633d65.l0sNRNKZ.js";import"./Root_svelte_svelte_type_style_lang.001671e9.l0sNRNKZ.js";import"./form_svelte_svelte_type_style_lang.dc4a961f.l0sNRNKZ.js";import"./_commonjsHelpers.DaWZu8wl.js";var le=T('<button style="display: flex; gap: 0.5rem; align-items: center; height: 2rem"><!> </button>'),oe=T('<div><div style="display: flex; flex-direction: column; gap: 1rem"></div></div>');function ne(t,e){O(e,!0);const r=D(e,["$$slots","$$events","$$legacy","icons"]),v={path:[],required:!1,schema:{},uiSchema:{},title:"title"},b={"move-array-item-up":{},"move-array-item-down":{},"remove-array-item":{},"copy-array-item":{},"remove-object-property":{}};var c=oe();N(c,()=>({style:"height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center",...r}));var u=g(c);te(u,21,()=>Object.entries(b),ie,(y,x)=>{var s=A(()=>ae(q(x),2));let l=()=>q(s)[0],d=()=>q(s)[1];const k=A(l),C=A(()=>({config:v,translation:"",params:d()}));var _=le(),o=g(_);Y(o,()=>e.icons(q(k),q(C))??E,()=>q(C));var a=M(o);w(_),z(()=>H(a,` ${l()??""}`)),f(y,_)}),w(u),w(c),f(t,c),j()}var de=L("<title> </title>"),ce=L("<desc> </desc>"),ve=L('<svg><!><!><path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 2C7.77614 2 8 2.22386 8 2.5L8 11.2929L11.1464 8.14645C11.3417 7.95118 11.6583 7.95118 11.8536 8.14645C12.0488 8.34171 12.0488 8.65829 11.8536 8.85355L7.85355 12.8536C7.75979 12.9473 7.63261 13 7.5 13C7.36739 13 7.24021 12.9473 7.14645 12.8536L3.14645 8.85355C2.95118 8.65829 2.95118 8.34171 3.14645 8.14645C3.34171 7.95118 3.65829 7.95118 3.85355 8.14645L7 11.2929L7 2.5C7 2.22386 7.22386 2 7.5 2Z"></path></svg>');function he(t,e){O(e,!0);const r=P("iconCtx")??{};let v=n(e,"size",19,()=>r.size||"24"),b=n(e,"role",19,()=>r.role||"img"),c=n(e,"color",19,()=>r.color||"currentColor"),u=n(e,"ariaLabel",3,"arrow down"),y=D(e,["$$slots","$$events","$$legacy","size","role","color","title","desc","ariaLabel"]),x=`${e.title?.id||""} ${e.desc?.id||""}`;const s=A(()=>!!(e.title?.id||e.desc?.id));var l=ve();N(l,()=>({xmlns:"http://www.w3.org/2000/svg",...y,role:b(),width:v(),height:v(),fill:c(),"aria-label":u(),"aria-describedby":q(s)?x:void 0,viewBox:"0 0 15 15"}));var d=g(l);{var k=o=>{var a=de(),i=g(a,!0);w(a),z(()=>{m(a,"id",e.title.id),H(i,e.title.title)}),f(o,a)};W(d,o=>{e.title?.id&&e.title.title&&o(k)})}var C=M(d);{var _=o=>{var a=ce(),i=g(a,!0);w(a),z(()=>{m(a,"id",e.desc.id),H(i,e.desc.desc)}),f(o,a)};W(C,o=>{e.desc?.id&&e.desc.desc&&o(_)})}U(),w(l),f(t,l),j()}var ue=L("<title> </title>"),me=L("<desc> </desc>"),we=L('<svg><!><!><path fill-rule="evenodd" clip-rule="evenodd" d="M7.14645 2.14645C7.34171 1.95118 7.65829 1.95118 7.85355 2.14645L11.8536 6.14645C12.0488 6.34171 12.0488 6.65829 11.8536 6.85355C11.6583 7.04882 11.3417 7.04882 11.1464 6.85355L8 3.70711L8 12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5L7 3.70711L3.85355 6.85355C3.65829 7.04882 3.34171 7.04882 3.14645 6.85355C2.95118 6.65829 2.95118 6.34171 3.14645 6.14645L7.14645 2.14645Z"></path></svg>');function fe(t,e){O(e,!0);const r=P("iconCtx")??{};let v=n(e,"size",19,()=>r.size||"24"),b=n(e,"role",19,()=>r.role||"img"),c=n(e,"color",19,()=>r.color||"currentColor"),u=n(e,"ariaLabel",3,"arrow up"),y=D(e,["$$slots","$$events","$$legacy","size","role","color","title","desc","ariaLabel"]),x=`${e.title?.id||""} ${e.desc?.id||""}`;const s=A(()=>!!(e.title?.id||e.desc?.id));var l=we();N(l,()=>({xmlns:"http://www.w3.org/2000/svg",...y,role:b(),width:v(),height:v(),fill:c(),"aria-label":u(),"aria-describedby":q(s)?x:void 0,viewBox:"0 0 15 15"}));var d=g(l);{var k=o=>{var a=ue(),i=g(a,!0);w(a),z(()=>{m(a,"id",e.title.id),H(i,e.title.title)}),f(o,a)};W(d,o=>{e.title?.id&&e.title.title&&o(k)})}var C=M(d);{var _=o=>{var a=me(),i=g(a,!0);w(a),z(()=>{m(a,"id",e.desc.id),H(i,e.desc.desc)}),f(o,a)};W(C,o=>{e.desc?.id&&e.desc.desc&&o(_)})}U(),w(l),f(t,l),j()}var ge=L("<title> </title>"),be=L("<desc> </desc>"),ye=L('<svg><!><!><path fill-rule="evenodd" clip-rule="evenodd" d="M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006L2 2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00002H5.5C4.67158 4.00002 4 4.67159 4 5.50002V12.5C4 13.3284 4.67158 14 5.5 14H12.5C13.3284 14 14 13.3284 14 12.5V5.50002C14 4.67159 13.3284 4.00002 12.5 4.00002H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006H2.5C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50002C5 5.22388 5.22386 5.00002 5.5 5.00002H12.5C12.7761 5.00002 13 5.22388 13 5.50002V12.5C13 12.7762 12.7761 13 12.5 13H5.5C5.22386 13 5 12.7762 5 12.5V5.50002Z"></path></svg>');function xe(t,e){O(e,!0);const r=P("iconCtx")??{};let v=n(e,"size",19,()=>r.size||"24"),b=n(e,"role",19,()=>r.role||"img"),c=n(e,"color",19,()=>r.color||"currentColor"),u=n(e,"ariaLabel",3,"copy"),y=D(e,["$$slots","$$events","$$legacy","size","role","color","title","desc","ariaLabel"]),x=`${e.title?.id||""} ${e.desc?.id||""}`;const s=A(()=>!!(e.title?.id||e.desc?.id));var l=ye();N(l,()=>({xmlns:"http://www.w3.org/2000/svg",...y,role:b(),width:v(),height:v(),fill:c(),"aria-label":u(),"aria-describedby":q(s)?x:void 0,viewBox:"0 0 15 15"}));var d=g(l);{var k=o=>{var a=ge(),i=g(a,!0);w(a),z(()=>{m(a,"id",e.title.id),H(i,e.title.title)}),f(o,a)};W(d,o=>{e.title?.id&&e.title.title&&o(k)})}var C=M(d);{var _=o=>{var a=be(),i=g(a,!0);w(a),z(()=>{m(a,"id",e.desc.id),H(i,e.desc.desc)}),f(o,a)};W(C,o=>{e.desc?.id&&e.desc.desc&&o(_)})}U(),w(l),f(t,l),j()}var _e=L("<title> </title>"),ke=L("<desc> </desc>"),Ce=L('<svg><!><!><path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"></path></svg>');function ze(t,e){O(e,!0);const r=P("iconCtx")??{};let v=n(e,"size",19,()=>r.size||"24"),b=n(e,"role",19,()=>r.role||"img"),c=n(e,"color",19,()=>r.color||"currentColor"),u=n(e,"ariaLabel",3,"trash"),y=D(e,["$$slots","$$events","$$legacy","size","role","color","title","desc","ariaLabel"]),x=`${e.title?.id||""} ${e.desc?.id||""}`;const s=A(()=>!!(e.title?.id||e.desc?.id));var l=Ce();N(l,()=>({xmlns:"http://www.w3.org/2000/svg",...y,role:b(),width:v(),height:v(),fill:c(),"aria-label":u(),"aria-describedby":q(s)?x:void 0,viewBox:"0 0 15 15"}));var d=g(l);{var k=o=>{var a=_e(),i=g(a,!0);w(a),z(()=>{m(a,"id",e.title.id),H(i,e.title.title)}),f(o,a)};W(d,o=>{e.title?.id&&e.title.title&&o(k)})}var C=M(d);{var _=o=>{var a=ke(),i=g(a,!0);w(a),z(()=>{m(a,"id",e.desc.id),H(i,e.desc.desc)}),f(o,a)};W(C,o=>{e.desc?.id&&e.desc.desc&&o(_)})}U(),w(l),f(t,l),j()}const Le=t=>{fe(t,{size:"20"})},Me=t=>{he(t,{size:"20"})},X=t=>{ze(t,{size:"20"})},He=t=>{xe(t,{size:"20"})},We={"move-array-item-up":Le,"move-array-item-down":Me,"remove-array-item":X,"copy-array-item":He,"remove-object-property":X},Ve=I(We);function De(t,e){O(e,!0);/**
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
 */let r=D(e,["$$slots","$$events","$$legacy"]);const v=[["path",{d:"m5 12 7-7 7 7"}],["path",{d:"M12 19V5"}]];G(t,F({name:"arrow-up"},()=>r,{get iconNode(){return v},children:(b,c)=>{var u=J(),y=Q(u);Y(y,()=>e.children??E),f(b,u)},$$slots:{default:!0}})),j()}function Oe(t,e){O(e,!0);/**
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
 */let r=D(e,["$$slots","$$events","$$legacy"]);const v=[["path",{d:"M12 5v14"}],["path",{d:"m19 12-7 7-7-7"}]];G(t,F({name:"arrow-down"},()=>r,{get iconNode(){return v},children:(b,c)=>{var u=J(),y=Q(u);Y(y,()=>e.children??E),f(b,u)},$$slots:{default:!0}})),j()}function je(t,e){O(e,!0);/**
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
 */let r=D(e,["$$slots","$$events","$$legacy"]);const v=[["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"}],["path",{d:"M3 6h18"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}]];G(t,F({name:"trash"},()=>r,{get iconNode(){return v},children:(b,c)=>{var u=J(),y=Q(u);Y(y,()=>e.children??E),f(b,u)},$$slots:{default:!0}})),j()}function Be(t,e){O(e,!0);/**
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
 */let r=D(e,["$$slots","$$events","$$legacy"]);const v=[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"}]];G(t,F({name:"copy"},()=>r,{get iconNode(){return v},children:(b,c)=>{var u=J(),y=Q(u);Y(y,()=>e.children??E),f(b,u)},$$slots:{default:!0}})),j()}const qe=t=>{De(t,{size:20})},Ne=t=>{Oe(t,{size:20})},p=t=>{je(t,{size:20})},Pe=t=>{Be(t,{size:20})},Ae={"move-array-item-up":qe,"move-array-item-down":Ne,"remove-array-item":p,"copy-array-item":Pe,"remove-object-property":p},Ze=I(Ae);function K(...t){return se(re(t))}var Te=L("<title> </title>"),Ue=L("<desc> </desc>"),Ee=L('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 14-4-4m4 4 4-4"></path></svg>');function Ye(t,e){O(e,!0);const r=P("iconCtx")??{},v={xs:"w-3 h-3",sm:"w-4 h-4",md:"w-5 h-5",lg:"w-6 h-6",xl:"w-8 h-8"};let b=n(e,"size",19,()=>r.size||"md"),c=n(e,"color",19,()=>r.color||"currentColor"),u=n(e,"strokeWidth",19,()=>r.strokeWidth||2),y=D(e,["$$slots","$$events","$$legacy","size","color","title","strokeWidth","desc","class","ariaLabel"]),x=`${e.title?.id||""} ${e.desc?.id||""}`.trim();const s=!!(e.title?.id||e.desc?.id),l=!!e.ariaLabel||s;var d=Ee();N(d,i=>({xmlns:"http://www.w3.org/2000/svg",fill:"none",color:c(),...y,class:i,viewBox:"0 0 24 24","aria-label":e.ariaLabel,"aria-describedby":s?x:void 0,"aria-hidden":!l}),[()=>K("shrink-0",v[b()],e.class)]);var k=g(d);{var C=i=>{var h=Te(),V=g(h,!0);w(h),z(()=>{m(h,"id",e.title.id),H(V,e.title.title)}),f(i,h)};W(k,i=>{e.title?.id&&e.title.title&&i(C)})}var _=M(k);{var o=i=>{var h=Ue(),V=g(h,!0);w(h),z(()=>{m(h,"id",e.desc.id),H(V,e.desc.desc)}),f(i,h)};W(_,i=>{e.desc?.id&&e.desc.desc&&i(o)})}var a=M(_);w(d),z(()=>m(a,"stroke-width",u())),f(t,d),j()}var Ie=L("<title> </title>"),Fe=L("<desc> </desc>"),Je=L('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M12 6v13m0-13 4 4m-4-4-4 4"></path></svg>');function Qe(t,e){O(e,!0);const r=P("iconCtx")??{},v={xs:"w-3 h-3",sm:"w-4 h-4",md:"w-5 h-5",lg:"w-6 h-6",xl:"w-8 h-8"};let b=n(e,"size",19,()=>r.size||"md"),c=n(e,"color",19,()=>r.color||"currentColor"),u=n(e,"strokeWidth",19,()=>r.strokeWidth||2),y=D(e,["$$slots","$$events","$$legacy","size","color","title","strokeWidth","desc","class","ariaLabel"]),x=`${e.title?.id||""} ${e.desc?.id||""}`.trim();const s=!!(e.title?.id||e.desc?.id),l=!!e.ariaLabel||s;var d=Je();N(d,i=>({xmlns:"http://www.w3.org/2000/svg",fill:"none",color:c(),...y,class:i,viewBox:"0 0 24 24","aria-label":e.ariaLabel,"aria-describedby":s?x:void 0,"aria-hidden":!l}),[()=>K("shrink-0",v[b()],e.class)]);var k=g(d);{var C=i=>{var h=Ie(),V=g(h,!0);w(h),z(()=>{m(h,"id",e.title.id),H(V,e.title.title)}),f(i,h)};W(k,i=>{e.title?.id&&e.title.title&&i(C)})}var _=M(k);{var o=i=>{var h=Fe(),V=g(h,!0);w(h),z(()=>{m(h,"id",e.desc.id),H(V,e.desc.desc)}),f(i,h)};W(_,i=>{e.desc?.id&&e.desc.desc&&i(o)})}var a=M(_);w(d),z(()=>m(a,"stroke-width",u())),f(t,d),j()}var Re=L("<title> </title>"),Se=L("<desc> </desc>"),Ge=L('<svg><!><!><path stroke="currentColor" stroke-linejoin="round" d="M9 8v3a1 1 0 0 1-1 1H5m11 4h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v1m4 3v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7.13a1 1 0 0 1 .24-.65L7.7 8.35A1 1 0 0 1 8.46 8H13a1 1 0 0 1 1 1Z"></path></svg>');function Ke(t,e){O(e,!0);const r=P("iconCtx")??{},v={xs:"w-3 h-3",sm:"w-4 h-4",md:"w-5 h-5",lg:"w-6 h-6",xl:"w-8 h-8"};let b=n(e,"size",19,()=>r.size||"md"),c=n(e,"color",19,()=>r.color||"currentColor"),u=n(e,"strokeWidth",19,()=>r.strokeWidth||2),y=D(e,["$$slots","$$events","$$legacy","size","color","title","strokeWidth","desc","class","ariaLabel"]),x=`${e.title?.id||""} ${e.desc?.id||""}`.trim();const s=!!(e.title?.id||e.desc?.id),l=!!e.ariaLabel||s;var d=Ge();N(d,i=>({xmlns:"http://www.w3.org/2000/svg",fill:"none",color:c(),...y,class:i,viewBox:"0 0 24 24","aria-label":e.ariaLabel,"aria-describedby":s?x:void 0,"aria-hidden":!l}),[()=>K("shrink-0",v[b()],e.class)]);var k=g(d);{var C=i=>{var h=Re(),V=g(h,!0);w(h),z(()=>{m(h,"id",e.title.id),H(V,e.title.title)}),f(i,h)};W(k,i=>{e.title?.id&&e.title.title&&i(C)})}var _=M(k);{var o=i=>{var h=Se(),V=g(h,!0);w(h),z(()=>{m(h,"id",e.desc.id),H(V,e.desc.desc)}),f(i,h)};W(_,i=>{e.desc?.id&&e.desc.desc&&i(o)})}var a=M(_);w(d),z(()=>m(a,"stroke-width",u())),f(t,d),j()}var Xe=L("<title> </title>"),pe=L("<desc> </desc>"),$e=L('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"></path></svg>');function et(t,e){O(e,!0);const r=P("iconCtx")??{},v={xs:"w-3 h-3",sm:"w-4 h-4",md:"w-5 h-5",lg:"w-6 h-6",xl:"w-8 h-8"};let b=n(e,"size",19,()=>r.size||"md"),c=n(e,"color",19,()=>r.color||"currentColor"),u=n(e,"strokeWidth",19,()=>r.strokeWidth||2),y=D(e,["$$slots","$$events","$$legacy","size","color","title","strokeWidth","desc","class","ariaLabel"]),x=`${e.title?.id||""} ${e.desc?.id||""}`.trim();const s=!!(e.title?.id||e.desc?.id),l=!!e.ariaLabel||s;var d=$e();N(d,i=>({xmlns:"http://www.w3.org/2000/svg",fill:"none",color:c(),...y,class:i,viewBox:"0 0 24 24","aria-label":e.ariaLabel,"aria-describedby":s?x:void 0,"aria-hidden":!l}),[()=>K("shrink-0",v[b()],e.class)]);var k=g(d);{var C=i=>{var h=Xe(),V=g(h,!0);w(h),z(()=>{m(h,"id",e.title.id),H(V,e.title.title)}),f(i,h)};W(k,i=>{e.title?.id&&e.title.title&&i(C)})}var _=M(k);{var o=i=>{var h=pe(),V=g(h,!0);w(h),z(()=>{m(h,"id",e.desc.id),H(V,e.desc.desc)}),f(i,h)};W(_,i=>{e.desc?.id&&e.desc.desc&&i(o)})}var a=M(_);w(d),z(()=>m(a,"stroke-width",u())),f(t,d),j()}const tt=t=>{Qe(t,{})},it=t=>{Ye(t,{})},$=t=>{et(t,{})},at=t=>{Ke(t,{})},rt={"move-array-item-up":tt,"move-array-item-down":it,"remove-array-item":$,"copy-array-item":at,"remove-object-property":$},st=I(rt);var lt=T('<div aria-label="arrow-down" role="img"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7 7 7-7"></path><path d="M12 14v5"></path><path d="M12 5v9" class="svelte-1rktpzn"></path></svg></div>');const ot={hash:"svelte-1rktpzn",code:"div.svelte-1rktpzn {display:inline-block;}path.svelte-1rktpzn {transition:all 0.2s ease-out;}.head.svelte-1rktpzn {transform:translateY(-3px);}"};function nt(t,e){R(t,ot);let r=n(e,"color",3,"currentColor"),v=n(e,"size",3,24),b=n(e,"strokeWidth",3,2),c=n(e,"isHovered",7,!1),u=n(e,"class",3,"");function y(){c(!0),setTimeout(()=>{c(!1)},200)}var x=lt(),s=g(x),l=g(s);let d;var k=M(l);let C;U(),w(s),w(x),z((_,o)=>{B(x,1,S(u()),"svelte-1rktpzn"),m(s,"width",v()),m(s,"height",v()),m(s,"stroke",r()),m(s,"stroke-width",b()),d=B(l,0,"svelte-1rktpzn",null,d,_),C=B(k,0,"svelte-1rktpzn",null,C,o)},[()=>({head:c()}),()=>({head:c()})]),Z("mouseenter",x,y),f(t,x)}var dt=T('<div aria-label="arrow-up" role="img"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"></path><path d="M12 10V5"></path><path d="M12 19V10" class="svelte-1oh036w"></path></svg></div>');const ct={hash:"svelte-1oh036w",code:"div.svelte-1oh036w {display:inline-block;}path.svelte-1oh036w {transition:all 0.2s ease-out;}.head.svelte-1oh036w {transform:translateY(3px);}"};function vt(t,e){R(t,ct);let r=n(e,"color",3,"currentColor"),v=n(e,"size",3,24),b=n(e,"strokeWidth",3,2),c=n(e,"isHovered",7,!1),u=n(e,"class",3,"");function y(){c(!0),setTimeout(()=>{c(!1)},200)}var x=dt(),s=g(x),l=g(s);let d;var k=M(l);let C;U(),w(s),w(x),z((_,o)=>{B(x,1,S(u()),"svelte-1oh036w"),m(s,"width",v()),m(s,"height",v()),m(s,"stroke",r()),m(s,"stroke-width",b()),d=B(l,0,"svelte-1oh036w",null,d,_),C=B(k,0,"svelte-1oh036w",null,C,o)},[()=>({head:c()}),()=>({head:c()})]),Z("mouseenter",x,y),f(t,x)}var ht=T('<div aria-label="copy" role="img"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" class="svelte-1v2qtoo"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></div>');const ut={hash:"svelte-1v2qtoo",code:`div.svelte-1v2qtoo {display:inline-block;}.copy-rect.svelte-1v2qtoo,
	.copy-path.svelte-1v2qtoo {transition:transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);}.copy-rect.animate.svelte-1v2qtoo {transform:translate(-3px, -3px);}.copy-path.animate.svelte-1v2qtoo {transform:translate(3px, 3px);}svg.svelte-1v2qtoo {overflow:visible;}`};function mt(t,e){R(t,ut);let r=n(e,"color",3,"currentColor"),v=n(e,"size",3,24),b=n(e,"strokeWidth",3,2),c=n(e,"isHovered",7,!1),u=n(e,"class",3,"");function y(){c(!0)}function x(){c(!1)}var s=ht(),l=g(s),d=g(l);let k;var C=M(d);let _;w(l),w(s),z((o,a)=>{B(s,1,S(u()),"svelte-1v2qtoo"),m(l,"width",v()),m(l,"height",v()),m(l,"stroke",r()),m(l,"stroke-width",b()),k=B(d,0,"copy-rect svelte-1v2qtoo",null,k,o),_=B(C,0,"copy-path svelte-1v2qtoo",null,_,a)},[()=>({animate:c()}),()=>({animate:c()})]),Z("mouseenter",s,y),Z("mouseleave",s,x),f(t,s)}var wt=T('<div aria-label="trash" role="img"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><g><path d="M3 6h18"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></g><path d="M19 8v12c0 1-1 2-2 2H7c-1 0-2-1-2-2V8"></path></svg></div>');const ft={hash:"svelte-1na9nhd",code:"div.svelte-1na9nhd {display:inline-block;}.is-animated.svelte-1na9nhd {transform:translateY(-1px);transition:transform 0.2s ease-in;}.animate-path.svelte-1na9nhd {transform:translateY(1px);transition:transform 0.2s ease-in;}.is-animated-line.svelte-1na9nhd {transition:all 0.2s ease-in;}.is-animated-path.svelte-1na9nhd {transition:all 0.2s ease-in;}"};function gt(t,e){R(t,ft);let r=n(e,"color",3,"currentColor"),v=n(e,"size",3,24),b=n(e,"strokeWidth",3,2),c=n(e,"isHovered",7,!1),u=n(e,"class",3,"");function y(){c(!0)}function x(){c(!1)}var s=wt(),l=g(s),d=g(l);let k;var C=M(d);let _;w(l),w(s),z((o,a)=>{B(s,1,S(u()),"svelte-1na9nhd"),m(l,"width",v()),m(l,"height",v()),m(l,"stroke",r()),m(l,"stroke-width",b()),k=B(d,0,"svelte-1na9nhd",null,k,o),_=B(C,0,"svelte-1na9nhd",null,_,a)},[()=>({"is-animated":c()}),()=>({"animate-path":c()})]),Z("mouseenter",s,y),Z("mouseleave",s,x),f(t,s)}const bt=t=>{vt(t,{size:20})},yt=t=>{nt(t,{size:20})},ee=t=>{gt(t,{size:20})},xt=t=>{mt(t,{size:20})},_t={"move-array-item-up":bt,"move-array-item-down":yt,"remove-array-item":ee,"copy-array-item":xt,"remove-object-property":ee},kt=I(_t);function Ft(t,e){const r={flowbite:st,lucide:Ze,moving:kt,radix:Ve};ne(t,{style:"width: 100%; display: flex; align-items: center; justify-content: center",get icons(){return r[e.pkg]}})}export{Ft as default};
