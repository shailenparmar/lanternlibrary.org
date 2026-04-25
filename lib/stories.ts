import { Tile, tileBySlug, tiles } from "./tiles";

export type Story = {
  slug: string;
  title: string;
  dek: string;
  contributor: string;
  contributorAge: number;
  condition: string;
  themes: string[];
  publishedAt: string;
  presenceNote: string;
  prose: string[];
  pullQuote?: { text: string; afterParagraph: number };
  updates?: { date: string; body: string }[];
  lanterns: number;
  isSample: true;
};

export const stories: Story[] = [
  {
    slug: "mara-k-bdd",
    title: "I was certain my face was the problem.",
    dek: "Twelve years inside the mirror, and the slow work of not living there anymore.",
    contributor: "Mara K.",
    contributorAge: 28,
    condition: "bdd",
    themes: ["fully-recovered", "identity", "loneliness"],
    publishedAt: "2026-03-12",
    presenceNote: "Mara shared this in March 2026. She is doing well.",
    lanterns: 84,
    isSample: true,
    prose: [
      "It started in the eighth grade with a single comment from a boy in my homeroom — something forgettable about my chin. He forgot it inside an hour. I carried it for the next twelve years.",
      "The way I would describe the worst of it now: it was not vanity. Vanity is a feeling about yourself. This was a hostage situation. I would lose forty-five minutes to a mirror without intending to. I would be late to work, late to class, late to my own birthday, and the thing I had been doing the entire time was studying a face I had already studied ten thousand times.",
      "I tried makeup. I tried no makeup. I tried surgery consultations — three of them — and one of the surgeons, an older man with kind eyes, sat me down and said something I did not appreciate at the time. He said, you do not need surgery. You need someone to talk to.",
      "I found a therapist who specialized in OCD-spectrum conditions. She did not call it BDD for the first six months. She called it the loop. We worked on the loop. We did not work on my face.",
      "What changed it, in the end, was not believing I was beautiful. I am not sure I believe that even now. What changed it was building a life full enough that the loop had less air to breathe in.",
      "I am writing this for the version of me who was nineteen and convinced she would be inside the mirror forever. You will not be. Not because you become someone who loves how you look, but because, slowly, what you look like stops being the thing your day is about.",
    ],
    pullQuote: {
      text: "It was not vanity. This was a hostage situation.",
      afterParagraph: 1,
    },
  },
  {
    slug: "daniel-r-ocd",
    title: "What my hands needed and what I needed were not the same thing.",
    dek: "An engineer's account of contamination OCD, ERP, and the long argument with his own brain.",
    contributor: "Daniel R.",
    contributorAge: 41,
    condition: "ocd",
    themes: ["faith", "family"],
    publishedAt: "2026-02-08",
    presenceNote:
      "Daniel shared this in February 2026. He is still in maintenance therapy and doing well.",
    lanterns: 61,
    isSample: true,
    prose: [
      "I am an engineer. I am the kind of person who likes a system to be correct. OCD takes that instinct and turns it against you. The system you are trying to make correct is your own life, and there is no specification.",
      "My particular flavor was contamination. Doorknobs. Public restrooms. The handrail on the stairs at my office. By thirty-three I was washing my hands until they cracked open in the winter. My wife noticed before I did.",
      "We tried medication first. SSRIs gave me about thirty percent. The other seventy percent came from a treatment that I genuinely hated for the first three months: exposure and response prevention. You put your hand on the doorknob. You do not wash. You sit with the feeling. The feeling is unbearable until, slowly, it is just bad. And then, one day, it is just a feeling.",
      "I want to be honest about something. My faith — I am a practicing Catholic — was not the cure. But it was the container that let me sit with the discomfort during ERP. I had a framework for suffering with a purpose. That is not nothing.",
      "What I would tell my younger self: the goal is not to feel clean. The goal is to be able to live a life in which feeling unclean is not catastrophic. Those are different goals. Choosing the second one was the turn.",
    ],
    pullQuote: {
      text: "The goal is not to feel clean. The goal is to be able to live a life in which feeling unclean is not catastrophic.",
      afterParagraph: 3,
    },
    updates: [
      {
        date: "2026-04-02",
        body: "An update, six weeks later. I had a flare last month — work stress — and the old pattern came back for about a week. I went to my therapist, we sat with it, and it lifted. Recovery is not a finished thing. I want anyone reading this to know that, and to know it is not failure when it happens to you too.",
      },
    ],
  },
  {
    slug: "priya-s-trich",
    title: "I pulled in private for fifteen years.",
    dek: "Trichotillomania, the secrecy of it, and learning to stop hiding from the people who already knew.",
    contributor: "Priya S.",
    contributorAge: 33,
    condition: "trichotillomania",
    themes: ["loneliness", "identity"],
    publishedAt: "2026-01-22",
    presenceNote: "Priya shared this in January 2026. She is doing well.",
    lanterns: 47,
    isSample: true,
    prose: [
      "I pulled my eyelashes first, when I was eleven. Then my eyebrows. Then, in college, a small patch at the crown of my head. By twenty-five I had a part of my scalp the size of a quarter that no one but me had ever seen.",
      "The thing about trich that most people do not understand is that it is not about the hair. It is about a feeling that needs somewhere to go, and your hand finds your scalp the way someone else's might find a cigarette.",
      "I never told my mother. My mother is a pediatrician. I would rather have told her almost anything else. The shame was not rational. It was just there.",
      "What broke the pattern was not hiding it better. It was telling my best friend, in a hotel room in Lisbon, when I was twenty-nine. She did not react the way I had imagined for a decade. She just said, yeah, I know. I have known since college. I love you. Want to get dinner?",
      "Within a year I had told my mother. Within two, I was in habit reversal therapy. The patch is mostly grown back. The thing that surprised me is how much of the recovery was just letting other people in on something I had been carrying alone.",
    ],
    pullQuote: {
      text: "The thing that surprised me is how much of the recovery was just letting other people in on something I had been carrying alone.",
      afterParagraph: 4,
    },
  },
  {
    slug: "hannah-w-ed",
    title: "I weighed myself eleven times a day.",
    dek: "Anorexia in college, a near-collapse, and the slow work of eating like a person again.",
    contributor: "Hannah W.",
    contributorAge: 26,
    condition: "eating-disorders",
    themes: ["fully-recovered", "family"],
    publishedAt: "2026-03-01",
    presenceNote:
      "Hannah shared this in March 2026. She is fully weight-restored and has not weighed herself in over two years.",
    lanterns: 92,
    isSample: true,
    prose: [
      "I want to skip the part where I list my lowest weight and the diagnostic criteria, because I think that part of my story already gets told well by other people. I want to write about the middle.",
      "The middle, for me, was the year between being hospitalized and feeling like I had a life again. That year was harder than being sick. When you are sick, the disorder organizes everything. When you are recovering, you have to organize everything yourself, with a body that no longer trusts you.",
      "My mother moved in with me for four months. She made me three meals and two snacks a day. She did not negotiate. She also did not perform anything — no big speeches, no daily check-ins about how I was feeling. She just put a plate in front of me and read her book.",
      "I think about that a lot now. The not-performing of it. So much of the eating-disorder content I had absorbed by then was performative — the recovery influencer thing, the before-and-after thing. My mother's version was so quiet I almost missed it. She was just there. With food. Day after day.",
      "I am twenty-six now. I do not own a scale. I eat lunch without thinking about it. I do not know what I weigh and I do not particularly want to. If you are in the middle right now: it does end. The boring, repetitive, unglamorous middle ends. You get to be a person again on the other side.",
    ],
    pullQuote: {
      text: "She just put a plate in front of me and read her book.",
      afterParagraph: 2,
    },
  },
  {
    slug: "tomas-g-hairloss",
    title: "I shaved my head at thirty-one and grieved it for two years.",
    dek: "Male pattern hair loss, the shame industry around it, and the long work of not being a man defined by his hairline.",
    contributor: "Tomás G.",
    contributorAge: 38,
    condition: "hair-loss",
    themes: ["acceptance", "identity"],
    publishedAt: "2026-02-19",
    presenceNote: "Tomás shared this in February 2026. He is doing well.",
    lanterns: 53,
    isSample: true,
    prose: [
      "I started losing it at twenty-six. Not slowly, the way the genetic counselor in my dermatologist's office had described. Quickly. By twenty-nine I was combing it forward. By thirty-one I was running my hand through it twenty times a day in any reflective surface I passed.",
      "I tried finasteride. I tried minoxidil. I priced out a transplant in Istanbul. I am embarrassed to tell you how many hours of my early thirties I spent on a Reddit forum where strangers ranked photographs of each other's hairlines.",
      "I shaved it on my thirty-first birthday. I had been planning it for a year. I cried in the bathroom for fifteen minutes after, and then I went to dinner with my brother, who looked at me across the table and said, you look fine. Order the steak.",
      "The next two years were not a triumph. I did not feel free. I felt like a man whose face I no longer recognized, and the grief of that was real. What I want anyone going through this to know is that the grief is not weakness. It is appropriate. You are allowed to mourn something you valued, even if other people think you should not have valued it.",
      "I am thirty-eight now. I shave my head every Sunday morning. I think about my hair, on average, less than once a week. The thing the recovery industry will not tell you is that what is on the other side of grieving a thing is not loving the thing. It is just no longer thinking about the thing.",
    ],
    pullQuote: {
      text: "What is on the other side of grieving a thing is not loving the thing. It is just no longer thinking about the thing.",
      afterParagraph: 4,
    },
  },
  {
    slug: "joan-m-pain",
    title: "I had been bracing for impact for ten years.",
    dek: "A teacher's account of chronic back pain, the catastrophizing of it, and the unglamorous practice that finally moved her.",
    contributor: "Joan M.",
    contributorAge: 52,
    condition: "chronic-pain",
    themes: ["acceptance"],
    publishedAt: "2026-01-09",
    presenceNote:
      "Joan shared this in January 2026. She still has back pain on most days; it no longer organizes her life.",
    lanterns: 38,
    isSample: true,
    prose: [
      "I want to be careful here, because I do not want to write the kind of story where I tell you the pain went away. The pain did not go away. What changed is something different.",
      "I herniated a disc lifting a box of textbooks at forty-one. The acute pain resolved in about six months. The thing that lasted a decade was something the literature calls central sensitization — my nervous system, having learned to expect pain, was producing it on its own.",
      "By forty-eight I was bracing all day, every day. I did not realize I was doing it. My shoulders were up to my ears. I held my breath when I bent forward. I had become a body in a state of permanent low-grade emergency.",
      "What helped, eventually, was a pain reprocessing program — a clinical thing, not a wellness thing — combined with a meditation practice that I would never have signed up for in my forties. The premise was: the pain is real, and the brain is producing more of it than is useful, and the brain can be retrained.",
      "I still have back pain on most days. I rate it a three when it used to be an eight. I lift my grandchildren without thinking about my back. I went on a four-mile hike last weekend. None of that would have been imaginable to me at forty-eight, and I want anyone who is bracing right now to know that the bracing is the thing that can change first.",
    ],
    pullQuote: {
      text: "I had become a body in a state of permanent low-grade emergency.",
      afterParagraph: 2,
    },
  },
  {
    slug: "kai-l-paralysis",
    title: "The body I have now is the only one I get.",
    dek: "Six years after a spinal cord injury, on rebuilding an identity that does not look back.",
    contributor: "Kai L.",
    contributorAge: 34,
    condition: "paralysis",
    themes: ["identity", "acceptance"],
    publishedAt: "2026-03-22",
    presenceNote: "Kai shared this in March 2026. He is doing well.",
    lanterns: 119,
    isSample: true,
    prose: [
      "I will give you the facts and then move past them, because they are not the interesting part of my story. I was twenty-eight. I was a competitive cyclist. I went over the handlebars on a wet descent in Marin County, California. I have been a paraplegic since.",
      "The first year was the comparison year. Every minute of every day, I compared the body I had to the body I used to have. It was a kind of grief I could not put down. I could not sleep without dreaming about walking, and I could not wake up without losing my legs again.",
      "What ended the comparison was not acceptance, exactly. It was a slower thing. I started building a life that the new body could fit inside, and as the life filled in, the comparison ran out of fuel. Adaptive cycling. A relationship with someone who never knew me in the old body. Work I cared about. The old body had less and less to do with my actual day.",
      "I am thirty-four now. I am six years into this body. I will be honest: there are still mornings when the grief comes back for an hour. But it is an hour, not a day, and it is years, not the whole life I thought I was going to have to spend grieving.",
      "If you are early in this — weeks, months in — I want you to know that the comparison year is real and it is also temporary. The body you have now is the only one you get. That sentence sounds harsh until the day it stops sounding harsh.",
    ],
    pullQuote: {
      text: "I started building a life that the new body could fit inside, and as the life filled in, the comparison ran out of fuel.",
      afterParagraph: 2,
    },
  },
  {
    slug: "marcus-b-tinnitus",
    title: "The ringing did not get quieter. I did.",
    dek: "On habituating to severe tinnitus over four years.",
    contributor: "Marcus B.",
    contributorAge: 47,
    condition: "tinnitus",
    themes: ["acceptance", "loneliness"],
    publishedAt: "2026-02-14",
    presenceNote:
      "Marcus shared this in February 2026. He is doing well and his tinnitus is unchanged in volume.",
    lanterns: 31,
    isSample: true,
    prose: [
      "Tinnitus is the loneliest condition I have lived with, and I have lived with several. The reason it is lonely is that no one else can hear it. The volume is private. The suffering is private. There is no scan that confirms it. You are sitting in a quiet room with someone you love and there is a high-pitched whine in your right ear that has not stopped for four years and there is nothing to point to.",
      "Mine started after a concert in 2022. I assumed it would resolve in a week. After a month I was in a panic. After three months I was sleeping with a fan and a sound machine and headphones, in case any of them quit on me in the night.",
      "I want to be precise about what changed. The ringing did not get quieter. The volume of it, in any objective sense, is exactly what it was four years ago. What changed is my brain's relationship to the signal. It went from a five-alarm fire to background music to, most days, nothing I notice unless I check.",
      "What got me there was a tinnitus retraining program, sleep that I had to fight for, and a long resignation that this was the soundtrack of my life. The resignation, for me, was not defeat. It was the moment I stopped trying to make it leave and started trying to live alongside it.",
      "If you are early in tinnitus and panicking — most people who get it panic for a while — I want to tell you the thing I needed to hear and could not believe: the brain has the capacity to demote it. Not silence it. Demote it. That is enough.",
    ],
    pullQuote: {
      text: "It went from a five-alarm fire to background music to, most days, nothing I notice unless I check.",
      afterParagraph: 2,
    },
  },
  {
    slug: "aisha-o-bdd",
    title: "I thought I was the ugliest person in my family.",
    dek: "On growing up with three sisters, BDD, and the long work of seeing your own face.",
    contributor: "Aisha O.",
    contributorAge: 31,
    condition: "bdd",
    themes: ["family", "identity"],
    publishedAt: "2026-03-30",
    presenceNote: "Aisha shared this in March 2026. She is doing well.",
    lanterns: 56,
    isSample: true,
    prose: [
      "I am the third of four sisters. My older sisters were considered beautiful in the way that people in my hometown talked about. My younger sister was considered beautiful in a different way. I was, in my family's mythology, the smart one. I held that for a long time before I understood what it was a substitute for.",
      "By fifteen I was sure my nose was wrong. By eighteen I was sure my entire face was wrong. By twenty-two I had been to two plastic surgeons and was saving for a third consultation. None of them had told me anything was wrong. I just kept looking until I found someone who would say what I needed to hear.",
      "My mother caught me googling clinics on her laptop the summer I turned twenty-three. She did not yell. She sat down and said, in our language, the word that means both 'darling' and 'foolish one.' Then she said, you have my face. Your father's nose. My mother's chin. You have all of us in you and you are trying to send us to a surgeon. Stop.",
      "I started therapy two months later. It took four years to undo the certainty. There was no single moment. There was a slow softening, a hundred conversations, a thousand small refusals to look in the mirror for the seventh time before leaving the house.",
      "I am thirty-one now. I have my mother's face, mostly. I look at it without flinching most days. To my younger sisters, if they are reading this — I am sorry I held the family beauty up as a kind of currency I could not afford. None of you ever made me believe that. I made me believe it.",
    ],
    pullQuote: {
      text: "You have my face. Your father's nose. My mother's chin. You have all of us in you and you are trying to send us to a surgeon. Stop.",
      afterParagraph: 2,
    },
  },
  {
    slug: "eli-n-ocd",
    title: "I asked my fiancée if I really loved her four hundred times.",
    dek: "On relationship OCD, the cruelty of doubt, and the engagement we kept anyway.",
    contributor: "Eli N.",
    contributorAge: 29,
    condition: "ocd",
    themes: ["identity", "fully-recovered"],
    publishedAt: "2026-01-15",
    presenceNote:
      "Eli shared this in January 2026. He and his fiancée are getting married this summer.",
    lanterns: 73,
    isSample: true,
    prose: [
      "Relationship OCD does not look like OCD on the outside. It looks like a man having normal doubts about his relationship. The difference is that I would have those doubts forty times a day, would seek reassurance from my partner, would feel relieved for ninety seconds, and would then ask again.",
      "The form of the doubt was always the same: do I really love her, or am I just pretending. By the time I was twenty-seven I had asked Lily that question, in some form, more than four hundred times. I counted, because that is what OCD does. You count.",
      "The thing that saved us, I think, was that Lily had read about ROCD before I had. She caught the pattern before I did. She told me, gently, that she would not answer the question anymore. Not because she did not want to reassure me — she did — but because every reassurance was making it worse.",
      "I started ERP for ROCD six months later. The exposures were the worst exposures I had ever done. I had to write down sentences like 'I do not love her and I am marrying her anyway' and sit with the feeling. It was a violation of every instinct I had. It was also the only thing that worked.",
      "We are getting married in August. I have not asked the question in eleven months. The doubt still flickers sometimes — a flash, a couple of seconds — but it does not stay. If you are in ROCD right now and your partner is hanging in there with you, please get into ERP with someone who specializes in it. Please do not keep asking. The asking is the disease. The not asking is the medicine.",
    ],
    pullQuote: {
      text: "The asking is the disease. The not asking is the medicine.",
      afterParagraph: 4,
    },
  },
  {
    slug: "sofia-d-ed",
    title: "I prayed before every meal for a year.",
    dek: "On bulimia, faith, and the small daily ritual that interrupted a fifteen-year pattern.",
    contributor: "Sofia D.",
    contributorAge: 24,
    condition: "eating-disorders",
    themes: ["faith", "family", "identity"],
    publishedAt: "2026-02-26",
    presenceNote: "Sofia shared this in February 2026. She is doing well.",
    lanterns: 44,
    isSample: true,
    prose: [
      "I started purging when I was thirteen. I do not want to glorify the why of that. The why was small and stupid and not interesting, and the disorder grew up around it like a vine.",
      "By twenty-two I was purging six or seven times a day. I had hidden it from my parents, from my college roommate, and from the boyfriend I lived with. The hiding was almost a full-time job by itself.",
      "I was raised Catholic but had not practiced in years. I want to be clear: I am not telling a story where Jesus cured me. The treatment cured me — therapy, dietitian, group, medication for anxiety. But there was a small ritual that helped me hold the line between sessions, and it was a religious ritual.",
      "Before every meal, I would say a one-line prayer. Not a Hail Mary, not anything formal. Just: this is from God, this is for me, I will keep it. Then I would eat. Then I would set a timer for forty-five minutes and pray, again, when it went off, that I had not used the bathroom in those forty-five minutes. Sometimes I had. Most days I had not.",
      "After a year, the urge had quieted enough that I did not need the timer. After two, I stopped saying the prayer too. The thing the prayer did, I think, was not religious. It gave me a tiny window, three times a day, where I had to stop and remember I was a person making a decision. That window was enough to interrupt fifteen years of automatic behavior.",
    ],
    pullQuote: {
      text: "The thing the prayer did, I think, was not religious. It gave me a tiny window where I had to remember I was a person making a decision.",
      afterParagraph: 4,
    },
  },
  {
    slug: "lena-f-hairloss",
    title: "I lost my hair the year my daughter was born.",
    dek: "On postpartum hair loss that did not grow back, and the long work of being seen by your own children as you are.",
    contributor: "Lena F.",
    contributorAge: 36,
    condition: "hair-loss",
    themes: ["family"],
    publishedAt: "2026-03-08",
    presenceNote: "Lena shared this in March 2026. She is doing well.",
    lanterns: 49,
    isSample: true,
    prose: [
      "Postpartum hair loss is a normal thing. Most of it grows back. Mine did not. I had female pattern hair loss underneath the postpartum shedding, and the postpartum was the trigger that made the underlying thing irreversible.",
      "I spent the first year of my daughter's life feeling like I was losing pieces of myself in the bathroom drain. I would not go to the pool with my husband. I would not let anyone take photos of me holding her, because I could see my scalp in every photo and I did not want her to grow up looking at her mother that way.",
      "What turned it was, embarrassingly, an offhand comment from my own mother. She came to visit when my daughter was eighteen months old. She watched me adjust my hair for the seventh time in front of a hallway mirror. She said: my love, your daughter is going to learn what to think about her own body from watching you.",
      "I started wearing my hair the way it was, the next morning. I bought a topper for events I cared about and stopped wearing it for the school run. I let myself be photographed. My daughter is five now and she has never said a word about my hair. She does not know there was anything to say.",
      "If you are losing your hair postpartum and it is not growing back: I see you. The grief is real and the timing is cruel. The path I found was not curing it. It was learning, before my daughter could learn it from me, that this body was the one she loved.",
    ],
    pullQuote: {
      text: "Your daughter is going to learn what to think about her own body from watching you.",
      afterParagraph: 2,
    },
  },
  {
    slug: "theo-p-trich",
    title: "I am nineteen and I have stopped pulling.",
    dek: "A short story from someone in early recovery — written in the first six months of habit reversal therapy.",
    contributor: "Theo P.",
    contributorAge: 19,
    condition: "trichotillomania",
    themes: ["fully-recovered"],
    publishedAt: "2026-04-04",
    presenceNote:
      "Theo shared this in April 2026. He is six months into habit reversal therapy and pulling-free.",
    lanterns: 22,
    isSample: true,
    prose: [
      "I am nineteen. I am writing this in the first dorm room of my freshman year. I started pulling my hair when I was twelve, I have not pulled in a hundred and seventy-three days, and that is the longest I have gone since I was eleven.",
      "I want to write this down now because I do not know what is coming and I want there to be a record from here, while it is still close. I am scared of relapsing. I think about it most days. The therapist I am seeing says that is normal at this stage and that I should write it down somewhere, so here.",
      "What is helping: a fidget ring, a notes app where I log every urge, my mother knowing about it for the first time, and a haircut that I picked instead of one chosen by what I had pulled. Also caffeine, less of it. Also sleep, more of it.",
      "I do not know if I will pull again. If you are reading this and you are eleven, or twelve, or fifteen, and you have been pulling for three years and you think you are alone in it: you are not. There is a name for it. There are therapists who work on it specifically. Tell one adult. That is the whole first step.",
    ],
    pullQuote: {
      text: "Tell one adult. That is the whole first step.",
      afterParagraph: 3,
    },
  },
  {
    slug: "reza-h-pain",
    title: "Pain made me a worse father for nine years.",
    dek: "On chronic knee pain after a misdiagnosis, the fathering it cost, and the work of becoming a present parent again.",
    contributor: "Reza H.",
    contributorAge: 44,
    condition: "chronic-pain",
    themes: ["identity", "family"],
    publishedAt: "2026-02-02",
    presenceNote: "Reza shared this in February 2026. He is doing well.",
    lanterns: 35,
    isSample: true,
    prose: [
      "I tore my meniscus playing pickup basketball at thirty-three. The surgery did not go well. I spent the next nine years in chronic knee pain that was, depending on the orthopedist, either explained by the surgery, or psychogenic, or fibromyalgia, or arthritis, or all of the above.",
      "My sons were two and four when it started. They are eleven and thirteen now. I will be honest about something I am not proud of. I was a worse father for those nine years. I was short with them. I did not get on the floor. I did not coach the soccer team I had said I would. The pain ate the patience that I would have spent on them.",
      "What changed was, in part, finding a pain specialist who took the central sensitization model seriously and walked me through a reprocessing protocol. But the part I want to write about is what I did with the nine years afterward.",
      "I told them. I sat down with both of them, last spring, and I told them that I had been in a lot of pain for most of their childhoods, and that the pain had made me less of a father than I wanted to be, and that I was sorry. They were quiet. My older son said, we knew you were in pain, dad. It is okay.",
      "It was not okay, and I do not want it to be okay. But what they did with that conversation, the year afterward, has been a slow giving back of the relationship I thought I had used up. If you are a parent in chronic pain right now, please tell your kids. Even the small ones. Especially the small ones. They already know.",
    ],
    pullQuote: {
      text: "We knew you were in pain, dad. It is okay.",
      afterParagraph: 3,
    },
  },
];

export type StoryWithTiles = Story & {
  conditionTile: Tile | undefined;
  themeTiles: Tile[];
};

export const decorate = (s: Story): StoryWithTiles => ({
  ...s,
  conditionTile: tileBySlug(s.condition),
  themeTiles: s.themes
    .map((slug) => tileBySlug(slug))
    .filter((t): t is Tile => Boolean(t)),
});

export const storiesByTile = (tileSlug: string): Story[] =>
  stories.filter(
    (s) => s.condition === tileSlug || s.themes.includes(tileSlug),
  );

export const tileStoryCount = (tileSlug: string): number =>
  storiesByTile(tileSlug).length;

export const storyBySlug = (slug: string): Story | undefined =>
  stories.find((s) => s.slug === slug);

export const relatedStories = (slug: string, count = 3): Story[] => {
  const story = storyBySlug(slug);
  if (!story) return [];
  const overlapScore = (other: Story): number => {
    if (other.slug === slug) return -1;
    let score = 0;
    if (other.condition === story.condition) score += 3;
    for (const t of other.themes) if (story.themes.includes(t)) score += 1;
    return score;
  };
  return [...stories]
    .map((s) => ({ s, score: overlapScore(s) }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ s }) => s);
};

export const allTiles = tiles;
