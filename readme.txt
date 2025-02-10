install using 

node@16
pnpm@8

to run: 

ensure app/db/.env exists

pnpm install
pnpm node base 

cd app/db
../../node_modules/.pnpm/prisma@3.7.0/node_modules/prisma/build/index.js generate

pnpm node base