# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)
- I'm follwing the Remix doc in the long tutorial (https://remix.run/docs/en/main/tutorials/jokes) to write the set up steps. If any of these below steps fails, please
refer to the documentation
## Development

Before running the application: make sure to have node and npm installed on your machine.

From your terminal: 
1. Install all node packages
```sh
npm install
```
2. Build application

```sh
npm run dev
```
3. Connect to Prisma, initialize DB and push DB schema (prisma/schema.prisma)
```sh
npm install --save-dev prisma
npm install @prisma/client
npx prisma init --datasource-provider sqlite
npx prisma db push
npm install --save-dev ts-node tsconfig-paths
```
4. Seed the DB
```sh
npm install --save-dev ts-node tsconfig-paths
```
Put this block into package.json file
{
  "prisma": {
    "seed": "ts-node --require tsconfig-paths/register prisma/seed.ts"
  }
}
Now you can seed the DB by running:
```sh
npx prisma db seed
```

5. Running the application locally

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.
