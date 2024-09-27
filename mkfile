#!/usr/bin/env bash

set -xe

d:
  pnpm run dev

t:
  pnpm run test

b:
  pnpm run build

tb:
  pnpx turbo run build --only

c:
  pnpm run check
