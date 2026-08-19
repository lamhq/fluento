# Plan: Migrate `comm` module repositories from Prisma to Mongoose

## Scope

Migrate the following classes from Prisma to Mongoose (`@nestjs/mongoose`), which is
already used by the `mongo-demo` module and already wired up globally in
`AppModule` via `MongooseModule.forRootAsync`:

- `apps/api/src/comm/infrastructure/exercise.repository.ts`
- `apps/api/src/comm/infrastructure/learner-exercise.repository.ts`

No changes to `core` (entities, ports, service) or `interface` (controllers/DTOs) are
required — the repository contracts (`ExerciseRepositoryPort`,
`LearnerExerciseRepositoryPort`) stay the same, so this is purely an infrastructure swap.

## Current state

- `ExerciseRepository` uses `PrismaService` (`this.prisma.exercise.*`) for CRUD.
- `LearnerExerciseRepository` uses `this.prisma.exercise.aggregateRaw({ pipeline })`
  to run a `$lookup` against `learner_exercise_practices`, and parses raw EJSON
  (`{ $oid }`, `{ $date }`) results via `apps/api/src/common/types/mongo.ts`.
- `CommModule` is currently **commented out** in `apps/api/src/app.module.ts`.
- Prisma schema (`apps/api/prisma/schema.prisma`) defines collections:
  - `exercises` (model `Exercise`)
  - `learner_exercise_practices` (model `LearnerExercisePractice`)

## Step 1 — Add Mongoose schemas

Create a `schemas` folder under `apps/api/src/comm/infrastructure/schemas/`
(mirroring `mongo-demo/schemas`):

**`exercise.schema.ts`**

```ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExerciseDocument = HydratedDocument<Exercise>;

@Schema()
export class ExpectedResponse {
  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  style: string[];
}
export const ExpectedResponseSchema = SchemaFactory.createForClass(ExpectedResponse);

@Schema({ timestamps: true, collection: 'exercises' })
export class Exercise {
  @Prop({ type: [String], default: [] })
  topics: string[];

  @Prop({ required: true })
  scenario: string;

  @Prop({ required: true })
  learnerRole: string;

  @Prop({ required: true })
  counterpartRole: string;

  @Prop({ type: [String], default: [] })
  prompts: string[];

  @Prop({ type: [ExpectedResponseSchema], default: [] })
  expectedResponses: ExpectedResponse[];

  createdAt?: Date;
  updatedAt?: Date;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
```

**`learner-exercise-practice.schema.ts`**

```ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LearnerExercisePracticeDocument =
  HydratedDocument<LearnerExercisePractice>;

@Schema({ timestamps: true, collection: 'learner_exercise_practices' })
export class LearnerExercisePractice {
  @Prop({ required: true })
  learnerId: string;

  @Prop({ type: Types.ObjectId, ref: 'Exercise', required: true })
  exerciseId: Types.ObjectId;

  @Prop({ default: 0 })
  practiceCount: number;

  @Prop({ type: Date, default: null })
  lastPracticeAt: Date | null;
}

export const LearnerExercisePracticeSchema = SchemaFactory.createForClass(
  LearnerExercisePractice,
);
LearnerExercisePracticeSchema.index(
  { learnerId: 1, exerciseId: 1 },
  { unique: true },
);
```

## Step 2 — Wire up `CommModule`

In `apps/api/src/comm/comm.module.ts`, register the schemas via
`MongooseModule.forFeature` and remove any leftover Prisma provider references:

```ts
imports: [
  MongooseModule.forFeature([
    { name: Exercise.name, schema: ExerciseSchema },
    { name: LearnerExercisePractice.name, schema: LearnerExercisePracticeSchema },
  ]),
],
```

Uncomment `CommModule` in `apps/api/src/app.module.ts` (currently commented out)
so the routes become reachable.

## Step 3 — Rewrite `ExerciseRepository`

Replace `PrismaService` with `@InjectModel(Exercise.name) private readonly exerciseModel: Model<Exercise>`.

- `create`: `this.exerciseModel.create(data)`
- `findAll`: `this.exerciseModel.find().exec()`
- `findById`: validate with `Types.ObjectId.isValid(id)` first (return `null` if
  invalid, since Mongoose throws `CastError` on a malformed id instead of
  returning `null` like Prisma does), then `this.exerciseModel.findById(id).exec()`
- `update`: `this.exerciseModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec()`;
  throw `NotFoundException` if `null`, to preserve the previous Prisma behavior
  of throwing when the record doesn't exist (`P2025`).
- `delete`: `this.exerciseModel.findByIdAndDelete(id).exec()`; same not-found handling as `update`.
- `dbModelToEntity`: map Mongoose document (`doc.toObject()` or the lean/hydrated
  result) to `ExerciseEntity`, converting `_id` (an `ObjectId`) to a string via
  `.toString()`. `createdAt`/`updatedAt` are already native `Date` from
  `{ timestamps: true }`, no EJSON unwrapping needed.

## Step 4 — Rewrite `LearnerExerciseRepository`

Replace `this.prisma.exercise.aggregateRaw({ pipeline })` with
`this.exerciseModel.aggregate(pipeline).exec()` using the injected `Exercise` model.

- The `$lookup`/`$addFields`/`$sort`/`$skip`/`$limit` pipeline stages stay
  conceptually identical; only the `$match` on `exerciseId`/`learnerId` and the
  `from: 'learner_exercise_practices'` collection name stay the same string
  literal (Mongoose doesn't resolve collection names from schema refs inside
  raw aggregation stages).
