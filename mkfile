#!/usr/bin/env bash

set -xe

d:
  pnpm run dev

t:
  pnpm run test $@

tu:
  pnpm run test -- -u

b:
  pnpm run build $@

c:
  pnpm run check $@

p:
  pnpm run preview

cs:
  pnpm changeset

h:
  mk -P targets "*"

f/:
  pushd packages/form
  d:
    pnpm run dev
  b:
    pnpm run build
  ben:
    pnpm run bench $@
  c:
    pnpm run check
  t:
    pnpm run test $@
  l:
    pnpm run lint
  f:
    pnpm run format
  tui:
    pnpm run test:ui
  popd

tt/:
  pushd packages/theme-testing
  c:
    pnpm run check
  b:
    pnpm run build
  popd


vt/:
  pushd packages/validator-testing
  c:
    pnpm run check
  b:
    pnpm run build
  popd

sjsf/:
  c:
    pnpm run check --filter="@sjsf/*" $@
  t:
    pnpm run test --filter="@sjsf/*" $@
  b:
    pnpm run build --filter="@sjsf/*" $@

ajv/:
  pushd packages/ajv8-validator
  b:
    pnpm run build
  t:
    pnpm run test
  popd

zod/:
  pushd packages/zod4-validator
  b:
    pnpm run build
  t:
    pnpm run test $@
  popd

val/:
  pushd packages/valibot-validator
  b:
    pnpm run build
  t:
    pnpm run test $@
  popd

cfw/:
  pushd packages/cfworker-validator
  b:
    pnpm run build
  t:
    pnpm run test
  popd

safe/:
  pushd packages/schemasafe-validator
  b:
    pnpm run build
  t:
    pnpm run test
  popd

basic/:
  pushd packages/basic-theme
  c:
    pnpm run check
  b:
    pnpm run build
  d:
    pnpm run dev
  t:
    pnpm run test $@
  popd

daisy/:
  pushd packages/daisyui5-theme
  c:
    pnpm run check
  b:
    pnpm run build
  d:
    pnpm run dev
  t:
    pnpm run test $@
  popd

skel/:
  pushd packages/skeleton4-theme
  c:
    pnpm run check
  b:
    pnpm run build
  d:
    pnpm run dev
  t:
    pnpm run test $@
  popd

flow/:
  pushd packages/flowbite3-theme
  c:
    pnpm run check
  b:
    pnpm run build
  d:
    pnpm run dev
  t:
    pnpm run test $@
  popd

flowi/:
  pushd packages/flowbite-icons
  c:
    pnpm run check
  b:
    pnpm run build
  d:
    pnpm run dev
  popd

luci/:
  pushd packages/lucide-icons
  c:
    pnpm run check
  b:
    pnpm run build
  d:
    pnpm run dev
  popd

movi/:
  pushd packages/moving-icons
  c:
    pnpm run check
  b:
    pnpm run build
  d:
    pnpm run dev
  popd

radi/:
  pushd packages/radix-icons
  c:
    pnpm run check
  b:
    pnpm run build
  d:
    pnpm run dev
  popd

shad/:
  pushd packages/shadcn4-theme
  c:
    pnpm run check
  b:
    pnpm run build
  p:
    pnpm run preview
  d:
    pnpm run dev
  t:
    pnpm run test $@
  popd

sv/:
  pushd packages/sveltekit
  c:
    pnpm run check
  b:
    pnpm run build
  p:
    pnpm run preview
  d:
    pnpm run dev
  t:
    pnpm run test $@
  popd

docs/:
  pushd apps/docs2
  c:
    pnpm run check
  d:
    pnpm run dev
  b:
    pnpm run build
  p:
    pnpm run preview
  popd

pl/:
  pushd apps/playground2
  d:
    pnpm run dev
  c:
    pnpm run check
  b:
    pnpm run build
  p:
    pnpm run preview
  popd

bl/:
  pushd apps/builder
  d:
    pnpm run dev
  c:
    pnpm run check
  b:
    pnpm run build
  p:
    pnpm run preview
  popd

leg/:
  pushd legacy
  daisy/:
    pushd daisyui-theme
    c:
      pnpm run check
    b:
      pnpm run build
    d:
      pnpm run dev
    t:
      pnpm run test $@
    popd
  skel/:
    pushd skeleton3-theme
    c:
      pnpm run check
    b:
      pnpm run build
    d:
      pnpm run dev
    t:
      pnpm run test $@
    popd
  flow/:
    pushd flowbite-theme
    c:
      pnpm run check
    b:
      pnpm run build
    d:
      pnpm run dev
    t:
      pnpm run test $@
    popd
  shad/:
    pushd shadcn-theme
    c:
      pnpm run check
    b:
      pnpm run build
    p:
      pnpm run preview
    d:
      pnpm run dev
    t:
      pnpm run test $@
    popd
  popd

l/:
  pushd lab
  shad/:
    pushd shadcn-extras-theme
    c:
      pnpm run check
    b:
      pnpm run build
    d:
      pnpm run dev
    t:
      pnpm run test $@
    popd
  popd

e/:
  pushd examples
  basic/:
    pushd basic-starter
    c:
      pnpm run check
    b:
      pnpm run build
    p:
      pnpm run preview
    d:
      pnpm run dev
    popd
  daisy/:
    pushd daisyui5-starter
    c:
      pnpm run check
    b:
      pnpm run build
    p:
      pnpm run preview
    d:
      pnpm run dev
    popd
  flow/:
    pushd flowbite3-starter
    c:
      pnpm run check
    b:
      pnpm run build
    p:
      pnpm run preview
    d:
      pnpm run dev
    popd
  skel/:
    pushd skeleton4-starter
    c:
      pnpm run check
    b:
      pnpm run build
    p:
      pnpm run preview
    d:
      pnpm run dev
    popd
  shad/:
    pushd shadcn4-starter
    c:
      pnpm run check
    b:
      pnpm run build
    p:
      pnpm run preview
    d:
      pnpm run dev
    popd
  mark/:
    pushd markdown-description
    c:
      pnpm run check
    b:
      pnpm run build
    p:
      pnpm run preview
    d:
      pnpm run dev
    popd
  zod/:
    pushd zod-starter
    c:
      pnpm run check
    b:
      pnpm run build
    p:
      pnpm run preview
    d:
      pnpm run dev
    popd
  valibot/:
    pushd valibot-starter
    c:
      pnpm run check
    b:
      pnpm run build
    p:
      pnpm run preview
    d:
      pnpm run dev
    popd
  ark/:
    pushd arktype-starter
    c:
      pnpm run check
    b:
      pnpm run build
    p:
      pnpm run preview
    d:
      pnpm run dev
    popd
  type/:
    pushd typebox-starter
    c:
      pnpm run check
    b:
      pnpm run build
    p:
      pnpm run preview
    d:
      pnpm run dev
    popd
  sv/:
    pushd sveltekit-starter
    c:
      pnpm run check
    b:
      pnpm run build
    p:
      pnpm run preview
    d:
      pnpm run dev
    popd
  popd
