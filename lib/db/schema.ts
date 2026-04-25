import {
  boolean,
  customType,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Dimensions chosen to fit common embedding providers (Voyage / Cohere = 1024,
// OpenAI text-embedding-3-small = 1536). Adjust to match your provider when
// you wire up embeddings. Changing this requires a migration.
export const VECTOR_DIMENSIONS = 1024;

const vector = customType<{
  data: number[];
  driverData: string;
  config: { dimensions: number };
}>({
  dataType(config) {
    return `vector(${config?.dimensions ?? VECTOR_DIMENSIONS})`;
  },
  fromDriver(value: string): number[] {
    return value
      .replace(/^\[|\]$/g, "")
      .split(",")
      .map(Number);
  },
  toDriver(value: number[]): string {
    return `[${value.join(",")}]`;
  },
});

export const tilesTable = pgTable("tiles", {
  slug: text("slug").primaryKey(),
  label: text("label").notNull(),
  kind: text("kind").notNull(),
  description: text("description"),
});

export const storiesTable = pgTable("stories", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  dek: text("dek").notNull(),
  contributor: text("contributor").notNull(),
  contributorAge: integer("contributor_age").notNull(),
  condition: text("condition")
    .notNull()
    .references(() => tilesTable.slug),
  themes: jsonb("themes").$type<string[]>().notNull().default([]),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
  presenceNote: text("presence_note").notNull(),
  prose: jsonb("prose").$type<string[]>().notNull().default([]),
  pullQuote: jsonb("pull_quote").$type<{
    text: string;
    afterParagraph: number;
  } | null>(),
  updates: jsonb("updates").$type<{ date: string; body: string }[] | null>(),
  lanterns: integer("lanterns").notNull().default(0),
  isSample: boolean("is_sample").notNull().default(false),
  // Populated by a separate embed step once you choose an embedding provider.
  embedding: vector("embedding", { dimensions: VECTOR_DIMENSIONS }),
});

export type StoryRow = typeof storiesTable.$inferSelect;
export type StoryInsert = typeof storiesTable.$inferInsert;
export type TileRow = typeof tilesTable.$inferSelect;
