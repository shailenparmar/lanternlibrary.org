import { eq } from "drizzle-orm";
import { dbAvailable, getDb, schema } from "./db";
import {
  stories as inMemoryStories,
  storiesByTile as inMemoryStoriesByTile,
  storyBySlug as inMemoryStoryBySlug,
  relatedStories as inMemoryRelatedStories,
  type Story,
} from "./stories";
import { tiles as inMemoryTiles, tileBySlug, type Tile } from "./tiles";

const isoOrString = (v: Date | string): string =>
  v instanceof Date ? v.toISOString() : v;

const rowToStory = (row: typeof schema.storiesTable.$inferSelect): Story => ({
  slug: row.slug,
  title: row.title,
  dek: row.dek,
  contributor: row.contributor,
  contributorAge: row.contributorAge,
  condition: row.condition,
  themes: row.themes,
  publishedAt: isoOrString(row.publishedAt),
  presenceNote: row.presenceNote,
  prose: row.prose,
  pullQuote: row.pullQuote ?? undefined,
  updates: row.updates ?? undefined,
  lanterns: row.lanterns,
  isSample: row.isSample as true,
});

let dbDisabled = false;

async function tryDb<T>(fn: () => Promise<T>): Promise<T | null> {
  if (!dbAvailable() || dbDisabled) return null;
  try {
    return await fn();
  } catch (err) {
    console.warn(
      "[storage] DB query failed; falling back to in-memory data for the rest of this process. Reason:",
      err instanceof Error ? err.message : err,
    );
    dbDisabled = true;
    return null;
  }
}

export async function getAllStories(): Promise<Story[]> {
  const fromDb = await tryDb(async () =>
    (await getDb().select().from(schema.storiesTable)).map(rowToStory),
  );
  return fromDb ?? inMemoryStories;
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  const fromDb = await tryDb(async () => {
    const rows = await getDb()
      .select()
      .from(schema.storiesTable)
      .where(eq(schema.storiesTable.slug, slug))
      .limit(1);
    return rows[0] ? rowToStory(rows[0]) : null;
  });
  if (fromDb !== null) return fromDb;
  return inMemoryStoryBySlug(slug) ?? null;
}

export async function getStoriesByTile(tileSlug: string): Promise<Story[]> {
  const fromDb = await tryDb(async () => {
    const rows = await getDb().select().from(schema.storiesTable);
    return rows
      .map(rowToStory)
      .filter(
        (s) => s.condition === tileSlug || s.themes.includes(tileSlug),
      );
  });
  return fromDb ?? inMemoryStoriesByTile(tileSlug);
}

export async function getTileStoryCount(tileSlug: string): Promise<number> {
  return (await getStoriesByTile(tileSlug)).length;
}

export async function getRelatedStories(
  slug: string,
  count = 3,
): Promise<Story[]> {
  if (!dbAvailable() || dbDisabled) return inMemoryRelatedStories(slug, count);
  const all = await getAllStories();
  const story = all.find((s) => s.slug === slug);
  if (!story) return [];
  const overlap = (other: Story): number => {
    if (other.slug === slug) return -1;
    let score = 0;
    if (other.condition === story.condition) score += 3;
    for (const t of other.themes) if (story.themes.includes(t)) score += 1;
    return score;
  };
  return all
    .map((s) => ({ s, score: overlap(s) }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ s }) => s);
}

export async function getAllTiles(): Promise<Tile[]> {
  const fromDb = await tryDb(async () =>
    (await getDb().select().from(schema.tilesTable)).map((r) => ({
      slug: r.slug,
      label: r.label,
      kind: r.kind as "condition" | "theme",
      description: r.description ?? undefined,
    })),
  );
  return fromDb ?? inMemoryTiles;
}

export { tileBySlug };
