#!/usr/bin/env bash

set -xe

d:
  pnpm run dev

t:
  pnpm run test

b:
  pnpm run build

tp:
  pnpx turbo run preview --only

tb:
  pnpx turbo run build --only

c:
  pnpm run check
