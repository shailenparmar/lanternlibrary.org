import Anthropic from "@anthropic-ai/sdk";
import { stories } from "./stories";
import { tileBySlug } from "./tiles";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error(
        "ANTHROPIC_API_KEY not set — add it to .env.local to enable live tiles.",
      );
    }
    client = new Anthropic();
  }
  return client;
}

function buildCorpus(): string {
  return stories
    .map((s) => {
      const cond = tileBySlug(s.condition)?.label ?? s.condition;
      const themes = s.themes
        .map((t) => tileBySlug(t)?.label)
        .filter(Boolean)
        .join(", ");
      return [
        `<story slug="${s.slug}">`,
        `  <title>${s.title}</title>`,
        `  <dek>${s.dek}</dek>`,
        `  <contributor>${s.contributor}, age ${s.contributorAge}</contributor>`,
        `  <condition>${cond}</condition>`,
        `  <themes>${themes}</themes>`,
        `  <opening>${s.prose[0]}</opening>`,
        s.pullQuote ? `  <pull_quote>${s.pullQuote.text}</pull_quote>` : "",
        `</story>`,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}

const SEARCH_SYSTEM = `You are the search interface for Lantern Library — an independent archive of recovery stories. A reader has typed a query. Your job: return story matches + a few follow-up search suggestions that refine the query.

Respond ONLY by calling the surface_search_results tool. No text response.

story_slugs (0–5): pick stories that match the query emotionally and structurally, not just by keyword. Someone in eating-disorder recovery may match more strongly to a chronic-pain story if the identity-reconstruction work is similar. Quality over quantity — three excellent matches beat five mediocre ones. If the query is too short or too unspecific (< ~3 meaningful words), return fewer slugs or an empty list.

follow_ups (0–3): SHORT (3–8 words) noun-phrase search suggestions that refine or deepen the query. They appear as clickable chips; clicking one will replace the search bar text. Phrase them like search queries, not questions. Examples:
- For "BDD": "stories from someone newly diagnosed", "stories about telling family", "what fully-recovered looks like"
- For "I'm losing my hair": "early years", "after a major life event", "stories about acceptance"
- For a very specific query: empty array (no follow-ups needed)

Never invent slugs. Use only slugs from the <story slug="..."> tags below.

The collection:

${buildCorpus()}`;

const CONTRIBUTOR_SYSTEM = `You are silently watching someone share a recovery story — in writing — into Lantern Library. They are NOT in a conversation with you. They are reflecting on their own. Your role is to make the experience feel like they have been heard.

Respond ONLY by calling the surface_contributor_tiles tool. Do not turn-take, do not greet them, do not ask questions in your own voice, do not generate any text response. Their draft is in front of you. Read it and call the tool.

Return TWO things:

1. ONE invitation (0 or 1): a single, gentle, specific invitation to go deeper into something they have ALREADY brought up. Always tied to specific language they used. NEVER generic ("how did that feel?"). If they mentioned "a surgeon with kind eyes," an invitation might be "What did the kind-eyes surgeon say next?" If they mentioned a hospital, "What time of year was the hospital?" Phrase as a question. If the draft is too short or there is no clear thread to deepen, return an empty invitations array.

2. UP TO FOUR phrase tiles (0–4): VERY SHORT phrases drawn directly from THEIR text, in THEIR own language. 2–6 words each, ideally verbatim. Pick the most distinctive, emotionally specific lines — the kind a thoughtful reader would underline. Do NOT paraphrase. Do NOT summarize. Do NOT therapize. Do NOT make up phrases they did not write. Examples of the texture: "the comparison year," "hostage situation," "felt completely alone," "forty-five minutes to a mirror." Return four when there is enough material; fewer when there is not.

The recovery-story arc tends to cover: onset, the dark middle, what they tried, the turn, what changed, setbacks, where they are now, and the letter they'd write to their past self. Use these as INTERNAL signals for what is missing — never expose them as a checklist, never say "now tell me about X." If a section feels thin, the invitation can gently surface it, but only in language tied to what they have already said.

Better silence than empty tiles.`;

const SEARCH_TOOL: Anthropic.Tool = {
  name: "surface_search_results",
  description:
    "Return story matches and follow-up search suggestions for the reader's query. Always call this — never produce a text response.",
  input_schema: {
    type: "object",
    properties: {
      story_slugs: {
        type: "array",
        items: { type: "string" },
        description:
          "0–5 story slugs from the collection that match the query emotionally and structurally.",
        maxItems: 5,
      },
      follow_ups: {
        type: "array",
        items: { type: "string" },
        description:
          "0–3 short (3–8 word) refinement suggestions, as noun-phrase search queries.",
        maxItems: 3,
      },
    },
    required: ["story_slugs", "follow_ups"],
  },
};

const CONTRIBUTOR_TOOL: Anthropic.Tool = {
  name: "surface_contributor_tiles",
  description:
    "Return ONE invitation question and up to three short phrase tiles. Always call this — never produce a text response.",
  input_schema: {
    type: "object",
    properties: {
      invitations: {
        type: "array",
        items: { type: "string" },
        description:
          "0 or 1 gentle, specific invitation question, tied to language they actually used.",
        maxItems: 1,
      },
      phrases: {
        type: "array",
        items: { type: "string" },
        description:
          "0–4 very short phrases drawn from the contributor's text, near-verbatim, 2–6 words each.",
        maxItems: 4,
      },
    },
    required: ["invitations", "phrases"],
  },
};

export type SearchResults = {
  storySlugs: string[];
  followUps: string[];
};

export type ContributorTiles = {
  phrases: string[];
  invitations: string[];
};

export type RenderedLantern = {
  title: string;
  dek: string;
  prose: string[];
  pullQuote: { text: string; afterParagraph: number } | null;
};

export async function searchStories(query: string): Promise<SearchResults> {
  const response = await getClient().messages.create({
    model: "claude-opus-4-7",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: SEARCH_SYSTEM,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [SEARCH_TOOL],
    tool_choice: { type: "tool", name: "surface_search_results" },
    messages: [
      {
        role: "user",
        content: `<query>${query}</query>`,
      },
    ],
  });

  for (const block of response.content) {
    if (
      block.type === "tool_use" &&
      block.name === "surface_search_results"
    ) {
      const input = block.input as {
        story_slugs?: string[];
        follow_ups?: string[];
      };
      return {
        storySlugs: (input.story_slugs ?? []).slice(0, 5),
        followUps: (input.follow_ups ?? []).slice(0, 3),
      };
    }
  }
  return { storySlugs: [], followUps: [] };
}

const RENDER_SYSTEM = `You are the renderer for Lantern Library — an independent archive of recovery stories. A contributor has shared a raw reflection in their own voice, possibly disorganized. Produce a structured story object they will review before publishing.

Voice and form:
- Warm, restrained, literary. Closer to a ghostwritten magazine chapter than a cleaned-up transcript.
- PRESERVE the contributor's specific phrases and idioms. Do NOT homogenize into a platform voice. The Lantern Library voice is structural (paragraphing, flow, removing verbal tics like "um" or "you know") — NOT tonal.
- Keep emotionally specific lines, idiosyncratic metaphors, dialogue, and time markers verbatim or near-verbatim wherever they earn it. The piece may hand the mic back explicitly: "In her words: [quote]" — but only if it serves the rhythm; don't force it.
- Length: 600–1500 words. Aim for the upper end if the contributor wrote a lot; lower if they were terse. NEVER pad with material they didn't provide.
- 4 to 8 paragraphs.

Structure:
- The recovery-story arc tends to cover: onset, the dark middle, search for help, the turn, what changed, setbacks, where they are now, and (often) a letter to past self. Use these as INTERNAL guidance only. Do NOT use them as visible section headers, and do NOT invent material to fill missing beats. If the contributor only wrote about onset and setbacks, render only what's there.
- Title (6–12 words): evocative, not clinical. Often a sentence in the contributor's own voice. Examples of the texture: "I was certain my face was the problem.", "The ringing did not get quieter. I did.", "I pulled in private for fifteen years.", "What my hands needed and what I needed were not the same thing."
- Dek (15–25 words): one sentence orienting subtitle. Specific.
- Pull quote: pick one sentence from the contributor's own words distinctive enough to earn pull-quote treatment. Specify which paragraph index it should appear AFTER (0-indexed). If nothing earns it, return null.

Hard rules:
- Output ONLY via the render_lantern tool. No text response.
- Do NOT invent details the contributor did not provide.
- Do NOT therapize, psychoanalyze, or hand out advice the contributor didn't include.
- Do NOT use second-person ("you should…"). Keep the contributor's first-person.
- Do NOT add platitudes, wrap-up clichés, or "and that's how I learned…" endings.`;

const RENDER_TOOL: Anthropic.Tool = {
  name: "render_lantern",
  description:
    "Return the structured rendered story (title, dek, prose paragraphs, optional pull quote). Always call this — never produce a text response.",
  input_schema: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description:
          "6–12 word title, often a sentence in the contributor's voice.",
      },
      dek: {
        type: "string",
        description: "One-sentence orienting subtitle, 15–25 words.",
      },
      prose: {
        type: "array",
        items: { type: "string" },
        description:
          "4–8 paragraphs. Each paragraph is a string with no surrounding quotes.",
        minItems: 3,
        maxItems: 10,
      },
      pull_quote: {
        type: "object",
        nullable: true,
        properties: {
          text: {
            type: "string",
            description:
              "One sentence drawn from the contributor's own words.",
          },
          after_paragraph: {
            type: "integer",
            description: "0-indexed paragraph index after which to display.",
          },
        },
        required: ["text", "after_paragraph"],
      },
    },
    required: ["title", "dek", "prose"],
  },
};

