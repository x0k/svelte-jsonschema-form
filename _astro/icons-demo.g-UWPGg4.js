import{e as Ie,i as Xe}from"./each.DGpQ3d0C.js";import{s as Le,r as I,p as f,j,f as je,n as He,o as T,b9 as Pe,y as K,ba as Oe,a4 as We}from"./definitions.CBHryth7.js";import{p as N,m as D,e as M,n as te,b as l,a as q,a$ as ie,al as W,s as H,c as C,g as d,u as z,ab as fe,r as k,t as P,h as A,f as Z,aF as ue,o as Se}from"./render.DQZAjqjS.js";import{b as ee,s as b,h as Re,j as S,i as we}from"./file.Bfa0F195.js";import{s as X}from"./snippet.CYYQo0fI.js";import{I as ze}from"./Icon.D9T2fXVo.js";import{X as Ge}from"./x.BZ8pa52o.js";import{t as Je}from"./bundle-mjs.0JNfDbnS.js";import{a as _e}from"./css.CoWHI4TK.js";import"./legacy.CGIcIbjh.js";import"./assert.iZNwS5kp.js";import"./schemas.C6KpZrmX.js";import"./file-include.DnR_sBCo.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./svelte-element.BI-8nUDY.js";function Ke(t,e){N(e,!0);/**
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
 */let r=I(e,["$$slots","$$events","$$legacy"]);const s=[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"}]];ze(t,Le({name:"copy"},()=>r,{get iconNode(){return s},children:(g,h)=>{var w=D(),_=M(w);X(_,()=>e.children??te),l(g,w)},$$slots:{default:!0}})),q()}var Qe=W("<title> </title>"),pe=W("<desc> </desc>"),$e=W('<svg><!><!><path d="M7.50021 2C7.77635 2 8.00021 2.22386 8.00021 2.5V11.293L11.1467 8.14648C11.342 7.95122 11.6585 7.95122 11.8537 8.14648C12.049 8.34175 12.049 8.65825 11.8537 8.85352L7.85372 12.8535C7.75995 12.9473 7.63282 13 7.50021 13C7.3676 13 7.24046 12.9473 7.14669 12.8535L3.14669 8.85352L3.08224 8.77539C2.95407 8.58131 2.97583 8.31735 3.14669 8.14648C3.31756 7.97562 3.58152 7.95387 3.7756 8.08203L3.85372 8.14648L7.00021 11.293V2.5C7.00021 2.22386 7.22407 2 7.50021 2Z"></path></svg>');function et(t,e){N(e,!0);const r=ie("iconCtx")??{};let s=f(e,"size",19,()=>r.size||"24"),g=f(e,"role",19,()=>r.role||"img"),h=f(e,"color",19,()=>r.color||"currentColor"),w=f(e,"focusable",3,"false"),_=I(e,["$$slots","$$events","$$legacy","size","role","color","title","desc","focusable","ariaLabel"]),m=z(()=>`${e.title?.id||""} ${e.desc?.id||""}`.trim());const a=z(()=>!!(e.title?.id||e.desc?.id));var n=$e();ee(n,()=>({xmlns:"http://www.w3.org/2000/svg",..._,role:g(),width:s(),height:s(),fill:h(),focusable:w(),"aria-label":e.title?.id?void 0:e.ariaLabel,"aria-labelledby":e.title?.id||void 0,"aria-describedby":d(a)?d(m):void 0,viewBox:"0 0 15 15"}));var v=C(n);{var x=c=>{var o=Qe(),i=C(o,!0);k(o),P(()=>{b(o,"id",e.title.id),A(i,e.title.title)}),l(c,o)};j(v,c=>{e.title?.id&&e.title.title&&c(x)})}var L=H(v);{var y=c=>{var o=pe(),i=C(o,!0);k(o),P(()=>{b(o,"id",e.desc.id),A(i,e.desc.desc)}),l(c,o)};j(L,c=>{e.desc?.id&&e.desc.desc&&c(y)})}fe(),k(n),l(t,n),q()}var tt=W("<title> </title>"),it=W("<desc> </desc>"),rt=W('<svg><!><!><path d="M7.22457 2.08224C7.41865 1.95407 7.68261 1.97583 7.85348 2.14669L11.8535 6.14669L11.9179 6.22482C12.0461 6.4189 12.0243 6.68286 11.8535 6.85372C11.6826 7.02459 11.4187 7.04634 11.2246 6.91818L11.1464 6.85372L7.99996 3.70724V12.5002C7.99996 12.7763 7.7761 13.0002 7.49996 13.0002C7.22382 13.0002 6.99996 12.7763 6.99996 12.5002V3.70724L3.85348 6.85372C3.65822 7.04899 3.34171 7.04899 3.14645 6.85372C2.95118 6.65846 2.95118 6.34195 3.14645 6.14669L7.14645 2.14669L7.22457 2.08224Z"></path></svg>');function at(t,e){N(e,!0);const r=ie("iconCtx")??{};let s=f(e,"size",19,()=>r.size||"24"),g=f(e,"role",19,()=>r.role||"img"),h=f(e,"color",19,()=>r.color||"currentColor"),w=f(e,"focusable",3,"false"),_=I(e,["$$slots","$$events","$$legacy","size","role","color","title","desc","focusable","ariaLabel"]),m=z(()=>`${e.title?.id||""} ${e.desc?.id||""}`.trim());const a=z(()=>!!(e.title?.id||e.desc?.id));var n=rt();ee(n,()=>({xmlns:"http://www.w3.org/2000/svg",..._,role:g(),width:s(),height:s(),fill:h(),focusable:w(),"aria-label":e.title?.id?void 0:e.ariaLabel,"aria-labelledby":e.title?.id||void 0,"aria-describedby":d(a)?d(m):void 0,viewBox:"0 0 15 15"}));var v=C(n);{var x=c=>{var o=tt(),i=C(o,!0);k(o),P(()=>{b(o,"id",e.title.id),A(i,e.title.title)}),l(c,o)};j(v,c=>{e.title?.id&&e.title.title&&c(x)})}var L=H(v);{var y=c=>{var o=it(),i=C(o,!0);k(o),P(()=>{b(o,"id",e.desc.id),A(i,e.desc.desc)}),l(c,o)};j(L,c=>{e.desc?.id&&e.desc.desc&&c(y)})}fe(),k(n),l(t,n),q()}var nt=W("<title> </title>"),lt=W("<desc> </desc>"),ot=W('<svg><!><!><path d="M10 4.00003V2.50003C10 2.22389 9.77614 2.00003 9.5 2.00003H2.5C2.22386 2.00003 2 2.22389 2 2.50003V9.50003C2 9.77617 2.22386 10 2.5 10H4V5.50003C4 4.6716 4.67157 4.00003 5.5 4.00003H10ZM5.5 5.00003C5.22386 5.00003 5 5.22389 5 5.50003V12.5C5.00002 12.7762 5.22387 13 5.5 13H12.5C12.7761 13 13 12.7762 13 12.5V5.50003C13 5.22389 12.7761 5.00003 12.5 5.00003H5.5ZM12.5 4.00003C13.3284 4.00003 14 4.6716 14 5.50003V12.5C14 13.3284 13.3284 14 12.5 14H5.5C4.67159 14 4.00002 13.3284 4 12.5V11H2.5C1.67157 11 1 10.3285 1 9.50003V2.50003C1 1.6716 1.67157 1.00003 2.5 1.00003H9.5C10.3284 1.00003 11 1.6716 11 2.50003V4.00003H12.5Z"></path></svg>');function st(t,e){N(e,!0);const r=ie("iconCtx")??{};let s=f(e,"size",19,()=>r.size||"24"),g=f(e,"role",19,()=>r.role||"img"),h=f(e,"color",19,()=>r.color||"currentColor"),w=f(e,"focusable",3,"false"),_=I(e,["$$slots","$$events","$$legacy","size","role","color","title","desc","focusable","ariaLabel"]),m=z(()=>`${e.title?.id||""} ${e.desc?.id||""}`.trim());const a=z(()=>!!(e.title?.id||e.desc?.id));var n=ot();ee(n,()=>({xmlns:"http://www.w3.org/2000/svg",..._,role:g(),width:s(),height:s(),fill:h(),focusable:w(),"aria-label":e.title?.id?void 0:e.ariaLabel,"aria-labelledby":e.title?.id||void 0,"aria-describedby":d(a)?d(m):void 0,viewBox:"0 0 15 15"}));var v=C(n);{var x=c=>{var o=nt(),i=C(o,!0);k(o),P(()=>{b(o,"id",e.title.id),A(i,e.title.title)}),l(c,o)};j(v,c=>{e.title?.id&&e.title.title&&c(x)})}var L=H(v);{var y=c=>{var o=lt(),i=C(o,!0);k(o),P(()=>{b(o,"id",e.desc.id),A(i,e.desc.desc)}),l(c,o)};j(L,c=>{e.desc?.id&&e.desc.desc&&c(y)})}fe(),k(n),l(t,n),q()}var dt=W("<title> </title>"),ct=W("<desc> </desc>"),vt=W('<svg><!><!><path d="M12.2248 2.08224C12.4189 1.95407 12.6829 1.97583 12.8537 2.14669C13.0246 2.31756 13.0463 2.58152 12.9182 2.7756L12.8537 2.85372L8.20724 7.50021L12.8537 12.1467L12.9182 12.2248C13.0463 12.4189 13.0246 12.6829 12.8537 12.8537C12.6829 13.0246 12.4189 13.0463 12.2248 12.9182L12.1467 12.8537L7.50021 8.20724L2.85372 12.8537C2.65846 13.049 2.34195 13.049 2.14669 12.8537C1.95143 12.6585 1.95143 12.342 2.14669 12.1467L6.79318 7.50021L2.14669 2.85372L2.08224 2.7756C1.95407 2.58152 1.97583 2.31756 2.14669 2.14669C2.31756 1.97583 2.58152 1.95407 2.7756 2.08224L2.85372 2.14669L7.50021 6.79318L12.1467 2.14669L12.2248 2.08224Z"></path></svg>');function ut(t,e){N(e,!0);const r=ie("iconCtx")??{};let s=f(e,"size",19,()=>r.size||"24"),g=f(e,"role",19,()=>r.role||"img"),h=f(e,"color",19,()=>r.color||"currentColor"),w=f(e,"focusable",3,"false"),_=I(e,["$$slots","$$events","$$legacy","size","role","color","title","desc","focusable","ariaLabel"]),m=z(()=>`${e.title?.id||""} ${e.desc?.id||""}`.trim());const a=z(()=>!!(e.title?.id||e.desc?.id));var n=vt();ee(n,()=>({xmlns:"http://www.w3.org/2000/svg",..._,role:g(),width:s(),height:s(),fill:h(),focusable:w(),"aria-label":e.title?.id?void 0:e.ariaLabel,"aria-labelledby":e.title?.id||void 0,"aria-describedby":d(a)?d(m):void 0,viewBox:"0 0 15 15"}));var v=C(n);{var x=c=>{var o=dt(),i=C(o,!0);k(o),P(()=>{b(o,"id",e.title.id),A(i,e.title.title)}),l(c,o)};j(v,c=>{e.title?.id&&e.title.title&&c(x)})}var L=H(v);{var y=c=>{var o=ct(),i=C(o,!0);k(o),P(()=>{b(o,"id",e.desc.id),A(i,e.desc.desc)}),l(c,o)};j(L,c=>{e.desc?.id&&e.desc.desc&&c(y)})}fe(),k(n),l(t,n),q()}var ft=W("<title> </title>"),ht=W("<desc> </desc>"),gt=W('<svg><!><!><path d="M11.2246 1.08204C11.4187 0.953875 11.6826 0.975633 11.8535 1.14649L13.8535 3.14649L13.9179 3.22462C14.0461 3.41869 14.0244 3.68266 13.8535 3.85352L6.42186 11.2852C6.35442 11.3526 6.27771 11.4105 6.19432 11.4561L6.10838 11.4971L2.69725 12.96C2.50933 13.0405 2.29103 12.9981 2.14647 12.8535C2.0019 12.709 1.95949 12.4907 2.04002 12.3027L3.50291 8.89161L3.54393 8.80567C3.58951 8.72228 3.6474 8.64556 3.71483 8.57813L11.1465 1.14649L11.2246 1.08204ZM4.42186 9.28516L3.78025 10.7803L4.21775 11.2178L5.71483 10.5781L12.7929 3.50001L11.5 2.20704L4.42186 9.28516Z"></path></svg>');function mt(t,e){N(e,!0);const r=ie("iconCtx")??{};let s=f(e,"size",19,()=>r.size||"24"),g=f(e,"role",19,()=>r.role||"img"),h=f(e,"color",19,()=>r.color||"currentColor"),w=f(e,"focusable",3,"false"),_=I(e,["$$slots","$$events","$$legacy","size","role","color","title","desc","focusable","ariaLabel"]),m=z(()=>`${e.title?.id||""} ${e.desc?.id||""}`.trim());const a=z(()=>!!(e.title?.id||e.desc?.id));var n=gt();ee(n,()=>({xmlns:"http://www.w3.org/2000/svg",..._,role:g(),width:s(),height:s(),fill:h(),focusable:w(),"aria-label":e.title?.id?void 0:e.ariaLabel,"aria-labelledby":e.title?.id||void 0,"aria-describedby":d(a)?d(m):void 0,viewBox:"0 0 15 15"}));var v=C(n);{var x=c=>{var o=ft(),i=C(o,!0);k(o),P(()=>{b(o,"id",e.title.id),A(i,e.title.title)}),l(c,o)};j(v,c=>{e.title?.id&&e.title.title&&c(x)})}var L=H(v);{var y=c=>{var o=ht(),i=C(o,!0);k(o),P(()=>{b(o,"id",e.desc.id),A(i,e.desc.desc)}),l(c,o)};j(L,c=>{e.desc?.id&&e.desc.desc&&c(y)})}fe(),k(n),l(t,n),q()}var wt=W("<title> </title>"),_t=W("<desc> </desc>"),bt=W('<svg><!><!><path d="M11.5 3C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12L10.9951 12.1025C10.9472 12.573 10.573 12.9472 10.1025 12.9951L10 13H5L4.89746 12.9951C4.42703 12.9472 4.05278 12.573 4.00488 12.1025L4 12V4H3.5C3.22386 4 3 3.77614 3 3.5C3 3.22386 3.22386 3 3.5 3H11.5ZM5 12H10V4H5V12ZM9.5 1C9.77614 1 10 1.22386 10 1.5C10 1.77614 9.77614 2 9.5 2H5.5C5.22386 2 5 1.77614 5 1.5C5 1.22386 5.22386 1 5.5 1H9.5Z"></path></svg>');function yt(t,e){N(e,!0);const r=ie("iconCtx")??{};let s=f(e,"size",19,()=>r.size||"24"),g=f(e,"role",19,()=>r.role||"img"),h=f(e,"color",19,()=>r.color||"currentColor"),w=f(e,"focusable",3,"false"),_=I(e,["$$slots","$$events","$$legacy","size","role","color","title","desc","focusable","ariaLabel"]),m=z(()=>`${e.title?.id||""} ${e.desc?.id||""}`.trim());const a=z(()=>!!(e.title?.id||e.desc?.id));var n=bt();ee(n,()=>({xmlns:"http://www.w3.org/2000/svg",..._,role:g(),width:s(),height:s(),fill:h(),focusable:w(),"aria-label":e.title?.id?void 0:e.ariaLabel,"aria-labelledby":e.title?.id||void 0,"aria-describedby":d(a)?d(m):void 0,viewBox:"0 0 15 15"}));var v=C(n);{var x=c=>{var o=wt(),i=C(o,!0);k(o),P(()=>{b(o,"id",e.title.id),A(i,e.title.title)}),l(c,o)};j(v,c=>{e.title?.id&&e.title.title&&c(x)})}var L=H(v);{var y=c=>{var o=_t(),i=C(o,!0);k(o),P(()=>{b(o,"id",e.desc.id),A(i,e.desc.desc)}),l(c,o)};j(L,c=>{e.desc?.id&&e.desc.desc&&c(y)})}fe(),k(n),l(t,n),q()}const xt=t=>{at(t,{size:"20"})},kt=t=>{et(t,{size:"20"})},Ne=t=>{yt(t,{size:"20"})},Ct=t=>{st(t,{size:"20"})},Lt={"move-array-item-up":xt,"move-array-item-down":kt,"remove-array-item":Ne,"copy-array-item":Ct,"remove-object-property":Ne},De=Lt,zt=je(De),Mt=t=>{ut(t,{size:20})};De.clear=Mt;const jt=t=>{mt(t,{size:"20"})};De.edit=jt;function Ht(t,e){N(e,!0);/**
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
 */let r=I(e,["$$slots","$$events","$$legacy"]);const s=[["path",{d:"m5 12 7-7 7 7"}],["path",{d:"M12 19V5"}]];ze(t,Le({name:"arrow-up"},()=>r,{get iconNode(){return s},children:(g,h)=>{var w=D(),_=M(w);X(_,()=>e.children??te),l(g,w)},$$slots:{default:!0}})),q()}function Pt(t,e){N(e,!0);/**
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
 */let r=I(e,["$$slots","$$events","$$legacy"]);const s=[["path",{d:"M12 5v14"}],["path",{d:"m19 12-7 7-7-7"}]];ze(t,Le({name:"arrow-down"},()=>r,{get iconNode(){return s},children:(g,h)=>{var w=D(),_=M(w);X(_,()=>e.children??te),l(g,w)},$$slots:{default:!0}})),q()}function Wt(t,e){N(e,!0);/**
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
 */let r=I(e,["$$slots","$$events","$$legacy"]);const s=[["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"}],["path",{d:"M3 6h18"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}]];ze(t,Le({name:"trash"},()=>r,{get iconNode(){return s},children:(g,h)=>{var w=D(),_=M(w);X(_,()=>e.children??te),l(g,w)},$$slots:{default:!0}})),q()}const Ot=t=>{Ht(t,{size:20})},Dt=t=>{Pt(t,{size:20})},qe=t=>{Wt(t,{size:20})},Vt=t=>{Ke(t,{size:20})},Bt={"move-array-item-up":Ot,"move-array-item-down":Dt,"remove-array-item":qe,"copy-array-item":Vt,"remove-object-property":qe},Ve=Bt,Tt=je(Ve),At=t=>{Ge(t,{size:20})};Ve.clear=At;function Nt(t,e){N(e,!0);/**
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
 */let r=I(e,["$$slots","$$events","$$legacy"]);const s=[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"}],["path",{d:"m15 5 4 4"}]];ze(t,Le({name:"pencil"},()=>r,{get iconNode(){return s},children:(g,h)=>{var w=D(),_=M(w);X(_,()=>e.children??te),l(g,w)},$$slots:{default:!0}})),q()}const qt=t=>{Nt(t,{size:20})};Ve.edit=qt;function be(...t){return Je(Re(t))}var Zt=W("<title> </title>"),Et=W("<desc> </desc>"),Ut=W('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 14-4-4m4 4 4-4"></path></svg>');function Ft(t,e){N(e,!0);const r=ie("iconCtx")??{},s={xs:"w-3 h-3",sm:"w-4 h-4",md:"w-5 h-5",lg:"w-6 h-6",xl:"w-8 h-8"};let g=f(e,"size",19,()=>r.size||"md"),h=f(e,"color",19,()=>r.color||"currentColor"),w=f(e,"strokeWidth",19,()=>r.strokeWidth||2),_=I(e,["$$slots","$$events","$$legacy","size","color","title","strokeWidth","desc","class","ariaLabel"]),m=`${e.title?.id||""} ${e.desc?.id||""}`.trim();const a=!!(e.title?.id||e.desc?.id),n=!!e.ariaLabel||a;var v=Ut();ee(v,i=>({xmlns:"http://www.w3.org/2000/svg",fill:"none",color:h(),..._,class:i,viewBox:"0 0 24 24","aria-label":e.ariaLabel,"aria-describedby":a?m:void 0,"aria-hidden":!n}),[()=>be("shrink-0",s[g()],e.class)]);var x=C(v);{var L=i=>{var u=Zt(),O=C(u,!0);k(u),P(()=>{b(u,"id",e.title.id),A(O,e.title.title)}),l(i,u)};j(x,i=>{e.title?.id&&e.title.title&&i(L)})}var y=H(x);{var c=i=>{var u=Et(),O=C(u,!0);k(u),P(()=>{b(u,"id",e.desc.id),A(O,e.desc.desc)}),l(i,u)};j(y,i=>{e.desc?.id&&e.desc.desc&&i(c)})}var o=H(y);k(v),P(()=>b(o,"stroke-width",w())),l(t,v),q()}var Yt=W("<title> </title>"),It=W("<desc> </desc>"),Xt=W('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M12 6v13m0-13 4 4m-4-4-4 4"></path></svg>');function St(t,e){N(e,!0);const r=ie("iconCtx")??{},s={xs:"w-3 h-3",sm:"w-4 h-4",md:"w-5 h-5",lg:"w-6 h-6",xl:"w-8 h-8"};let g=f(e,"size",19,()=>r.size||"md"),h=f(e,"color",19,()=>r.color||"currentColor"),w=f(e,"strokeWidth",19,()=>r.strokeWidth||2),_=I(e,["$$slots","$$events","$$legacy","size","color","title","strokeWidth","desc","class","ariaLabel"]),m=`${e.title?.id||""} ${e.desc?.id||""}`.trim();const a=!!(e.title?.id||e.desc?.id),n=!!e.ariaLabel||a;var v=Xt();ee(v,i=>({xmlns:"http://www.w3.org/2000/svg",fill:"none",color:h(),..._,class:i,viewBox:"0 0 24 24","aria-label":e.ariaLabel,"aria-describedby":a?m:void 0,"aria-hidden":!n}),[()=>be("shrink-0",s[g()],e.class)]);var x=C(v);{var L=i=>{var u=Yt(),O=C(u,!0);k(u),P(()=>{b(u,"id",e.title.id),A(O,e.title.title)}),l(i,u)};j(x,i=>{e.title?.id&&e.title.title&&i(L)})}var y=H(x);{var c=i=>{var u=It(),O=C(u,!0);k(u),P(()=>{b(u,"id",e.desc.id),A(O,e.desc.desc)}),l(i,u)};j(y,i=>{e.desc?.id&&e.desc.desc&&i(c)})}var o=H(y);k(v),P(()=>b(o,"stroke-width",w())),l(t,v),q()}var Rt=W("<title> </title>"),Gt=W("<desc> </desc>"),Jt=W('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M6 18 17.94 6M18 18 6.06 6"></path></svg>');function Kt(t,e){N(e,!0);const r=ie("iconCtx")??{},s={xs:"w-3 h-3",sm:"w-4 h-4",md:"w-5 h-5",lg:"w-6 h-6",xl:"w-8 h-8"};let g=f(e,"size",19,()=>r.size||"md"),h=f(e,"color",19,()=>r.color||"currentColor"),w=f(e,"strokeWidth",19,()=>r.strokeWidth||2),_=I(e,["$$slots","$$events","$$legacy","size","color","title","strokeWidth","desc","class","ariaLabel"]),m=`${e.title?.id||""} ${e.desc?.id||""}`.trim();const a=!!(e.title?.id||e.desc?.id),n=!!e.ariaLabel||a;var v=Jt();ee(v,i=>({xmlns:"http://www.w3.org/2000/svg",fill:"none",color:h(),..._,class:i,viewBox:"0 0 24 24","aria-label":e.ariaLabel,"aria-describedby":a?m:void 0,"aria-hidden":!n}),[()=>be("shrink-0",s[g()],e.class)]);var x=C(v);{var L=i=>{var u=Rt(),O=C(u,!0);k(u),P(()=>{b(u,"id",e.title.id),A(O,e.title.title)}),l(i,u)};j(x,i=>{e.title?.id&&e.title.title&&i(L)})}var y=H(x);{var c=i=>{var u=Gt(),O=C(u,!0);k(u),P(()=>{b(u,"id",e.desc.id),A(O,e.desc.desc)}),l(i,u)};j(y,i=>{e.desc?.id&&e.desc.desc&&i(c)})}var o=H(y);k(v),P(()=>b(o,"stroke-width",w())),l(t,v),q()}var Qt=W("<title> </title>"),pt=W("<desc> </desc>"),$t=W('<svg><!><!><path stroke="currentColor" stroke-linejoin="round" d="M9 8v3a1 1 0 0 1-1 1H5m11 4h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v1m4 3v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7.13a1 1 0 0 1 .24-.65L7.7 8.35A1 1 0 0 1 8.46 8H13a1 1 0 0 1 1 1Z"></path></svg>');function ei(t,e){N(e,!0);const r=ie("iconCtx")??{},s={xs:"w-3 h-3",sm:"w-4 h-4",md:"w-5 h-5",lg:"w-6 h-6",xl:"w-8 h-8"};let g=f(e,"size",19,()=>r.size||"md"),h=f(e,"color",19,()=>r.color||"currentColor"),w=f(e,"strokeWidth",19,()=>r.strokeWidth||2),_=I(e,["$$slots","$$events","$$legacy","size","color","title","strokeWidth","desc","class","ariaLabel"]),m=`${e.title?.id||""} ${e.desc?.id||""}`.trim();const a=!!(e.title?.id||e.desc?.id),n=!!e.ariaLabel||a;var v=$t();ee(v,i=>({xmlns:"http://www.w3.org/2000/svg",fill:"none",color:h(),..._,class:i,viewBox:"0 0 24 24","aria-label":e.ariaLabel,"aria-describedby":a?m:void 0,"aria-hidden":!n}),[()=>be("shrink-0",s[g()],e.class)]);var x=C(v);{var L=i=>{var u=Qt(),O=C(u,!0);k(u),P(()=>{b(u,"id",e.title.id),A(O,e.title.title)}),l(i,u)};j(x,i=>{e.title?.id&&e.title.title&&i(L)})}var y=H(x);{var c=i=>{var u=pt(),O=C(u,!0);k(u),P(()=>{b(u,"id",e.desc.id),A(O,e.desc.desc)}),l(i,u)};j(y,i=>{e.desc?.id&&e.desc.desc&&i(c)})}var o=H(y);k(v),P(()=>b(o,"stroke-width",w())),l(t,v),q()}var ti=W("<title> </title>"),ii=W("<desc> </desc>"),ri=W('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"></path></svg>');function ai(t,e){N(e,!0);const r=ie("iconCtx")??{},s={xs:"w-3 h-3",sm:"w-4 h-4",md:"w-5 h-5",lg:"w-6 h-6",xl:"w-8 h-8"};let g=f(e,"size",19,()=>r.size||"md"),h=f(e,"color",19,()=>r.color||"currentColor"),w=f(e,"strokeWidth",19,()=>r.strokeWidth||2),_=I(e,["$$slots","$$events","$$legacy","size","color","title","strokeWidth","desc","class","ariaLabel"]),m=`${e.title?.id||""} ${e.desc?.id||""}`.trim();const a=!!(e.title?.id||e.desc?.id),n=!!e.ariaLabel||a;var v=ri();ee(v,i=>({xmlns:"http://www.w3.org/2000/svg",fill:"none",color:h(),..._,class:i,viewBox:"0 0 24 24","aria-label":e.ariaLabel,"aria-describedby":a?m:void 0,"aria-hidden":!n}),[()=>be("shrink-0",s[g()],e.class)]);var x=C(v);{var L=i=>{var u=ti(),O=C(u,!0);k(u),P(()=>{b(u,"id",e.title.id),A(O,e.title.title)}),l(i,u)};j(x,i=>{e.title?.id&&e.title.title&&i(L)})}var y=H(x);{var c=i=>{var u=ii(),O=C(u,!0);k(u),P(()=>{b(u,"id",e.desc.id),A(O,e.desc.desc)}),l(i,u)};j(y,i=>{e.desc?.id&&e.desc.desc&&i(c)})}var o=H(y);k(v),P(()=>b(o,"stroke-width",w())),l(t,v),q()}var ni=W("<title> </title>"),li=W("<desc> </desc>"),oi=W('<svg><!><!><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"></path></svg>');function si(t,e){N(e,!0);const r=ie("iconCtx")??{},s={xs:"w-3 h-3",sm:"w-4 h-4",md:"w-5 h-5",lg:"w-6 h-6",xl:"w-8 h-8"};let g=f(e,"size",19,()=>r.size||"md"),h=f(e,"color",19,()=>r.color||"currentColor"),w=f(e,"strokeWidth",19,()=>r.strokeWidth||2),_=I(e,["$$slots","$$events","$$legacy","size","color","title","strokeWidth","desc","class","ariaLabel"]),m=`${e.title?.id||""} ${e.desc?.id||""}`.trim();const a=!!(e.title?.id||e.desc?.id),n=!!e.ariaLabel||a;var v=oi();ee(v,i=>({xmlns:"http://www.w3.org/2000/svg",fill:"none",color:h(),..._,class:i,viewBox:"0 0 24 24","aria-label":e.ariaLabel,"aria-describedby":a?m:void 0,"aria-hidden":!n}),[()=>be("shrink-0",s[g()],e.class)]);var x=C(v);{var L=i=>{var u=ni(),O=C(u,!0);k(u),P(()=>{b(u,"id",e.title.id),A(O,e.title.title)}),l(i,u)};j(x,i=>{e.title?.id&&e.title.title&&i(L)})}var y=H(x);{var c=i=>{var u=li(),O=C(u,!0);k(u),P(()=>{b(u,"id",e.desc.id),A(O,e.desc.desc)}),l(i,u)};j(y,i=>{e.desc?.id&&e.desc.desc&&i(c)})}var o=H(y);k(v),P(()=>b(o,"stroke-width",w())),l(t,v),q()}const di=t=>{St(t,{})},ci=t=>{Ft(t,{})},Ze=t=>{si(t,{})},vi=t=>{ei(t,{})},ui={"move-array-item-up":di,"move-array-item-down":ci,"remove-array-item":Ze,"copy-array-item":vi,"remove-object-property":Ze},Be=ui,fi=je(Be),hi=t=>{Kt(t,{})};Be.clear=hi;const gi=t=>{ai(t,{})};Be.edit=gi;var mi=Z('<div aria-label="arrow-down" role="img"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7 7 7-7"></path><path d="M12 14v5"></path><path d="M12 5v9" class="svelte-1rktpzn"></path></svg></div>');const wi={hash:"svelte-1rktpzn",code:"div.svelte-1rktpzn {display:inline-block;}path.svelte-1rktpzn {transition:all 0.2s ease-out;}.head.svelte-1rktpzn {transform:translateY(-3px);}"};function _i(t,e){_e(t,wi);let r=f(e,"color",3,"currentColor"),s=f(e,"size",3,24),g=f(e,"strokeWidth",3,2),h=f(e,"isHovered",7,!1),w=f(e,"class",3,"");function _(){h(!0),setTimeout(()=>{h(!1)},200)}var m=mi(),a=C(m),n=C(a);let v;var x=H(n);let L;fe(),k(a),k(m),P(()=>{S(m,1,we(w()),"svelte-1rktpzn"),b(a,"width",s()),b(a,"height",s()),b(a,"stroke",r()),b(a,"stroke-width",g()),v=S(n,0,"svelte-1rktpzn",null,v,{head:h()}),L=S(x,0,"svelte-1rktpzn",null,L,{head:h()})}),ue("mouseenter",m,_),l(t,m)}var bi=Z('<div aria-label="arrow-up" role="img"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"></path><path d="M12 10V5"></path><path d="M12 19V10" class="svelte-1oh036w"></path></svg></div>');const yi={hash:"svelte-1oh036w",code:"div.svelte-1oh036w {display:inline-block;}path.svelte-1oh036w {transition:all 0.2s ease-out;}.head.svelte-1oh036w {transform:translateY(3px);}"};function xi(t,e){_e(t,yi);let r=f(e,"color",3,"currentColor"),s=f(e,"size",3,24),g=f(e,"strokeWidth",3,2),h=f(e,"isHovered",7,!1),w=f(e,"class",3,"");function _(){h(!0),setTimeout(()=>{h(!1)},200)}var m=bi(),a=C(m),n=C(a);let v;var x=H(n);let L;fe(),k(a),k(m),P(()=>{S(m,1,we(w()),"svelte-1oh036w"),b(a,"width",s()),b(a,"height",s()),b(a,"stroke",r()),b(a,"stroke-width",g()),v=S(n,0,"svelte-1oh036w",null,v,{head:h()}),L=S(x,0,"svelte-1oh036w",null,L,{head:h()})}),ue("mouseenter",m,_),l(t,m)}var ki=Z('<div aria-label="copy" role="img"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" class="svelte-1v2qtoo"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></div>');const Ci={hash:"svelte-1v2qtoo",code:`div.svelte-1v2qtoo {display:inline-block;}.copy-rect.svelte-1v2qtoo,
	.copy-path.svelte-1v2qtoo {transition:transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);}.copy-rect.animate.svelte-1v2qtoo {transform:translate(-3px, -3px);}.copy-path.animate.svelte-1v2qtoo {transform:translate(3px, 3px);}svg.svelte-1v2qtoo {overflow:visible;}`};function Li(t,e){_e(t,Ci);let r=f(e,"color",3,"currentColor"),s=f(e,"size",3,24),g=f(e,"strokeWidth",3,2),h=f(e,"isHovered",7,!1),w=f(e,"class",3,"");function _(){h(!0)}function m(){h(!1)}var a=ki(),n=C(a),v=C(n);let x;var L=H(v);let y;k(n),k(a),P(()=>{S(a,1,we(w()),"svelte-1v2qtoo"),b(n,"width",s()),b(n,"height",s()),b(n,"stroke",r()),b(n,"stroke-width",g()),x=S(v,0,"copy-rect svelte-1v2qtoo",null,x,{animate:h()}),y=S(L,0,"copy-path svelte-1v2qtoo",null,y,{animate:h()})}),ue("mouseenter",a,_),ue("mouseleave",a,m),l(t,a)}var zi=Z('<div aria-label="pencil" role="img"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" class="svelte-31umag"></path><path d="m15 5 4 4" class="svelte-31umag"></path></svg></div>');const Mi={hash:"svelte-31umag",code:`div.svelte-31umag {display:inline-block;}.pencil-icon.svelte-31umag {overflow:visible;transform:rotate(0deg);transform-origin:center;}.pencil-icon.animate.svelte-31umag {
		animation: svelte-31umag-jiggleAnimation 0.4s ease-in-out 2;}

	@keyframes svelte-31umag-jiggleAnimation {
		25% {
			transform: rotate(-15deg);
		}
		75% {
			transform: rotate(15deg);
		}
	}`};function ji(t,e){_e(t,Mi);let r=f(e,"color",3,"currentColor"),s=f(e,"size",3,24),g=f(e,"strokeWidth",3,2),h=f(e,"isHovered",7,!1),w=f(e,"class",3,"");function _(){h(!0),setTimeout(()=>{h(!1)},800)}var m=zi(),a=C(m);let n;k(m),P(()=>{S(m,1,we(w()),"svelte-31umag"),b(a,"width",s()),b(a,"height",s()),b(a,"stroke",r()),b(a,"stroke-width",g()),n=S(a,0,"pencil-icon svelte-31umag",null,n,{animate:h()})}),ue("mouseenter",m,_),l(t,m)}var Hi=Z('<div aria-label="trash" role="img"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><g><path d="M3 6h18"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></g><path d="M19 8v12c0 1-1 2-2 2H7c-1 0-2-1-2-2V8"></path></svg></div>');const Pi={hash:"svelte-1na9nhd",code:"div.svelte-1na9nhd {display:inline-block;}.is-animated.svelte-1na9nhd {transform:translateY(-1px);transition:transform 0.2s ease-in;}.animate-path.svelte-1na9nhd {transform:translateY(1px);transition:transform 0.2s ease-in;}.is-animated-line.svelte-1na9nhd {transition:all 0.2s ease-in;}.is-animated-path.svelte-1na9nhd {transition:all 0.2s ease-in;}"};function Wi(t,e){_e(t,Pi);let r=f(e,"color",3,"currentColor"),s=f(e,"size",3,24),g=f(e,"strokeWidth",3,2),h=f(e,"isHovered",7,!1),w=f(e,"class",3,"");function _(){h(!0)}function m(){h(!1)}var a=Hi(),n=C(a),v=C(n);let x;var L=H(v);let y;k(n),k(a),P(()=>{S(a,1,we(w()),"svelte-1na9nhd"),b(n,"width",s()),b(n,"height",s()),b(n,"stroke",r()),b(n,"stroke-width",g()),x=S(v,0,"svelte-1na9nhd",null,x,{"is-animated":h()}),y=S(L,0,"svelte-1na9nhd",null,y,{"animate-path":h()})}),ue("mouseenter",a,_),ue("mouseleave",a,m),l(t,a)}var Oi=Z('<div aria-label="x" role="img"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18" class="diagonal-1 svelte-1657tj3"></path><path d="m6 6 12 12" class="diagonal-2 svelte-1657tj3"></path></svg></div>');const Di={hash:"svelte-1657tj3",code:`div.svelte-1657tj3 {display:inline-block;}.x.svelte-1657tj3 {overflow:visible;}.diagonal-1.svelte-1657tj3,
	.diagonal-2.svelte-1657tj3 {stroke-dasharray:17;stroke-dashoffset:0;transition:stroke-dashoffset 0.15s ease-out;}.x.animate.svelte-1657tj3 .diagonal-1:where(.svelte-1657tj3) {opacity:0;
		animation: svelte-1657tj3-lineAnimation 0.3s ease-out forwards;}.x.animate.svelte-1657tj3 .diagonal-2:where(.svelte-1657tj3) {opacity:0;
		animation: svelte-1657tj3-lineAnimation 0.3s ease-out 0.25s forwards;}

	@keyframes svelte-1657tj3-lineAnimation {
		0% {
			opacity: 0;
			stroke-dashoffset: 17;
		}
		15% {
			opacity: 1;
			stroke-dashoffset: 17;
		}
		100% {
			opacity: 1;
			stroke-dashoffset: 0;
		}
	}`};function Vi(t,e){_e(t,Di);let r=f(e,"color",3,"currentColor"),s=f(e,"size",3,24),g=f(e,"strokeWidth",3,2),h=f(e,"isHovered",7,!1),w=f(e,"class",3,"");function _(){h(!0),setTimeout(()=>{h(!1)},500)}var m=Oi(),a=C(m);let n;k(m),P(()=>{S(m,1,we(w()),"svelte-1657tj3"),b(a,"width",s()),b(a,"height",s()),b(a,"stroke",r()),b(a,"stroke-width",g()),n=S(a,0,"x svelte-1657tj3",null,n,{animate:h()})}),ue("mouseenter",m,_),l(t,m)}const Bi=t=>{xi(t,{size:20})},Ti=t=>{_i(t,{size:20})},Ee=t=>{Wi(t,{size:20})},Ai=t=>{Li(t,{size:20})},Ni={"move-array-item-up":Bi,"move-array-item-down":Ti,"remove-array-item":Ee,"copy-array-item":Ai,"remove-object-property":Ee},Te=Ni,qi=je(Te),Zi=t=>{Vi(t,{size:20})};Te.clear=Zi;const Ei=t=>{ji(t,{size:20})};Te.edit=Ei;var Ui=Z("<!> <!>",1),Fi=Z("<!> <!>",1),Yi=Z("<!> <!>",1),Ii=Z("<!> <!> <!>",1);function Xi(t,e){N(e,!0);const r=He(),s="objectTemplate",g=z(()=>K(r,"layout",e.config)),h=z(()=>K(r,"title",e.config)),w=z(()=>K(r,"description",e.config)),_=z(()=>K(r,"errorsList",e.config)),m=z(()=>Oe(e.uiOption,e.config)),a=z(()=>d(m).title),n=z(()=>d(m).description),v=z(()=>d(m).showMeta);var x=D(),L=M(x);T(L,()=>d(g),(y,c)=>{c(y,{type:"object-field",get config(){return e.config},get errors(){return e.errors},children:(o,i)=>{var u=Ii(),O=M(u);{var ne=B=>{var U=D(),R=M(U);T(R,()=>d(g),(Q,V)=>{V(Q,{type:"object-field-meta",get config(){return e.config},get errors(){return e.errors},children:(F,p)=>{var G=Fi(),Y=M(G);{var ae=E=>{var $=D(),oe=M($);T(oe,()=>d(g),(se,J)=>{J(se,{type:"object-field-title-row",get config(){return e.config},get errors(){return e.errors},children:(de,ke)=>{var ce=Ui(),ve=M(ce);T(ve,()=>d(h),(Me,me)=>{me(Me,{templateType:s,get title(){return d(a)},get config(){return e.config},get errors(){return e.errors}})});var Ce=H(ve,2);X(Ce,()=>e.action??te),l(de,ce)},$$slots:{default:!0}})}),l(E,$)};j(Y,E=>{d(a)&&E(ae)})}var xe=H(Y,2);{var le=E=>{var $=D(),oe=M($);T(oe,()=>d(w),(se,J)=>{J(se,{templateType:s,get description(){return d(n)},get config(){return e.config},get errors(){return e.errors}})}),l(E,$)};j(xe,E=>{d(n)&&E(le)})}l(F,G)},$$slots:{default:!0}})}),l(B,U)};j(O,B=>{d(v)&&(d(a)||d(n))&&B(ne)})}var re=H(O,2);{var he=B=>{var U=Yi(),R=M(U);T(R,()=>d(g),(V,F)=>{F(V,{type:"object-properties",get config(){return e.config},get errors(){return e.errors},children:(p,G)=>{var Y=D(),ae=M(Y);X(ae,()=>e.children),l(p,Y)},$$slots:{default:!0}})});var Q=H(R,2);X(Q,()=>e.addButton??te),l(B,U)};j(re,B=>{(e.config.required||!Pe(e.value))&&B(he)})}var ge=H(re,2);{var ye=B=>{var U=D(),R=M(U);T(R,()=>d(_),(Q,V)=>{V(Q,{get errors(){return e.errors},get config(){return e.config}})}),l(B,U)};j(ge,B=>{e.errors.length>0&&B(ye)})}l(o,u)},$$slots:{default:!0}})}),l(t,x),q()}We.optionalObjectTemplate=Xi;var Si=Z("<!> <!>",1),Ri=Z("<!> <!>",1),Gi=Z("<!> <!> <!> <!>",1);function Ji(t,e){N(e,!0);const r="fieldTemplate",s=He(),g=z(()=>K(s,"layout",e.config)),h=z(()=>K(s,e.uiOption("useLabel")??e.useLabel?"label":"title",e.config)),w=z(()=>K(s,"description",e.config)),_=z(()=>K(s,"errorsList",e.config)),m=z(()=>K(s,"help",e.config)),a=z(()=>Oe(e.uiOption,e.config)),n=z(()=>d(a).title),v=z(()=>d(a).description),x=z(()=>d(a).showMeta),L=z(()=>e.uiOption("help"));var y=D(),c=M(y);T(c,()=>d(g),(o,i)=>{i(o,{type:"field",get config(){return e.config},get errors(){return e.errors},children:(u,O)=>{var ne=Gi(),re=M(ne);{var he=V=>{var F=D(),p=M(F);T(p,()=>d(g),(G,Y)=>{Y(G,{type:"field-meta",get config(){return e.config},get errors(){return e.errors},children:(ae,xe)=>{var le=Ri(),E=M(le);{var $=J=>{var de=D(),ke=M(de);T(ke,()=>d(g),(ce,ve)=>{ve(ce,{type:"field-title-row",get config(){return e.config},get errors(){return e.errors},children:(Ce,Me)=>{var me=Si(),Ae=M(me);T(Ae,()=>d(h),(Fe,Ye)=>{Ye(Fe,{templateType:r,get title(){return d(n)},get config(){return e.config},get errors(){return e.errors}})});var Ue=H(Ae,2);X(Ue,()=>e.action??te),l(Ce,me)},$$slots:{default:!0}})}),l(J,de)};j(E,J=>{e.showTitle&&d(n)&&J($)})}var oe=H(E,2);{var se=J=>{var de=D(),ke=M(de);T(ke,()=>d(w),(ce,ve)=>{ve(ce,{templateType:r,get description(){return d(v)},get config(){return e.config},get errors(){return e.errors}})}),l(J,de)};j(oe,J=>{d(v)&&J(se)})}l(ae,le)},$$slots:{default:!0}})}),l(V,F)};j(re,V=>{d(x)&&(e.showTitle&&d(n)||d(v))&&V(he)})}var ge=H(re,2);{var ye=V=>{var F=D(),p=M(F);T(p,()=>d(g),(G,Y)=>{Y(G,{type:"field-content",get config(){return e.config},get errors(){return e.errors},children:(ae,xe)=>{var le=D(),E=M(le);X(E,()=>e.children),l(ae,le)},$$slots:{default:!0}})}),l(V,F)};j(ge,V=>{(e.config.required||!Pe(e.value))&&V(ye)})}var B=H(ge,2);{var U=V=>{var F=D(),p=M(F);T(p,()=>d(_),(G,Y)=>{Y(G,{get errors(){return e.errors},get config(){return e.config}})}),l(V,F)};j(B,V=>{e.errors.length>0&&V(U)})}var R=H(B,2);{var Q=V=>{var F=D(),p=M(F);T(p,()=>d(m),(G,Y)=>{Y(G,{get help(){return d(L)},get config(){return e.config},get errors(){return e.errors}})}),l(V,F)};j(R,V=>{d(L)!==void 0&&V(Q)})}l(u,ne)},$$slots:{default:!0}})}),l(t,y),q()}We.optionalFieldTemplate=Ji;var Ki=Z("<!> <!>",1),Qi=Z("<!> <!>",1),pi=Z("<!> <!>",1),$i=Z("<!> <!> <!>",1);function er(t,e){N(e,!0);const r=He(),s="optionalArrayTemplate",g=z(()=>K(r,"layout",e.config)),h=z(()=>K(r,"title",e.config)),w=z(()=>K(r,"description",e.config)),_=z(()=>K(r,"errorsList",e.config)),m=z(()=>Oe(e.uiOption,e.config)),a=z(()=>d(m).title),n=z(()=>d(m).description),v=z(()=>d(m).showMeta);var x=D(),L=M(x);T(L,()=>d(g),(y,c)=>{c(y,{type:"array-field",get config(){return e.config},get errors(){return e.errors},children:(o,i)=>{var u=$i(),O=M(u);{var ne=B=>{var U=D(),R=M(U);T(R,()=>d(g),(Q,V)=>{V(Q,{type:"array-field-meta",get config(){return e.config},get errors(){return e.errors},children:(F,p)=>{var G=Qi(),Y=M(G);{var ae=E=>{var $=D(),oe=M($);T(oe,()=>d(g),(se,J)=>{J(se,{type:"array-field-title-row",get config(){return e.config},get errors(){return e.errors},children:(de,ke)=>{var ce=Ki(),ve=M(ce);T(ve,()=>d(h),(Me,me)=>{me(Me,{templateType:s,get title(){return d(a)},get config(){return e.config},get errors(){return e.errors}})});var Ce=H(ve,2);X(Ce,()=>e.action??te),l(de,ce)},$$slots:{default:!0}})}),l(E,$)};j(Y,E=>{d(a)&&E(ae)})}var xe=H(Y,2);{var le=E=>{var $=D(),oe=M($);T(oe,()=>d(w),(se,J)=>{J(se,{templateType:s,get description(){return d(n)},get config(){return e.config},get errors(){return e.errors}})}),l(E,$)};j(xe,E=>{d(n)&&E(le)})}l(F,G)},$$slots:{default:!0}})}),l(B,U)};j(O,B=>{d(v)&&(d(a)||d(n))&&B(ne)})}var re=H(O,2);{var he=B=>{var U=pi(),R=M(U);T(R,()=>d(g),(V,F)=>{F(V,{type:"array-items",get config(){return e.config},get errors(){return e.errors},children:(p,G)=>{var Y=D(),ae=M(Y);X(ae,()=>e.children),l(p,Y)},$$slots:{default:!0}})});var Q=H(R,2);X(Q,()=>e.addButton??te),l(B,U)};j(re,B=>{(e.config.required||!Pe(e.value))&&B(he)})}var ge=H(re,2);{var ye=B=>{var U=D(),R=M(U);T(R,()=>d(_),(Q,V)=>{V(Q,{get errors(){return e.errors},get config(){return e.config}})}),l(B,U)};j(ge,B=>{e.errors.length>0&&B(ye)})}l(o,u)},$$slots:{default:!0}})}),l(t,x),q()}We.optionalArrayTemplate=er;var tr=Z("<!> <!>",1),ir=Z("<!> <!>",1);function rr(t,e){N(e,!0);const r=He(),s=z(()=>K(r,"layout",e.config));var g=D(),h=M(g);T(h,()=>d(s),(w,_)=>{_(w,{type:"multi-field",get config(){return e.config},get errors(){return e.errors},children:(m,a)=>{var n=ir(),v=M(n);T(v,()=>d(s),(y,c)=>{c(y,{type:"multi-field-controls",get config(){return e.config},get errors(){return e.errors},children:(o,i)=>{var u=tr(),O=M(u);X(O,()=>e.optionSelector);var ne=H(O,2);X(ne,()=>e.action??te),l(o,u)},$$slots:{default:!0}})});var x=H(v,2);{var L=y=>{var c=D(),o=M(c);T(o,()=>d(s),(i,u)=>{u(i,{type:"multi-field-content",get config(){return e.config},get errors(){return e.errors},children:(O,ne)=>{var re=D(),he=M(re);X(he,()=>e.children),l(O,re)},$$slots:{default:!0}})}),l(y,c)};j(x,y=>{(e.config.required||!Pe(e.value))&&y(L)})}l(m,n)},$$slots:{default:!0}})}),l(t,g),q()}We.optionalMultiFieldTemplate=rr;var ar=Z('<button style="display: flex; gap: 0.5rem; align-items: center; height: 2rem"><!> </button>'),nr=Z('<div><div style="display: flex; flex-direction: column; gap: 1rem"></div></div>');function lr(t,e){N(e,!0);const r=I(e,["$$slots","$$events","$$legacy","icons"]),s={path:[],required:!1,schema:{},uiSchema:{},title:"title"},g={"move-array-item-up":{},"move-array-item-down":{},"remove-array-item":{},"copy-array-item":{},"remove-object-property":{},edit:{},clear:{}};var h=nr();ee(h,()=>({style:"height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center",...r}));var w=C(h);Ie(w,21,()=>Object.entries(g),Xe,(_,m)=>{var a=z(()=>Se(d(m),2));let n=()=>d(a)[0],v=()=>d(a)[1];const x=z(n),L=z(()=>({config:s,translation:"",params:v()}));var y=ar(),c=C(y);X(c,()=>e.icons(d(x),d(L))??te,()=>d(L));var o=H(c);k(y),P(()=>A(o,` ${n()??""}`)),l(_,y)}),k(w),k(h),l(t,h),q()}function kr(t,e){const r={flowbite:fi,lucide:Tt,moving:qi,radix:zt};lr(t,{style:"width: 100%; display: flex; align-items: center; justify-content: center",get icons(){return r[e.pkg]}})}export{kr as default};