- Because Mongoose's `aggregate()` returns plain JS objects with real `ObjectId`
  and `Date` values (not EJSON-wrapped `{ $oid }` / `{ $date }` like Prisma's
  `aggregateRaw`), simplify `RawLearnerExercise` and `dbModelToEntity`:
  - `_id: Types.ObjectId` → `item._id.toString()`
  - `createdAt`/`updatedAt`/`lastPracticeAt: Date | null` → pass through directly,
    no `new Date(x.$date)` unwrapping.
- Remove the `InputJsonValue` import (Prisma-specific) — type the pipeline as
  `PipelineStage[]` from `mongoose`.
- Remove the now-unused `DateEJSON`/`ObjectIdEJSON` import from
  `apps/api/src/common/types/mongo.ts` (after confirming — see below — that
  nothing else in the codebase uses them; a repo-wide grep as of this plan shows
  only this file references them, so this type file can be deleted afterward,
  or left for future raw-EJSON use if preferred).

## Step 5 — Cleanup

- Remove `PrismaService` import/injection from both repositories.
- Confirm no other file in `apps/api` still needs `PrismaService`/Prisma for the
  `Exercise` / `LearnerExercisePractice` models before considering removing them
  from `schema.prisma` (out of scope for this migration unless requested).
- Run `pn -F api lint` and `pn -F api exec tsc --noEmit -p tsconfig.json` after the change.

## Step 6 — Verify

- Start the API: `pn -F api dev` (listens on port `5600`, no global route prefix).
- Seed test data (see MongoDB script below).
- Exercise all endpoints with the curl commands below.

---

## Testing: curl commands

Assumes API is running locally on `http://localhost:5600` and MongoDB is seeded
with the script below (exercise id `65f000000000000000000001`, learner id `lear_1`).

### find-exercises — `GET /exercises`

```bash
curl -i http://localhost:5600/exercises
```

### get-exercise — `GET /exercises/:id`

```bash
curl -i http://localhost:5600/exercises/65f000000000000000000001
```

### create-exercise — `POST /exercises`

```bash
curl -i -X POST http://localhost:5600/exercises \
  -H "Content-Type: application/json" \
  -d '{
    "topics": ["ordering-food"],
    "scenario": "Ordering coffee at a cafe",
    "learnerRole": "customer",
    "counterpartRole": "barista",
    "prompts": ["Good morning! What can I get for you?"],
    "expectedResponses": [
      { "content": "Can I get a medium latte, please?", "style": ["polite"] }
    ]
  }'
```

### update-exercise — `PATCH /exercises/:id`

```bash
curl -i -X PATCH http://localhost:5600/exercises/65f000000000000000000001 \
  -H "Content-Type: application/json" \
  -d '{ "scenario": "Ordering coffee at a busy cafe" }'
```

### delete-exercise — `DELETE /exercises/:id`

```bash
curl -i -X DELETE http://localhost:5600/exercises/65f000000000000000000001
```

### find-practice-exercises — `GET /learners/practice-exercises`

```bash
curl -i "http://localhost:5600/learners/practice-exercises?sort=lastPracticeAt&dir=asc&limit=10&offset=0" \
  -H "x-user-id: lear_1" \
  -H "x-email: learner1@example.com"
```

Optional query params to also test: `sort=createdAt`, `dir=desc`,
`topics=ordering-food,small-talk`.

---

## MongoDB seed script (mongosh)

Run with `mongosh <connection-string> seed.js` or paste into a `mongosh` shell
connected to the database used by `DATABASE_URL`.

```js
// seed.js
const exercisesCol = db.getCollection('exercises');
const practicesCol = db.getCollection('learner_exercise_practices');

const exerciseId1 = ObjectId('65f000000000000000000001');
const exerciseId2 = ObjectId('65f000000000000000000002');
const now = new Date();

exercisesCol.deleteMany({ _id: { $in: [exerciseId1, exerciseId2] } });
practicesCol.deleteMany({ exerciseId: { $in: [exerciseId1, exerciseId2] } });

exercisesCol.insertMany([
  {
    _id: exerciseId1,
    topics: ['ordering-food'],
    scenario: 'Ordering coffee at a cafe',
    learnerRole: 'customer',
    counterpartRole: 'barista',
    prompts: ['Good morning! What can I get for you?'],
    expectedResponses: [
      { content: 'Can I get a medium latte, please?', style: ['polite'] },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: exerciseId2,
    topics: ['small-talk'],
    scenario: 'Making small talk with a coworker',
    learnerRole: 'employee',
    counterpartRole: 'coworker',
    prompts: ['How was your weekend?'],
    expectedResponses: [
      { content: 'It was great, thanks! I went hiking.', style: ['casual'] },
    ],
    createdAt: now,
    updatedAt: now,
  },
]);

practicesCol.insertMany([
  {
    learnerId: 'lear_1',
    exerciseId: exerciseId1,
    practiceCount: 3,
    lastPracticeAt: new Date('2026-08-10T09:00:00Z'),
    createdAt: now,
    updatedAt: now,
  },
  {
    learnerId: 'lear_1',
    exerciseId: exerciseId2,
    practiceCount: 0,
    lastPracticeAt: null,
    createdAt: now,
    updatedAt: now,
  },
]);

print('Seed complete');
```

## Documentation referenced

- `README.md` (repository guide — running the API, pnpm command conventions)
- `apps/api/README.md` (API application structure)
- `docs/documentation-structure.md`
