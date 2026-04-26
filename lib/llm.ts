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

const READER_SYSTEM = `You are watching a reader type their situation into Lantern Library — a nonprofit archive of recovery stories.

Your job: respond ONLY by calling the surface_reader_tiles tool. Do not turn-take, do not greet them, do not ask questions in your own voice, do not generate any text response. There is no conversation here. Their draft text is in front of you. Read it and call the tool.

Two kinds of tiles:

1. Phrase tiles (0–4): SHORT phrases drawn directly from THEIR text, in THEIR own language. Echo the most emotionally specific or distinctive lines they wrote — the kind of line a thoughtful reader would underline. 4–12 words each, ideally verbatim or near-verbatim. Do NOT paraphrase. Do NOT summarize. Do NOT therapize. Do NOT write phrases the user did not actually write. If their draft is generic or short, return fewer phrase tiles or none.

2. Story slugs (0–5): pick stories from the collection that resonate emotionally and structurally, not by keyword. Someone in eating-disorder recovery may match more strongly to a chronic-pain story if the identity-reconstruction work is similar. Quality over quantity — three excellent matches beat five mediocre ones. If the draft is too short or too unspecific (< ~10 meaningful words), return fewer slugs or an empty list.

Never invent slugs. Use only slugs from the <story slug="..."> tags below.

The collection:

${buildCorpus()}`;

const CONTRIBUTOR_SYSTEM = `You are silently watching someone share a recovery story — in writing — into Lantern Library. They are NOT in a conversation with you. They are reflecting on their own. Your role is to make the experience feel like they have been heard.

Respond ONLY by calling the surface_contributor_tiles tool. Do not turn-take, do not greet them, do not ask questions in your own voice, do not generate any text response. Their draft is in front of you. Read it and call the tool.

Two kinds of tiles:

1. Phrase tiles (0–4): SHORT phrases drawn directly from THEIR text, in THEIR own language. Echo the most emotionally specific or distinctive lines they wrote — the lines a future reader would underline. 4–12 words each, ideally verbatim or near-verbatim. Do NOT paraphrase. Do NOT summarize. Do NOT therapize. Do NOT make up phrases they did not write. The brief calls for the texture of "felt completely and hopelessly alone" — that level of specificity, in their words.

2. Invitation tiles (0–3): gentle, specific invitations to go deeper into something they have ALREADY brought up. Always tied to specific language they used. NEVER generic ("how did that feel?"). If they mentioned "a surgeon with kind eyes," an invitation might be "what did the kind-eyes surgeon say next?" If they mentioned a hospital, "what time of year was the hospital?" If they mentioned a person, "what would she say if she knew?"

The recovery-story arc tends to cover: onset, the dark middle, what they tried, the turn, what changed, setbacks, where they are now, and the letter they'd write to their past self. Use these as INTERNAL signals for what's missing — never expose them as a checklist. Never say "now tell me about X." If a section feels thin, an invitation can gently surface it, but only in language tied to what they have already said.

If the draft is short or unspecific, return fewer tiles. Better silence than empty tiles.`;

const READER_TOOL: Anthropic.Tool = {
  name: "surface_reader_tiles",
  description:
    "Return phrase tiles (their own language echoed back) and story slugs that resonate. Always call this — never produce a text response.",
  input_schema: {
    type: "object",
    properties: {
      phrases: {
        type: "array",
        items: { type: "string" },
        description:
          "0–4 short phrases drawn from the reader's text, near-verbatim, 4–12 words each.",
        maxItems: 4,
      },
      story_slugs: {
        type: "array",
        items: { type: "string" },
        description:
          "0–5 story slugs from the collection that resonate emotionally and structurally.",
        maxItems: 5,
      },
    },
    required: ["phrases", "story_slugs"],
  },
};

const CONTRIBUTOR_TOOL: Anthropic.Tool = {
  name: "surface_contributor_tiles",
  description:
    "Return phrase tiles (their own language echoed back) and gentle invitations to go deeper. Always call this — never produce a text response.",
  input_schema: {
    type: "object",
    properties: {
      phrases: {
        type: "array",
        items: { type: "string" },
        description:
          "0–4 short phrases drawn from the contributor's text, near-verbatim, 4–12 words each.",
        maxItems: 4,
      },
      invitations: {
        type: "array",
        items: { type: "string" },
        description:
          "0–3 gentle, specific invitations to go deeper. Always tied to language they actually used.",
        maxItems: 3,
      },
    },
    required: ["phrases", "invitations"],
  },
};

export type ReaderTiles = {
  phrases: string[];
  storySlugs: string[];
};

export type ContributorTiles = {
  phrases: string[];
  invitations: string[];
};

export async function liveReaderTiles(draft: string): Promise<ReaderTiles> {
  const response = await getClient().messages.create({
    model: "claude-opus-4-7",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: READER_SYSTEM,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [READER_TOOL],
    tool_choice: { type: "tool", name: "surface_reader_tiles" },
    messages: [
      {
        role: "user",
        content: `<draft>\n${draft}\n</draft>`,
      },
    ],
  });

  for (const block of response.content) {
    if (block.type === "tool_use" && block.name === "surface_reader_tiles") {
      const input = block.input as {
        phrases?: string[];
        story_slugs?: string[];
      };
      return {
        phrases: (input.phrases ?? []).slice(0, 4),
        storySlugs: (input.story_slugs ?? []).slice(0, 5),
      };
    }
  }
  return { phrases: [], storySlugs: [] };
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
        invitations: (input.invitations ?? []).slice(0, 3),
      };
    }
  }
  return { phrases: [], invitations: [] };
}
