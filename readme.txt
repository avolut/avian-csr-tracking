install using 

node@16
pnpm@8

to run: 

ensure app/db/.env exists

cd app/db
../../node_modules/.pnpm/prisma@3.15.2/node_modules/prisma/build/index.js generate

pnpm install
pnpm node base