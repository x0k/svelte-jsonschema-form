#!/usr/bin/env bash

set -xe

d:
  pnpm run dev

t:
  pnpm run test

b:
  pnpm run build

f/:
  pushd packages/form
  b:
    pnpm run build
  c:
    pnpm run check
  popd

docs/:
  pushd apps/docs
  d:
    pnpm run dev
  b:
    pnpm run build
  popd

pl/:
  pushd apps/playground
  d:
    pnpm run dev
  b:
    pnpm run build
  popd

daisy/:
  pushd packages/daisyui-theme
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

p:
  pnpm run preview

c:
  pnpm run check

cs:
  pnpm changeset
