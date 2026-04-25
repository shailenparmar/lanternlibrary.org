export type TileKind = "condition" | "theme";

export type Tile = {
  slug: string;
  label: string;
  kind: TileKind;
  description?: string;
};

export const tiles: Tile[] = [
  {
    slug: "bdd",
    label: "Body dysmorphic disorder",
    kind: "condition",
    description:
      "A preoccupation with perceived flaws in appearance that consumes hours of the day and runs the life of the person carrying it.",
  },
  {
    slug: "ocd",
    label: "OCD",
    kind: "condition",
    description:
      "Obsessions, compulsions, and the long path back to a life that is not organized around them.",
  },
  {
    slug: "trichotillomania",
    label: "Trichotillomania",
    kind: "condition",
    description: "Hair pulling — the loneliness of it, the recovery of it.",
  },
  {
    slug: "eating-disorders",
    label: "Eating disorders",
    kind: "condition",
    description:
      "Anorexia, bulimia, binge eating, ARFID. Stories from the other side of the worst years.",
  },
  {
    slug: "hair-loss",
    label: "Hair loss",
    kind: "condition",
    description:
      "Alopecia, male and female pattern loss, telogen effluvium. The work of a self-worth not tied to a thing you cannot fully control.",
  },
  {
    slug: "chronic-pain",
    label: "Chronic pain",
    kind: "condition",
    description:
      "Back, knee, joint, nerve. The slow rebuilding of a life around a body that does not fully cooperate.",
  },
  {
    slug: "paralysis",
    label: "Paralysis and limb difference",
    kind: "condition",
    description:
      "Identity reconstruction around a body that has fundamentally changed.",
  },
  {
    slug: "tinnitus",
    label: "Tinnitus",
    kind: "condition",
    description: "Habituation, acceptance, the slow quieting of the noise.",
  },
  {
    slug: "loneliness",
    label: "Loneliness",
    kind: "theme",
    description:
      "Stories where the loneliness was the thing — sometimes more than the diagnosis.",
  },
  {
    slug: "acceptance",
    label: "Acceptance",
    kind: "theme",
    description:
      "Stories about stopping the fight, and what came after.",
  },
  {
    slug: "fully-recovered",
    label: "Fully recovered",
    kind: "theme",
    description:
      "Stories where the symptoms are essentially gone — and what that has meant.",
  },
  {
    slug: "identity",
    label: "Identity reconstruction",
    kind: "theme",
    description:
      "Becoming someone whose life is no longer organized around the condition.",
  },
  {
    slug: "family",
    label: "Family",
    kind: "theme",
    description:
      "Parents, siblings, partners — the recoveries that happened inside relationships.",
  },
  {
    slug: "faith",
    label: "Faith and recovery",
    kind: "theme",
    description:
      "Stories where a religious or spiritual practice held weight in the recovery.",
  },
];

export const tileBySlug = (slug: string): Tile | undefined =>
  tiles.find((t) => t.slug === slug);
