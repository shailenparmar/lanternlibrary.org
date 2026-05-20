import Link from "next/link";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Roadmap — Lantern Library",
  description:
    "What Lantern Library is, what it isn't, where it is today, and where it is going.",
};

export default function RoadmapPage() {
  return (
    <div className="flex flex-col flex-1 px-6 py-10 sm:px-12 sm:py-16">
      <header>
        <Link
          href="/"
          className="font-sans text-sm tracking-[0.18em] uppercase text-muted hover:text-foreground transition-colors inline-flex items-center gap-2"
        >
          <span aria-hidden="true">←</span>
          <span>Lantern Library</span>
        </Link>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full py-16">
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted">
          Roadmap
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl leading-[1.1] text-foreground mt-4">
          What this is,{" "}
          <span className="italic text-flame">and where it is going.</span>
        </h1>
        <p className="font-serif text-xl leading-snug text-foreground/70 mt-5 italic">
          A short, honest account of what Lantern Library is for, what it
          isn&rsquo;t, where it is today, and the conditions it hopes to hold
          over the next few years.
        </p>

        <article className="mt-14 font-serif text-lg sm:text-xl leading-[1.7] text-foreground/85 space-y-10">
          <section>
            <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-muted mb-4">
              Why it exists
            </h2>
            <p>
              The drive to pass hard-won wisdom forward is one of the
              oldest human impulses. When traditional channels for it are
              rich &mdash; elders, mentors, oral traditions &mdash; the
              impulse gets expressed productively. When those channels
              thin out, the same drive leaks into less useful shapes:
              unsolicited advice, performance, the aunt who can&rsquo;t
              stop weighing in.
            </p>
            <p className="mt-5">
              Lantern Library is an attempt to rebuild a modern container
              for that ancient function &mdash; specifically for people
              who have come through identity-reconstruction conditions
              (BDD, OCD, hair loss, chronic pain, paralysis, eating
              disorders, and others) and want to leave something behind
              for the person they used to be.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-muted mb-4">
              What it is
            </h2>
            <ul className="space-y-4">
              <li>
                <span className="text-flame">·</span> An archive of
                first-person recovery stories, gathered through a warm,
                AI-guided reflection &mdash; voice and text together
                &mdash; and rendered into a consistent literary voice.
              </li>
              <li>
                <span className="text-flame">·</span> A place a reader in
                the dark middle of a condition can find specific,
                hard-won language from someone who has been where they
                are.
              </li>
              <li>
                <span className="text-flame">·</span> An independent
                archive. Not a forum. Not a comments section. Not a
                feed.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-muted mb-4">
              What it isn&rsquo;t
            </h2>
            <ul className="space-y-4">
              <li>
                <span className="text-flame">·</span> Not medical advice
                and not a substitute for clinical care.
              </li>
              <li>
                <span className="text-flame">·</span> Not a content
                platform. Contributors are not audience-managers; readers
                are not metrics. There are no engagement numbers turning
                wisdom into performance.
              </li>
              <li>
                <span className="text-flame">·</span> Not a chatbot for
                people in active crisis. A safety classifier runs in
                parallel through every reflection and surfaces real
                resources when it should.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-muted mb-4">
              Principles
            </h2>
            <ul className="space-y-4">
              <li>
                <span className="text-flame">·</span>{" "}
                <em>Warmth without performance.</em> Demonstrate attention
                through specificity; don&rsquo;t perform empathy.
              </li>
              <li>
                <span className="text-flame">·</span>{" "}
                <em>Dignity over growth.</em> If a feature would turn
                contributors into audience-managers, it does not get
                built.
              </li>
              <li>
                <span className="text-flame">·</span>{" "}
                <em>Recovery defined broadly.</em> For some conditions
                the symptoms resolve. For many others, the condition
                stays and the person&rsquo;s relationship to it changes
                so thoroughly that it no longer runs their life. Both
                count.
              </li>
              <li>
                <span className="text-flame">·</span>{" "}
                <em>Literary, not clinical.</em> Each story reads like a
                well-typeset book chapter, not a case study.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-muted mb-4">
              Where we are today
            </h2>
            <p>
              The founder is recording her own BDD recovery story first.
              Everything else follows from that proof. The reflection
              tool is live in a working prototype; the rendering pipeline
              produces stories good enough that we are proud to publish
              them. A handful of contributors are in early conversations.
              We are not yet a 501(c)(3) &mdash; until that paperwork is
              filed, we describe ourselves as an independent archive.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-muted mb-4">
              Where it is going
            </h2>
            <p className="text-foreground/70 italic mb-6">
              Conditions are sequenced by editorial standing and recovery
              shape, not by addressable market. We expand coherently
              within a cluster before jumping.
            </p>

            <div className="space-y-7">
              <div>
                <p className="font-sans text-xs tracking-[0.2em] uppercase text-flame">
                  Months 1&ndash;6 &middot; OCD-spectrum
                </p>
                <p className="mt-2">
                  Body dysmorphic disorder first &mdash; the
                  founder&rsquo;s home. OCD broadly. The cluster where we
                  have the deepest editorial footing.
                </p>
              </div>
              <div>
                <p className="font-sans text-xs tracking-[0.2em] uppercase text-flame">
                  Months 7&ndash;12 &middot; Body image &amp; self-perception
                </p>
                <p className="mt-2">
                  Hair loss, which has a strong recovery-content culture
                  and is underserved by anything literary. Eating
                  disorders, which require the highest editorial care and
                  dedicated moderation before we publish a single piece.
                </p>
              </div>
              <div>
                <p className="font-sans text-xs tracking-[0.2em] uppercase text-flame">
                  Year 2 &middot; Body change &amp; physical ability
                </p>
                <p className="mt-2">
                  Chronic pain (knee, back, foot, orthopedic).
                  Sports-injury aftermath. Paralysis and limb difference.
                  Conditions where recovery means rebuilding identity
                  around the body you actually have.
                </p>
              </div>
              <div>
                <p className="font-sans text-xs tracking-[0.2em] uppercase text-flame">
                  Later, with care
                </p>
                <p className="mt-2">
                  Tinnitus, long COVID, grief, addiction recovery. Each
                  needs its own editorial frame before it gets a shelf.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-muted mb-4">
              Care, consent, and governance
            </h2>
            <p className="text-foreground/70 italic mb-6">
              The legal and ethical posture of the archive, in plain
              language. These are commitments, not aspirations.
            </p>
            <ul className="space-y-5">
              <li>
                <span className="text-flame">·</span>{" "}
                <em>Anonymity is the contributor&rsquo;s choice.</em> Every
                contributor decides how they appear &mdash; full name, first
                name and last initial, initials, a chosen pseudonym, or
                fully anonymous. Identifying details about third parties
                (therapists, family, employers) are stripped during
                rendering by default and re-introduced only if the
                contributor explicitly asks for them back.
              </li>
              <li>
                <span className="text-flame">·</span>{" "}
                <em>Nothing publishes without explicit approval.</em>{" "}
                After a reflection, the contributor reviews both the
                structured fields and the rendered prose. They can edit,
                redact, adjust identity settings, decline, or approve.
                Silence is not consent.
              </li>
              <li>
                <span className="text-flame">·</span>{" "}
                <em>Three operations on a published story:</em>{" "}
                <strong>delete</strong> (immediate takedown, seven-day
                grace period, no justification required),{" "}
                <strong>redact</strong> (specific passages removed, shown
                to readers as opaque highlights so the choice is honest,
                not hidden), and <strong>update</strong> (new material
                appended with a date &mdash; the original is preserved
                unchanged). Stories are ledgers, not documents. We add to
                the record; we do not silently revise it.
              </li>
              <li>
                <span className="text-flame">·</span>{" "}
                <em>Not a forum.</em> There are no comments. No DMs. No
                public reactions beyond a single &ldquo;light the
                lantern&rdquo; acknowledgment, which is a private
                feedback signal to the contributor, not a leaderboard.
                Contributors are not audience-managers, and the page
                will never become a comment thread on their hardest
                chapter.
              </li>
              <li>
                <span className="text-flame">·</span>{" "}
                <em>One-way letters, by design.</em> Readers may write a
                single letter to a contributor whose story moved them,
                only when the contributor has opted in. Every letter is
                read by a moderator before delivery. There is no reply
                channel. If a letter moves the contributor enough to
                respond, they may add an update to their story &mdash;
                never a private message back.
              </li>
              <li>
                <span className="text-flame">·</span>{" "}
                <em>LLM screening, then human review.</em> A safety
                classifier runs in parallel through every reflection
                session, watching for signals of active crisis
                (suicidal ideation, imminent self-harm, active abuse,
                severe dissociation). When triggered, the session
                pauses, the contributor is acknowledged, and real
                resources are offered. The same screening runs on every
                reader letter and flags abusive content, attempts at
                off-platform contact, medical advice, identifiable
                third parties named without consent, and dangerous
                treatment claims. In the early years, a human reviews
                every story and every letter before it goes anywhere.
                LLM tools accelerate that work; they do not replace the
                human judgment behind it.
              </li>
              <li>
                <span className="text-flame">·</span>{" "}
                <em>Data minimalism.</em> We collect what a contributor
                chooses to share for the story and the minimum operational
                signals needed to run the archive. We do not sell,
                license, or share contributor content. Contributor stories
                are not used to train third-party models.
              </li>
              <li>
                <span className="text-flame">·</span>{" "}
                <em>Honest about what we are not.</em> Lantern Library is
                not medical advice, not a clinical service, not a crisis
                line, and not a substitute for professional care. We
                publish that on every page, and we mean it.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-muted mb-4">
              How we&rsquo;ll know it&rsquo;s working
            </h2>
            <ul className="space-y-4">
              <li>
                <span className="text-flame">·</span> Contributors finish
                their reflection and feel the story is theirs.
              </li>
              <li>
                <span className="text-flame">·</span> Readers in the dark
                middle find a story specific enough to feel less alone in
                it &mdash; and return.
              </li>
              <li>
                <span className="text-flame">·</span> Therapists feel
                comfortable offering it to recently-recovered clients as a
                cathartic, generous act.
              </li>
              <li>
                <span className="text-flame">·</span> Nothing in the
                product makes a contributor regret having shared.
              </li>
            </ul>
          </section>

          <section className="border-t border-rule pt-10">
            <p className="font-serif italic text-foreground/70">
              A field of lanterns on dark water. Each story lit for the
              next person walking the shore.
            </p>
          </section>
        </article>

        <div className="mt-16 flex justify-center">
          <Link
            href="/"
            className="font-sans text-sm tracking-[0.18em] uppercase text-muted hover:text-foreground transition-colors inline-flex items-center gap-2 border border-rule rounded-sm px-5 py-3"
          >
            <span aria-hidden="true">←</span>
            <span>Lantern Library</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
