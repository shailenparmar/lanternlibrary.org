import { NextResponse } from "next/server";
import { stories } from "@/lib/stories";
import { tileBySlug } from "@/lib/tiles";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slugsParam = url.searchParams.get("slugs") ?? "";
  const slugs = slugsParam.split(",").map((s) => s.trim()).filter(Boolean);
  if (slugs.length === 0) {
    return NextResponse.json({ stories: [] });
  }
  const result = slugs
    .map((slug) => stories.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({
      slug: s.slug,
      title: s.title,
      contributor: s.contributor,
      contributorAge: s.contributorAge,
      conditionLabel: tileBySlug(s.condition)?.label ?? s.condition,
      dek: s.dek,
    }));
  return NextResponse.json({ stories: result });
}
