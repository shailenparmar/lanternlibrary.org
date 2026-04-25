import { stories } from "../lib/stories";
import { tiles } from "../lib/tiles";
import { getDb, schema } from "../lib/db";
import { sql } from "drizzle-orm";

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error(
      "DATABASE_URL not set. Start docker-compose (`docker compose up -d db`) and put DATABASE_URL into .env.local first.",
    );
    process.exit(1);
  }

  const db = getDb();

  console.log("Ensuring pgvector extension…");
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS vector`);

  console.log(`Upserting ${tiles.length} tiles…`);
  for (const t of tiles) {
    await db
      .insert(schema.tilesTable)
      .values(t)
      .onConflictDoUpdate({
        target: schema.tilesTable.slug,
        set: {
          label: t.label,
          kind: t.kind,
          description: t.description,
        },
      });
  }

  console.log(`Upserting ${stories.length} stories…`);
  for (const s of stories) {
    await db
      .insert(schema.storiesTable)
      .values({
        slug: s.slug,
        title: s.title,
        dek: s.dek,
        contributor: s.contributor,
        contributorAge: s.contributorAge,
        condition: s.condition,
        themes: s.themes,
        publishedAt: new Date(s.publishedAt),
        presenceNote: s.presenceNote,
        prose: s.prose,
        pullQuote: s.pullQuote ?? null,
        updates: s.updates ?? null,
        lanterns: s.lanterns,
        isSample: s.isSample,
      })
      .onConflictDoUpdate({
        target: schema.storiesTable.slug,
        set: {
          title: s.title,
          dek: s.dek,
          contributor: s.contributor,
          contributorAge: s.contributorAge,
          condition: s.condition,
          themes: s.themes,
          publishedAt: new Date(s.publishedAt),
          presenceNote: s.presenceNote,
          prose: s.prose,
          pullQuote: s.pullQuote ?? null,
          updates: s.updates ?? null,
          lanterns: s.lanterns,
          isSample: s.isSample,
        },
      });
  }

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