export async function renderLantern(draft: string): Promise<RenderedLantern> {
  const response = await getClient().messages.create({
    model: "claude-opus-4-7",
    max_tokens: 4096,
    system: [
      {
        type: "text",
        text: RENDER_SYSTEM,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [RENDER_TOOL],
    tool_choice: { type: "tool", name: "render_lantern" },
    messages: [
      {
        role: "user",
        content: `<draft>\n${draft}\n</draft>`,
      },
    ],
  });

  for (const block of response.content) {
    if (block.type === "tool_use" && block.name === "render_lantern") {
      const input = block.input as {
        title?: string;
        dek?: string;
        prose?: string[];
        pull_quote?: { text: string; after_paragraph: number } | null;
      };
      const pq = input.pull_quote;
      return {
        title: input.title ?? "",
        dek: input.dek ?? "",
        prose: (input.prose ?? []).filter((p) => p.trim().length > 0),
        pullQuote:
          pq && typeof pq.text === "string"
            ? { text: pq.text, afterParagraph: pq.after_paragraph ?? 0 }
            : null,
      };
    }
  }
  throw new Error("Renderer did not return a structured response.");
}

export async function liveContributorTiles(
  draft: string,
): Promise<ContributorTiles> {
  const response = await getClient().messages.create({
    model: "claude-opus-4-7",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: CONTRIBUTOR_SYSTEM,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [CONTRIBUTOR_TOOL],
    tool_choice: { type: "tool", name: "surface_contributor_tiles" },
    messages: [
      {
        role: "user",
        content: `<draft>\n${draft}\n</draft>`,
      },
    ],
  });

  for (const block of response.content) {
    if (
      block.type === "tool_use" &&
      block.name === "surface_contributor_tiles"
    ) {
      const input = block.input as {
        phrases?: string[];
        invitations?: string[];
      };
      return {
        phrases: (input.phrases ?? []).slice(0, 4),
        invitations: (input.invitations ?? []).slice(0, 1),
      };
    }
  }
  return { phrases: [], invitations: [] };
}
