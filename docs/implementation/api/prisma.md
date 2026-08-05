# Prisma + MongoDB in a NestJS app

## Quick start

### Install the right Prisma packages

If you are using pnpm in this repo:

```bash
pnpm add -D prisma@6.19.0
pnpm add @prisma/client@6.19.0
```

> Use Prisma ORM v6.19.x for MongoDB. Prisma v7 does not support MongoDB yet, so pin the version explicitly.

### Initialize Prisma

```bash
npx prisma init --datasource-provider mongodb
```

This creates a Prisma schema file and an environment file.

### Set the database connection

In your Prisma schema:

```prisma
// prisma/schema.prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

In your environment file:

```env
DATABASE_URL="mongodb://127.0.0.1:27017/fluento?authSource=admin"
```

Use a real URI for your environment, for example:

```env
DATABASE_URL="mongodb://user:password@localhost:27017/fluento?authSource=admin"
```

## Prisma schema rules for MongoDB

MongoDB uses documents rather than tables, so the Prisma schema looks slightly different from SQL databases.

### Important model pattern

```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  posts     Post[]
}

model Post {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  title     String
  content   String?
  createdAt DateTime @default(now())
  authorId  String   @db.ObjectId
  author    User     @relation(fields: [authorId], references: [id])
}
```

### Key MongoDB notes

- The MongoDB primary key is the `_id` field.
- Prisma maps your app-level `id` field to MongoDB `_id` with `@map("_id")`.
- Use `String` plus `@db.ObjectId` for IDs.
- Use `@default(auto())` to generate ObjectIds automatically.
- For relations, keep a scalar foreign-key field such as `authorId` and add `@relation`.
- `@@id` and `autoincrement()` are not supported for MongoDB.

## Generate the client

```bash
npx prisma generate
```

## Sync the schema with MongoDB

For MongoDB, use `db push` instead of Prisma Migrate:

```bash
npx prisma db push
```

This is the recommended flow for MongoDB because Prisma Migrate is not supported in the same way as it is for relational databases.

## NestJS integration

### Create a Prisma service

```ts
// src/prisma/prisma.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### Register it in the module

```ts
// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
```

## Important gotchas

### Replica set is required

Prisma uses transactions for nested writes, and MongoDB requires a replica set for transactions. For local development, a single-node replica set is usually enough. On Atlas, this is already configured.

### Null vs missing fields

MongoDB distinguishes between a field set to `null` and a field that is not present at all. Prisma does not model that distinction perfectly, so be careful when filtering for `null` and missing values.

### Counting large collections

For large collections, `count()` can become slow. Prefer `estimatedDocumentCount()` if that fits your use case.

## Common commands

```bash
# Generate Prisma Client
npx prisma generate

# Push schema changes to MongoDB
npx prisma db push

# Open Prisma Studio
npx prisma studio
```

## Recommended checklist

1. Pin Prisma to `6.19.x`.
2. Set `provider = "mongodb"` in the datasource block.
3. Map your model ID to `_id` with `@map("_id")`.
4. Use `String @db.ObjectId` for ObjectId fields.
5. Use `prisma db push` instead of Prisma Migrate.
6. Make sure your MongoDB deployment has a replica set.
