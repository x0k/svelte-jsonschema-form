#!/usr/bin/env bash

set -xe

@template scripts pkg_dir:
  pushd pkg_dir
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
  tv:
    pnpm run test:visual $@
  popd

update:
  pnpm -w update --no-save
  pnpm dedupe

fcommit:
  git commit -n

push:
  git push -u $@ origin HEAD

fpush:
  git push --no-verify $@

d:
  pnpm run dev

t:
  pnpm run test $@

fmt:
  pnpm run format

fcheck:
  pnpm run format:check

lint:
  pnpm run lint

flint:
  pnpm run lint:fix

tu:
  pnpm run test $@ -- -u

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

pushd packages
f/:
  pushd form
  l:
    pnpm run lint
  f:
    pnpm run format
  c:
    pnpm run check
  t:
    pnpm run test $@
  ben:
    pnpm run bench $@
  b:
    pnpm run build
  popd

tt/:
  @use scripts theme-testing

vt/:
  @use scripts validator-testing

ajv/:
  @use scripts ajv8-validator

zod/:
  @use scripts zod4-validator

val/:
  @use scripts valibot-validator

cfw/:
  @use scripts cfworker-validator

safe/:
  @use scripts schemasafe-validator

ata/:
  @use scripts ata-validator

basic/:
  @use scripts basic-theme

daisy/:
  @use scripts daisyui5-theme

skel/:
  @use scripts skeleton5-theme

flow/:
  @use scripts flowbite3-theme

flowi/:
  @use scripts flowbite-icons

luci/:
  @use scripts lucide-icons

movi/:
  @use scripts moving-icons

radi/:
  @use scripts radix-icons

shad/:
  @use scripts shadcn4-theme

kit/:
  @use scripts sveltekit3
popd

sjsf/:
  filter=(--filter="@sjsf/*" --filter="@sjsf-lab/*")
  c:
    pnpm run check ${filter[@]} $@
  t:
    pnpm run test ${filter[@]} $@
  b:
    pnpm run build ${filter[@]} $@

pushd lab
hyper/:
  @use scripts hyperjump-validator
shade/:
  @use scripts shadcn-extras-theme
svar/:
  @use scripts svar-theme
beer/:
  @use scripts beercss-theme
popd

leg/:
  pushd legacy
  daisy/:
    @use scripts daisyui-theme
  skel3/:
    @use scripts skeleton3-theme
  skel/:
    @use scripts skeleton4-theme
  flow/:
    @use scripts flowbite-theme
  shad/:
    @use scripts shadcn-theme
  kit/:
    @use scripts sveltekit
  popd

e/:
  pushd examples
  basic/:
    @use scripts basic-starter
  daisy/:
    @use scripts daisyui5-starter
  flow/:
    @use scripts flowbite3-starter
  skel/:
    @use scripts skeleton5-starter
  shad/:
    @use scripts shadcn4-starter
  shad-extras/:
    @use scripts shadcn4-starter
  mark/:
    @use scripts markdown-description
  zod/:
    @use scripts zod-starter
  valibot/:
    @use scripts valibot-starter
  ark/:
    @use scripts arktype-starter
  type/:
    @use scripts typebox-starter
  kit2/:
    @use scripts sveltekit-starter
  kit/:
    @use scripts sveltekit3-starter
  popd

meta/:
  @use scripts meta

sv/:
  pushd packages/sv
  dr:
    rm -rf demo || true
  dc:
    pnpm run demo-create
  da:
    pnpm run demo-add
  demo/:
    pushd demo
    i:
      npm install
    c:
      npm run check
    d:
      npm run dev
    popd
  d: dr dc da demo/*
  c:
    pnpm run check
  t:
    pnpm run test $@
  b:
    pnpm run build
  popd

pushd apps
docs/:
  @use scripts docs2

pl/:
  @use scripts playground2

bl/:
  @use scripts builder
popd