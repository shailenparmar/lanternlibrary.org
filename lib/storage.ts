import {
  stories as inMemoryStories,
  storiesByTile as inMemoryStoriesByTile,
  storyBySlug as inMemoryStoryBySlug,
  relatedStories as inMemoryRelatedStories,
  type Story,
} from "./stories";
import { tiles as inMemoryTiles, tileBySlug, type Tile } from "./tiles";

// Storage is in-memory for now. The hardcoded `lib/stories.ts` corpus is the
// source of truth. If/when we move to a real DB, swap these implementations
// to talk to it (a serverless-friendly driver like Neon over HTTP works on
// Cloudflare Workers; node-postgres does not).

export async function getAllStories(): Promise<Story[]> {
  return inMemoryStories;
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  return inMemoryStoryBySlug(slug) ?? null;
}

export async function getStoriesByTile(tileSlug: string): Promise<Story[]> {
  return inMemoryStoriesByTile(tileSlug);
}

export async function getTileStoryCount(tileSlug: string): Promise<number> {
  return (await getStoriesByTile(tileSlug)).length;
}

export async function getRelatedStories(
  slug: string,
  count = 3,
): Promise<Story[]> {
  return inMemoryRelatedStories(slug, count);
}

export async function getAllTiles(): Promise<Tile[]> {
  return inMemoryTiles;
}

export { tileBySlug };
