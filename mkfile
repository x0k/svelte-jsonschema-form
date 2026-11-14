#!/usr/bin/env bash

set -xe

@template scripts:
  c:
    pnpm run check
  b:
    pnpm run build
  p:
    pnpm run preview
  d:
    pnpm run dev
  l:
    pnpm run lint
  f:
    pnpm run format
  t:
    pnpm run test $@
  tu:
    pnpm run test -u $@
  tv:
    pnpm run test:visual $@
  ben:
    pnpm run bench $@

@template pkg_scripts pkg_dir:
  pushd pkg_dir
  @use scripts
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

bp:
  pnpm run bench:perf $@

bb:
  pnpm run bench:bundle $@

cs:
  pnpm changeset

h:
  mk -P targets "*"

pushd packages
f/:
  @use pkg_scripts form

tt/:
  @use pkg_scripts theme-testing

vt/:
  @use pkg_scripts validator-testing

ajv/:
  @use pkg_scripts ajv8-validator

zod/:
  @use pkg_scripts zod4-validator

val/:
  @use pkg_scripts valibot-validator

cfw/:
  @use pkg_scripts cfworker-validator

safe/:
  @use pkg_scripts schemasafe-validator

ata/:
  @use pkg_scripts ata-validator

basic/:
  @use pkg_scripts basic-theme

daisy/:
  @use pkg_scripts daisyui5-theme

skel/:
  @use pkg_scripts skeleton5-theme

flow/:
  @use pkg_scripts flowbite3-theme

flowi/:
  @use pkg_scripts flowbite-icons

luci/:
  @use pkg_scripts lucide-icons

movi/:
  @use pkg_scripts moving-icons

radi/:
  @use pkg_scripts radix-icons

shad/:
  @use pkg_scripts shadcn4-theme

kit/:
  @use pkg_scripts sveltekit3

meta/:
  @use pkg_scripts meta
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
  @use pkg_scripts hyperjump-validator
shade/:
  @use pkg_scripts shadcn-extras-theme
svar/:
  @use pkg_scripts svar-theme
beer/:
  @use pkg_scripts beercss-theme
popd

leg/:
  pushd legacy
  daisy/:
    @use pkg_scripts daisyui-theme
  skel3/:
    @use pkg_scripts skeleton3-theme
  skel/:
    @use pkg_scripts skeleton4-theme
  flow/:
    @use pkg_scripts flowbite-theme
  shad/:
    @use pkg_scripts shadcn-theme
  kit/:
    @use pkg_scripts sveltekit
  popd

e/:
  pushd examples
  basic/:
    @use pkg_scripts basic-starter
  daisy/:
    @use pkg_scripts daisyui5-starter
  flow/:
    @use pkg_scripts flowbite3-starter
  skel/:
    @use pkg_scripts skeleton5-starter
  shad/:
    @use pkg_scripts shadcn4-starter
  shad-extras/:
    @use pkg_scripts shadcn4-starter
  mark/:
    @use pkg_scripts markdown-description
  zod/:
    @use pkg_scripts zod-starter
  valibot/:
    @use pkg_scripts valibot-starter
  ark/:
    @use pkg_scripts arktype-starter
  type/:
    @use pkg_scripts typebox-starter
  kit2/:
    @use pkg_scripts sveltekit-starter
  kit/:
    @use pkg_scripts sveltekit3-starter
  popd

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
  @use scripts
  popd

pushd apps
docs/:
  @use pkg_scripts docs2

pl/:
  @use pkg_scripts playground2

bl/:
  @use pkg_scripts builder
popd