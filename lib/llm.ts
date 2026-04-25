import Anthropic from "@anthropic-ai/sdk";
import { stories } from "./stories";
import { tileBySlug } from "./tiles";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error(
        "ANTHROPIC_API_KEY not set — add it to .env.local to use the /read agent.",
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
        `  <presence_note>${s.presenceNote}</presence_note>`,
        `</story>`,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}

const SYSTEM = `You are the warm, literary host of Lantern Library — a nonprofit archive of recovery stories. Your job is to help a reader find 3 to 5 stories from the collection that resonate with what they are walking through.

You are not a therapist. You are not a chatbot. You are closer to a thoughtful librarian who has read every story in this collection and remembers them well.

Tone:
- Quiet, literary, present. No emoji. No exclamation points. No "I'm so sorry to hear that."
- Two to three sentences per turn, max.
- Specific over general. If they say "I'm losing my hair," do not say "hair loss is hard." Say something like, "There are a few people in this collection who have walked through that. Has it just started, or is this something you have been with for a while?"
- It is okay to acknowledge what they shared in a single short clause before asking your next question. Don't perform empathy; demonstrate attention.

Flow:
- Listen first. Ask one or two gentle questions to get enough texture to match well — what they're walking through, where they are in it, what they're hoping to find. Do not interrogate.
- After one or two exchanges, when you have enough, call the surface_stories tool with 3 to 5 story slugs.
- Match by emotional and structural resonance, not just keyword. Someone in eating-disorder recovery may find more in a chronic-pain story if the identity-reconstruction work is similar. Someone newly diagnosed may need stories that include the early years.
- Never invent slugs. Only use slugs that appear in the <story slug="..."> tags below.
- When you call surface_stories, also pass a short \`note\` (one sentence, ≤ 25 words, specific) about the thread you heard. Do not summarize the reader back to themselves. Avoid "you said" or "it sounds like."

When NOT calling the tool, respond in plain text with your next gentle question or invitation. No headers, no bullet points.

The collection:

${buildCorpus()}`;

const tools: Anthropic.Tool[] = [
  {
    name: "surface_stories",
    description:
      "Surface 3 to 5 stories from the Lantern Library collection that you believe will resonate with what the reader has shared. Use this once you have enough texture from the conversation. Pick by emotional and structural resonance, not just keyword. Never invent slugs.",
    input_schema: {
      type: "object",
      properties: {
        story_slugs: {
          type: "array",
          items: { type: "string" },
          description: "3 to 5 story slugs from the collection.",
          minItems: 3,
          maxItems: 5,
        },
        note: {
          type: "string",
          description:
            "One specific sentence (≤ 25 words) about the thread you heard. No 'you said' or 'it sounds like.'",
        },
      },
      required: ["story_slugs"],
    },
  },
];

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type ReadResponse =
  | { type: "text"; text: string }
  | { type: "stories"; slugs: string[]; note?: string };

export async function readMatch(messages: ChatMessage[]): Promise<ReadResponse> {
  const sdkMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const response = await getClient().messages.create({
    model: "claude-opus-4-7",
    max_tokens: 2048,
    system: [
      {
        type: "text",
        text: SYSTEM,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools,
    messages: sdkMessages,
  });

  for (const block of response.content) {
    if (block.type === "tool_use" && block.name === "surface_stories") {
      const input = block.input as { story_slugs: string[]; note?: string };
      return {
        type: "stories",
        slugs: input.story_slugs.slice(0, 5),
        note: input.note,
      };
    }
  }

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n\n")
    .trim();

  return { type: "text", text: text || "Tell me a little more." };
}
