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

p:
  pnpm run preview

c:
  pnpm run check
