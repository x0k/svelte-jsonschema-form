#!/usr/bin/env bash

set -xe

d:
  pnpm run dev

t:
  pnpm run test $@

b:
  pnpm run build $@

sjsf/:
  b:
    pnpm run build --filter="@sjsf/*"

c:
  pnpm run check $@

ajv/:
  pushd packages/ajv8-validator
  b:
    pnpm run build
  t:
    pnpm run test
  popd

zod/:
  pushd packages/zod-validator
  b:
    pnpm run build
  popd

cfw/:
  pushd packages/cfworker-validator
  b:
    pnpm run build
  popd

f/:
  pushd packages/form
  d:
    pnpm run dev
  b:
    pnpm run build
  c:
    pnpm run check
  t:
    pnpm run test $@
  tui:
    pnpm run test:ui
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

pl-old/:
  pushd apps/playground
  d:
    pnpm run dev
  c:
    pnpm run check
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

basic/:
  pushd packages/basic-theme
  c:
    pnpm run check
  b:
    pnpm run build
  d:
    pnpm run dev
  popd

daisy/:
  pushd packages/daisyui-theme
  c:
    pnpm run check
  b:
    pnpm run build
  d:
    pnpm run dev
  popd

daisy5/:
  pushd packages/daisyui5-theme
  c:
    pnpm run check
  b:
    pnpm run build
  d:
    pnpm run dev
  popd

skeleton/:
  pushd packages/skeleton-theme
  c:
    pnpm run check
  b:
    pnpm run build
  d:
    pnpm run dev
  popd

flow/:
  pushd packages/flowbite-theme
  c:
    pnpm run check
  b:
    pnpm run build
  d:
    pnpm run dev
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
  pushd packages/shadcn-theme
  c:
    pnpm run check
  b:
    pnpm run build
  d:
    pnpm run dev
  popd

ts/:
  pushd packages/testing
  c:
    pnpm run check
  b:
    pnpm run build
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

p:
  pnpm run preview

c:
  pnpm run check

cs:
  pnpm changeset

h:
  mk -P targets "*"
