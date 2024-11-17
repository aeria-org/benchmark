#!/bin/sh

rm -rf packages/*/dist

pnpm --filter='./suite' build \
  && pnpm --filter='./packages/aeria' build \
  && pnpm --filter='./packages/mongoose' build \
  && pnpm --filter='./packages/prisma' build 
