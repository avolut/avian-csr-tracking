node@16
pnpm@7

npx pnpm i
cd app/db && npx pnpm prisma db pull && npx pnpm prisma generate && cd ../..
npx node base prod --port  5003