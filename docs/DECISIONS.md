---
type: decisions
project: vragenspel
since: 2026-08-27
---

# Decisions — what was chosen, why, and when to reconsider

Written before the files were, per `Project Orchestrator/docs/CREATION_PROTOCOL.md` Stage 2. Each
entry names the alternatives, because a decision recorded without them cannot be sensibly
reversed later.

---

## D1 — The app gets its own repository

**Chosen 2026-08-27.** The Vragenspel browser app lives in its own repository, not inside
`Date-day Assistant`.

**Alternatives.** Ship it from the Date-day repo; keep it a local-only file on the laptop.

**Reasoning.** The app has to be reachable from a phone, which means hosting, which means a
GitHub Pages site that is world-readable at its URL whatever the repo's privacy setting.
`Date-day Assistant` holds the gift ledger, a personal profile and occasion plans, and its
privacy is what the gift half of that project rests on. Publishing anything out of it ends that.
So: the app is a publisher, that project never becomes one.

**Revisit when.** Never, unless the deck stops being the only thing published from here.

## D2 — The repo lives outside the Obsidian vault

**Chosen 2026-08-27 (Pim).** Path on disk: `C:\Users\Pim_C\Claude Code\vragenspel`, beside
`bank-dashboard`, which is the GitHub Pages pattern already in use.

**Alternatives.** `02 Claude Projects/Vragenspel/`, as a registered vault project.

**Reasoning.** This is a code repo, not an assistant project. Putting it at the vault root would
have made `00 Vault/tools/reconcile.py` treat it as a project and demand the full house spine —
house rules, cloud bootstrap, protocols — for something with no cloud project behind it. It would
also have put the only public repo inside a vault where every other repo is private, one
mis-drag away from a problem.

**The cost, stated rather than discovered.** Obsidian search does not reach this folder, and
`reconcile.py` will never check it. Its registry row in
`Project Orchestrator/projects/REGISTRY.md` is therefore maintained by hand, and is the only
thing that keeps this repo visible to the vault.

**Revisit when.** A second out-of-vault repo appears, at which point the rule needs stating
rather than repeating.

## D3 — This repo owns the deck

**Chosen 2026-08-27 (Pim).** `cards.json`, `build_vragenspel.py`, `build_vragenspel.bat` and the
generated `VRAGENSPEL.html` moved here from
the private `Date-day Assistant` repository. That folder keeps a pointer, not a copy.

**Alternatives.** Leave the deck in Date-day and copy `cards.json` into this repo; move the deck
and retire the printable page.

**Reasoning.** Two editable copies of one deck, in two repositories, is the failure the phase-1
extraction existed to prevent — and `grep` cannot cross a repo boundary to catch the drift. One
copy, one owner. The printable page survives because the generator came with the data.

**Evidence the move broke nothing.** All four files copied byte-identical (`cmp`), then
`python build_vragenspel.py --check` was run in the new folder: *"VRAGENSPEL.html is up to date
with cards.json (118 cards, 9 categories, 11 rules)"*, exit 0. The generator resolves its own
folder with `os.path.dirname(os.path.abspath(__file__))`, so nothing needed editing.

**Revisit when.** Never. If the deck moves again it moves whole.

## D4 — `CLAUDE.md` is the authoritative rules file here

**Chosen 2026-08-27.** Not `HOUSE_RULES.md` + `docs/CLOUD_BOOTSTRAP.md`, which is the vault
framework's shape.

**Alternatives.** Follow the house framework exactly; carry both files.

**Reasoning.** The framework's three-layer model exists because a *cloud* Claude project has an
instructions box that is unversioned and needs a thin bootstrap pointing at the real rules. This
repo has no cloud project — it is worked on in Claude Code, which loads `./CLAUDE.md` and every
`CLAUDE.md` above the working directory at the start of every session, targeting under 200 lines
(retrieved 2026-08-27, [Claude Code docs — memory](https://code.claude.com/docs/en/memory)).
Carrying a bootstrap for a box that does not exist, plus a second rules file, would be two
mutable copies with no reader. One file, auto-loaded.

**Recorded as a divergence** in `Project Orchestrator/projects/REGISTRY.md`, because an
acknowledged inconsistency is fine and an unnoticed one is not.

**Revisit when.** A Claude *project* is created for this repo, or a second person works on it.

## D5 — The repo is public, and so is the site

**Chosen 2026-08-27.** Retrieved the same day rather than assumed: GitHub Pages is available on
GitHub Free for public repositories, and **a Pages site is publicly visible whatever the repo's
privacy setting** — restricting it to named people requires GitHub Enterprise Cloud
([GitHub Docs — changing Pages visibility](https://docs.github.com/en/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site)).

**Reasoning, and the check that made it acceptable.** The deck was grepped case-insensitively for
every family and given name involved before anything was copied: **zero occurrences** in
`cards.json` and in `VRAGENSPEL.html`. The cards are questions with no stored answers and no
names. Verified 2026-08-27, independently of the earlier claim in the phase-1 brief.

**The gate this creates.** Everything committed here is world-readable. See
[`../CLAUDE.md`](../CLAUDE.md), "What must never enter this repo".

**Revisit when.** Anything is proposed for this repo that would not be shown to a stranger.

## D6 — The printable page's briefing ships publicly, unedited

**Chosen 2026-08-27.** `VRAGENSPEL.html` contains an English briefing that explains the deck's
design and does not print. It is now on a public site.

**Alternatives.** Strip the briefing from the generator when publishing.

**Reasoning.** It contains no names and no personal facts — only the argument for why the deck
works the way it does. Editing working, verified code to remove harmless text is what
surgical-changes forbids. **Named here rather than left to be discovered.**

**Revisit when.** The briefing gains anything about a person.

## D7 — No answers are ever stored

**Carried from the deck's design, unchanged.** *Weet jij dit?* cards have a correct answer that
lives in a person's head. "Wat is mijn schoenmaat?" has no answer in `cards.json` and must never
gain one. Scoring is self-reported: the app asks whether that was right and takes their word.

**Reasoning.** It is the difference between a question deck and a file of one person's personal
details on a public web server.

**Revisit when.** Never.

## D8 — Dutch for everything a player reads

**Carried unchanged.** English is allowed only in files no player opens — this one, the changelog,
code comments.

**Revisit when.** Never.

## D9 — Zero dependencies, no build step, no third-party services

**Chosen 2026-08-27.** Vanilla HTML, CSS and JavaScript, opened directly. No npm, no framework,
no CDN script, no analytics, no accounts, no server.

**Alternatives.** A framework with a build step; a CDN charting or animation library.

**Reasoning.** Three reasons that all point the same way. A CDN script makes a two-player game
depend on a third party's uptime and is a supply-chain surface on a public page. A build step
means the repo can be broken by a toolchain nobody has touched in six months. And the owner does
not debug JavaScript — code has to arrive working and stay working. `bank-dashboard` is the
in-house precedent and it is vanilla.

**Revisit when.** A requirement appears that genuinely cannot be met in vanilla JS.

## D10 — State lives in the browser, and the game is played from one phone

**Chosen 2026-08-27.** Progress — which cards are spent, refusals used, the current day — is kept
in `localStorage`.

**The consequence, designed around rather than discovered.** `localStorage` is per-device and
per-browser. Two phones means two decks that drift apart on the first evening. **Play from one
phone.** Clearing browser data loses the progress; there is no backup and no server that could
provide one.

**If moving a deck between devices ever matters,** the honest fix is an export/import code the
player copies by hand, not a backend.

**Revisit when.** The one-phone rule is actually annoying in use.

## D11 — The app was not built in the session that created this repo

**Chosen 2026-08-27 (Pim).** This repo was scaffolded in a Project Orchestrator chat session,
which can write files but cannot open a browser and prove they work.

**Reasoning.** A vault rule: anything that has to build, run, test or iterate against a real repo
belongs in Claude Code. Handing over untested game logic and calling it phase 2 would move the
testing onto the owner without saying so.

**What was prepared instead.** [`APP_BRIEF.md`](APP_BRIEF.md) and
[`PHASE_2_PROMPT.md`](PHASE_2_PROMPT.md).

**Revisit when.** Phase 2 is done — then this entry is history. **It is done: 2026-08-27.**

## D12 — The app loads the deck from a generated `cards.js`, not with `fetch`

**Chosen 2026-08-27.** [`APP_BRIEF.md`](APP_BRIEF.md) left this open on purpose and asked for one
answer, written down. `build_vragenspel.py` now emits `cards.js` beside `VRAGENSPEL.html`, and
`index.html` loads it with a `<script>` tag.

**Alternatives.** `fetch('cards.json')`, accepting that the app is only ever opened from its URL.

**Reasoning.** A page opened over `file://` is not allowed to `fetch()` a neighbouring `.json`
file. The `fetch` route therefore produces an app that works on the GitHub Pages site and fails
when `index.html` is double-clicked — and that is the worse of the two failure modes, because it
shows up on the laptop where the deck is edited and never on the phone where it is played, which
is exactly the shape of a bug that wastes an evening. The generated-file route costs one more
generated file in a repository that already has one, and no new habit: editing the deck already
meant "edit `cards.json`, run the build".

**The rule this creates.** **`fetch` must not appear in the app.** There is one path, and a
second one added later would silently work in one place and break in the other.
`CLAUDE.md`, "One correct path, no fallbacks".

**Evidence.** `index.html` was rendered from a `file://` URL by headless Chrome and dumped: it
dealt a real card with its category, question and buttons, and `localStorage` worked. Separately,
`VRAGENSPEL.html` hashed identical before and after the generator was changed, so the printable
page was not disturbed.

**Revisit when.** Never, unless the app stops needing to work from a double-click.

## D13 — The app is a sitting, not an evening ritual. The gate is gone

**Chosen 2026-08-28 (Pim), the night the gated version was built.** The app deals cards
continuously for as long as you keep tapping. There is no guess step: a card is shown whole.

**Alternatives.** Keep the gate and only speed up the pacing around it; keep the gate as the
default with a way to skip it.

**Reasoning.** The intended use changed: not one card at dinner over four months, but a stack of
cards at a terrace over a glass of wine, in the shape of the *Penguin Cards* app — pick the mood,
one card fills the screen, swipe on. Under that use the guess step is a toll on every card, and
the ritual it protected — read it, guess, then answer — is not the game being played any more.

**What this costs, stated plainly rather than discovered later.** [`APP_BRIEF.md`](APP_BRIEF.md)
argued the gate was *the only thing paper cannot do at all* and the first reason to build an app
at all. That argument was correct for the game as it was then specified, and removing the gate
removes it. What remains that paper cannot do: it deals without repeating, it retires cards you
disliked, it runs the timers, it holds cards you wrote at the table, and it remembers all of that.
That is a real list, but it is a weaker one, and it should be read as the honest price of the
change rather than as a claim that nothing was lost.

**The second cost.** 118 cards was four months at one a night. At a terrace it is roughly five or
six sittings. `APP_BRIEF.md`'s "length is not free" warning was written under the old pacing and
now points the other way: **deck size has become the binding constraint.** New cards matter more
than they did, and they are still written where the players are known, not here.

**A divergence this creates.** `cards.json`'s printed rules card still says *"Eerst gokken"* and
*"Eén keer per avond mag ieder een kaart weigeren"*. The app now does neither. The paper deck and
the app therefore describe different games. The rules are the author's words and were not edited
to match — that is Pim's call to make, not a session's. **Recorded here so it is a known
inconsistency rather than an unnoticed one.**

**Revisit when.** The deck is played at a dinner table again rather than a terrace.

## D14 — What they thought of the cards never enters this repository

**Chosen 2026-08-28.** Thumbs up and thumbs down are kept in the browser, and travel to the
laptop as a block of text the player copies out of the menu. A session writes them to
`card_feedback.local.json`, which is gitignored — by the existing `*.local.json` rule and by name.

**Alternatives.** A committed `card_feedback.json`; a file under `docs/`.

**Reasoning.** Everything committed here is world-readable at the GitHub Pages URL whatever the
repository's privacy setting (D5). *Which* questions a particular couple loved, and which ones
they refused to ever see again, is a fact about those two people rather than about the deck —
exactly what [`../CLAUDE.md`](../CLAUDE.md) says must never enter this repository. A thumbs-down on
one specific card can say a great deal. It is also the sort of file that looks harmless enough to
commit by reflex, which is why it is named in `.gitignore` explicitly rather than left to a glob.

**Why copy-paste rather than sync.** The game is played on a phone and the repository is on a
laptop, and there is no server between them and never will be (D9). Copy-paste is not a
compromise here; it is the only honest mechanism available, and D10 already named it as the right
answer for moving state between devices.

**Revisit when.** Never, while the repository is public.

## D15 — Cards written in the app are drafts, not deck

**Chosen 2026-08-28.** The app can write new cards. They play immediately, are stored in the
browser, and are labelled *"staan nog niet in het deck zelf"*. They enter the deck only when a
session puts them into `cards.json` and the build is run.

**Alternatives.** Let the app own its own cards permanently alongside `cards.json`; refuse to let
the app create cards at all.

**Reasoning.** A card that lives only in the app is a second store of deck content, and two
editable copies of one deck is the exact failure the phase-1 extraction existed to remove (D3).
Calling them drafts keeps that true: `cards.json` is still the only editable copy of *the deck*,
and the drafts are visibly a waiting room rather than a parallel deck.

**The risk, stated because it is real.** A draft that is never promoted lives only in one
browser's `localStorage` and is lost if browser data is cleared. The app says so on the panel.

**The privacy gate this creates.** A card typed at a terrace is one build away from a public
website. The app warns about this in Dutch at the moment of typing, and **promoting drafts into
`cards.json` requires the same name-and-personal-detail check that D5 required of the deck.** That
check belongs to the session doing the promoting; the app cannot perform it, because it would have
to know the names to look for and no name may exist in this repository.

**Revisit when.** Drafts are routinely promoted and the waiting room is proven to work — or
routinely ignored, which would mean the feature should be removed rather than trusted.

## D16 — There is a score, there are no rounds, and the players' names never leave the phone

**Chosen 2026-08-28 (Pim).** The deck no longer counts rounds. A score runs from the moment you
start until you tap *Stoppen en de stand opmaken*, which says who won. The two players can type
their names in the menu.

**Alternatives.** Keep the round counter alongside the score; score every card rather than only
the ones the rules already score; ship the names in the code.

**Why rounds went.** They measured the wrong thing. The counter answered "how far through the deck
are we" — a question that mattered when the deck was four months of dinners and stopped mattering
when it became an evening. A score answers the question actually being asked at the table.

**What scores, and why only that.** **[SUPERSEDED — D29. All eleven categories score as of
2026-10-22, and 178 of 178 cards can. The toll argument below is answered rather than ignored:
the button that scores is the same button that deals the next card, so every card costs one tap.
The rest of this entry — the score, no rounds, the names — is unchanged.]**
Not invented here — taken from the rules card in `cards.json`.
*Weet jij dit?* has one right answer, so it asks who knew it. *Wat kies je* and *Onenigheid* end in
a minute each of arguing, so they end in who did the convincing. *Wie van ons?* is a match or it is
not; a match is a point each. The other five categories are conversation and score nothing, which
is deliberate: a scoring tap on all 118 cards would have put a toll on every card, which is the
mistake the gate made. Fifty-four of 118 cards can score, so a sitting still produces a real score.

**THE NAMES ARE NOT IN THIS REPOSITORY, AND MUST NOT BE.** Pim gave both players' names when
asking for this. Neither appears in any file here — not in the code, not in the docs, not in a
comment. The name fields default to *Speler 1* and *Speler 2*, are typed on the
phone, and are kept in `localStorage` with the rest of the state. They are also deliberately left
out of the *Wat vonden we ervan* export block, so a name cannot ride into a Claude Code session and
from there into a committed file.

**Reasoning.** [`../CLAUDE.md`](../CLAUDE.md) is unconditional: no names, *"not the players', not
family, not friends"*, and everything committed here is world-readable (D5). A nickname for a real
person on a public site is exactly the thing that rule exists to stop. Typing them into the phone
costs one moment, once, and gives the same result — the app can say *"… wint"* with the name in it
without the name ever existing in a file.

**Revisit when.** Never, while the repository is public.

**On the pigeon.** It is a motif Pim asked for, and it stays: a bird carries no name. It is
confined to `maakDuif()` in `app.js` and the sheen on the result screen, so it can be removed
without touching anything else if it is ever unwanted.

## D17 — The printable deck is retired

**Chosen 2026-08-28 (Pim), after a review found the two forms had drifted.** `build_vragenspel.py`
no longer emits `VRAGENSPEL.html`, its layout templates are gone, and the generated page is staged
in `_to_delete/` for deletion by hand. `cards.json` → `cards.js` is now the only build output.

**The evidence that forced it.** The app stopped being the guess-first game on 2026-08-28 (D13),
but `cards.json`'s rules card was deliberately left as the author's words. So rule 2 still read
*"Eerst gokken"* and rule 6 still gave *"één keer per avond een kaart weigeren"* — a printed deck
was teaching a game the app does not play. D13 recorded that as a known inconsistency, which was
right at the time. **It is only tolerable in a document. In a deck someone reads aloud at a table
it is a defect**, because the rules card is player-facing and nothing warns the reader.

**Alternatives.** Rewrite the rules card to match the app — rejected because the rules are the
author's words and rewriting them to chase the app is a session making a call that is Pim's, and
because it leaves two artefacts to keep in step forever. Keep both and live with the drift —
rejected: that is the state that produced this decision.

**What is kept, and why the rules stay in `cards.json`.** The eleven rules stay in the data. Four
of them define how the special categories play and the app reads them for its scoring
(D16). They are deck content, not printable-page content.

**The honest consequence.** Any deck already printed still exists on paper and still teaches the
original guess-first game. Retiring the generator does not un-print it. That is fine — that deck
*is* the original game, and it can be played as one.

**Evidence the change broke nothing.** `cards.js` was hashed before the rewrite and rebuilt after:
**byte-identical**. The deck the app loads did not move. `build_vragenspel.py` went from 300 lines
to 140.

**Revisit when.** Someone wants paper again — at which point the rules card is the first thing to
settle, not the last.

## D18 — A superseded brief is annotated at the line, never rewritten

**Chosen 2026-08-28.** When a decision reverses something [`APP_BRIEF.md`](APP_BRIEF.md) argues
for, the passage is marked in place — `[SUPERSEDED — D<n>]` — in the same change. The brief is
never edited into agreement with what was built.

**Alternatives.** Rewrite the brief to match the app — rejected, and the reason is the good one
already argued in the brief's own banner: a brief edited to agree with what shipped stops being
evidence of what was decided and why, which is the only reason to keep it. Rely on the top banner
alone — rejected on measurement: on 2026-08-28 the banner was correct and complete, and the body
three sections down still read *"The gate is the product… build that first"* as a live
requirement. **A reader absorbs a requirement where it is written, not where it is corrected.**

**What changed alongside.** `CLAUDE.md` now names itself and `DECISIONS.md` as the current
requirements and sends sessions to the brief for history only. Its frontmatter says `status:
HISTORY`.

**Revisit when.** The brief has more superseded passages than live ones — at that point it is
wholly history and the annotations stop earning their keep.

## D19 — Two categories added, and why these two

**Chosen 2026-08-28 (Pim).** The deck goes from 118 to **158 cards**: **Mensen kijken** (20,
`#4a5a6b`) and **Rode vlaggen** (20, `#8a2b2b`), with a rule for each appended to the rules card.

**The problem they solve.** At terrace pacing 118 cards was five or six sittings, and every retired
card shrank it. Deck size had become the binding constraint (D13). Forty more ordinary questions
would have bought two more sittings.

**Why *Mensen kijken* is worth more than its twenty cards.** Its answers come from the room, not
from the deck, so the same card plays differently every time it is dealt. It is the only category
here with genuinely unbounded reuse, and it is the only one that could not exist on paper *or* on a
phone at home — it needs the terrace the app is played on.

**Its one rule is a courtesy, and it is in the rules card on purpose.** *Wees aardig: hij hoort het
niet, maar het gaat wel over een echt mens.* A category built on inventing lives for strangers
needs that said out loud once, in the game, rather than assumed.

**Why *Rode vlaggen* is a dilemma, not a list.** **[SUPERSEDED — D28. "Every card" was true
of the first twenty and is not true of the thirty: two further sentence shapes were added
2026-10-22. What still holds is the dilemma — every card offers exactly two options.]**
Every card is *"wat is erger: X of Y"* and both
players choose, then argue for a minute — the same shape as *Wat kies je*, which is the
best-performing existing category. They are deliberately domestic and comic: wekkers, vaatwassers,
spraakberichten. **None of them is about a real person**, which is both a privacy rule and the
reason they are funny rather than pointed.

**The card texts are self-contained.** Each reads as an ordinary card and plays correctly before
the app knows anything about the new categories, so the deck could ship ahead of the app work.

**Revisit when.** The thumbs say which of the forty are working. Write the next batch from
`card_feedback.local.json`, not from imagination.

## D20 — The private layer, and the file that carries it

**Chosen 2026-08-28 (Pim).** The app grows a memory that is deliberately *not* in this repository:
**Tijdcapsule cards** — cards written at the table about a shared memory, *"Wat aten we het meest
in Puglia?"*, *"Wat gebeurde er die nacht in Thailand?"* — which lie dormant and resurface after a
chosen interval. Alongside them: the players' names, the thumbs, and the cards written in the app.

**Where it lives.** `localStorage` on one phone, plus an **exported file** the players keep
themselves. `navigator.storage.persist()` is requested on load and the home-screen web app is the
strongest signal WebKit uses when granting it — but persistence is best-effort by policy, so the
file is the record and the phone is the working copy. Retrieved 2026-08-28:
[WebKit, Updates to Storage Policy](https://webkit.org/blog/14403/updates-to-storage-policy/),
[MDN, `StorageManager.persist()`](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist).

**Why a Tijdcapsule card can never become a deck card.** *"Wat gaven we voor je twintigste?"* is a
fact about two named people wearing the costume of a question. D15 lets a card written in the app
be promoted into `cards.json` after a privacy check; **a Tijdcapsule card is exempt from that path
entirely** — not "checked more carefully", not promotable. The app must refuse it and so must any
session. `CLAUDE.md` hard limit 6.

**Why the export file is gitignored by pattern and never quoted.** It is the same content in a
form that can be dragged into a repo folder by accident, or pasted into a session and from there
into a changelog. Both are covered: `vragenspel-geheugen*.json` is ignored, and `CLAUDE.md` says
plainly that a session handed one reads what it needs and quotes nothing.

**Alternatives.** Keep the memory cards in `cards.json` and make the repo private — rejected, that
un-does D1 and D5 and kills the Pages site. A backend — rejected, D9. Rely on `localStorage`
alone — rejected on evidence: best-effort storage can be evicted after a period without
interaction, which is exactly the shape of a card designed to sleep for a year.

**Revisit when.** A second device genuinely needs the same memory, at which point the export file
is already the mechanism and only the import ergonomics change.

## D21 — Rode vlaggen scores, Mensen kijken does not

**[SUPERSEDED — D29, on both halves of this entry. As of 2026-10-22 there are no flows and no
timers, so "runs the same flow" and "The timer is reused" below describe machinery that no longer
exists. *Mensen kijken* now scores like every other category, by the owner's decision, and the
courtesy line no longer appears on screen. What survives is the wording: the sentences of rules 12
and 13 are still shown on the card, still copied rather than parsed.]**

**Chosen 2026-08-28.** *Rode vlaggen* runs the same flow as *Wat kies je* — both choose, one
minute each to argue the other chose wrong — and therefore ends in *"Wie heeft overtuigd?"* and a
point. *Mensen kijken* has no scoring tap anywhere in its flow.

**Alternatives.** Give *Mensen kijken* a point for the closer guess; give *Rode vlaggen* no point
and end it after the timers; write a second timer for *Rode vlaggen*.

**Reasoning.** Rule 13 says *Rode vlaggen* ends in a minute of convincing, which is exactly what
D16 already treats as scorable, so it scores for the same reason *Wat kies je* does. Rule 12 says
of *Mensen kijken*: **"Er is nooit een goed antwoord."** A category with no right answer that asked
who won would be inventing one, and a scoring tap on a card that cannot be scored is a toll — the
mistake the gate made (D13). **This changes D16's list from four scoring categories to five**:
74 of 158 cards can score.

**The timer is reused, not rewritten.** *Rode vlaggen* enters `stapKiezen` and from there the
existing `stapTimers`, which is what [`PHASE_3_PROMPT.md`](PHASE_3_PROMPT.md) asked for and what
"one correct path" requires: two clocks would drift into two behaviours.

**The courtesy line is shown once per sitting.** **[SUPERSEDED — D29. The owner was asked on
2026-10-22 and chose to drop it; the app shows it nowhere now. The sentence is still rule 12 in
`cards.json`, untouched. The reasoning below stands as the cost of that choice.]**
*"Wees aardig: hij hoort het niet, maar het gaat
wel over een echt mens."* Said once it is a reminder; said on all twenty cards it is nagging and
gets skimmed past, which is the failure mode for the one line in the deck that exists to be read.
It is tied to the first *Mensen kijken* card of the sitting, so leaving the panel and coming back
does not lose it.

**The words are the rules card's words, copied, not parsed.** Both flows show the sentences of
rules 12 and 13 verbatim, minus their markup, as strings in `app.js`. This is the pattern the app
already used for rules 7 and 10. Splitting the rules at runtime was rejected: it makes the
on-screen text depend on where the author happens to put a full stop, and it would break silently.

**Revisit when.** The thumbs say whether a scored *Rode vlaggen* is better than an unscored one.

## D22 — The memory file goes out through the share sheet, and comes back as a replacement

**[SUPERSEDED — D30, on the route out only. The share sheet never worked: Chrome will not share a
`.json` file at all, so the button failed on the owner's phone on 2026-10-22, the first time it was
tried there. It is a download now. Everything else in this entry — replace never merge, the Dutch
confirmation, refusing a file that is not ours, the hidden picker button — is unchanged and still
live. Read the *"What was not verified"* paragraph below: it predicted this exactly.]**

**Chosen 2026-08-28.** One button builds the whole private layer as
`vragenspel-geheugen-YYYY-MM-DD.json` and hands it to `navigator.share({files:[…]})`. It is **not**
offered as a download, and there is no second route.

**Alternatives.** A `Blob` and an `<a download>`, which is what
[`PHASE_3_PROMPT.md`](PHASE_3_PROMPT.md) asked for first; or both paths, with the download tried
and sharing as a fallback.

**Reasoning.** The game is played from a web app on the iOS home screen. That is exactly the
context where a download has nowhere visible to land — no tab, no download shelf, and no reliable
way to find the file afterwards — while the share sheet is the platform's own gesture for *put this
file in Bestanden or Notities*, which is where the file needs to end up. Two paths were rejected on
the rule this repo already lives by: a fallback that works on the laptop and not on the phone is a
bug that stays hidden until the evening it matters (D12, and `CLAUDE.md` "one correct path, no
fallbacks").

**What was not verified, stated rather than left to be discovered.** This was tested on a desktop
browser, which has no Web Share API at all — so the *refusal* path is proven (the button says, in
Dutch, that this browser cannot share a file) and **the working path is not**. It has not been run
on the owner's phone from the home-screen app. If it fails there, the change is to swap the one
`navigator.share` call for a download — not to add one beside it.

**`laatsteExport` is stamped only when `share()` resolves**, never when it is cancelled, so the
two-month nudge cannot report a back-up that was never made.

**Replace, never merge.** An imported file overwrites the whole state behind a Dutch confirmation
that names the date and the counts. Merging two states is a class of bug the owner would never find
and does not need: the game is played from one phone (D10). Two things are deliberately not taken
from the file — the card that was on screen when the back-up was made, and whether *this* phone's
storage is protected.

**A file that is not ours is refused out loud.** The marker is `vragenspel_geheugen: 1`; anything
else gets a Dutch sentence rather than a silent no-op, because a file picker will happily hand over
a bank statement.

**The picker's own button is hidden.** It is drawn by the browser, says *"Choose file"*, and cannot
be restyled or translated; a Dutch button opens it instead. D8 has no exceptions.

**Revisit when.** The phone says whether the share sheet worked.

## D23 — Tijdcapsule is an app-level category, and it obeys nothing

**Chosen 2026-08-28.** *Tijdcapsule* is defined in `app.js` — a name and a colour — and is **not**
a category in `cards.json`.

**Alternatives.** Add it to `cards.json` with a count of zero, so the app resolves its colour the
same way it resolves every other one.

**Reasoning.** A category in `cards.json` appears in the filter and in the category picker for a
written card. Both would create a route by which an ordinary draft could be labelled *Tijdcapsule*
and then promoted into the deck, which is the one thing D20 forbids. Keeping the category out of
the data means the route does not exist to be closed. Capsules also carry their own id range
(5001+, clear of the drafts at 1001+), so an id says what a card is without consulting anything.

**A due capsule ignores the category filter and the licht/diep dial.** It waited months to be
asked; an evening's mood is not a reason to make it wait longer. Stated here because it is a
deliberate exception to two filters that otherwise apply to everything.

**Thumbs work on capsules, and stop at the phone.** A capsule can be retired like any card. It is
filtered out of the *Wat vonden we ervan* block by id rather than trusted not to appear there, and
the panel says in Dutch that capsules are not in the block and never will be — the refusal D20
requires is spoken, not merely enacted.

**"Verras me" keeps its date to itself**, in the confirmation and in the list of sleeping cards.
Printing the date would give away the only thing that option is for. It picks a day between three
months and two years.

**Only the question and the dates are stored. Never an answer.** D7, and the reason the deck is
publishable at all.

**Revisit when.** The first capsule comes due — that is the only real test of it.

## D24 — The light/deep dial ships before its labels, and the labels are the author's

**Chosen 2026-08-28.** The dial is built: a sitting opens on a Dutch mood screen — *Licht*,
*Diep*, *Alles* — the choice is kept, and it can be changed in the menu. **`cards.json` carries no
`diepte` field yet**, and this session did not write one.

**Reasoning.** [`PHASE_3_PROMPT.md`](PHASE_3_PROMPT.md) is explicit that the tagging is the
author's call and must be agreed before it is committed — which cards land heavy is not a thing a
session can know. So the mechanism ships and the data waits. The proposal was made in the same
session: 28 *diep*, 130 *licht*, grouped by category.

**The dial is offered only when the deck carries labels.** `HEEFT_DIEPTE` is read from the deck at
load. Before the tagging lands the mood screen is not shown and the menu section is hidden, because
a *Diep* sitting on an unlabelled deck is an empty deck — a worse thing to ship than no dial. When
the labels land, one build turns it on and nothing else changes.

**A card with no `diepte` always plays.** Drafts written in the app and Tijdcapsule cards have no
label and are not going to acquire one; the dial narrows the deck and must never empty it.

**Verified against the real proposal.** With the 28/130 tagging applied to a temporary build:
*Licht* 130 playable, *Diep* 28, *Alles* 158, mood screen shown, menu toggle reflecting the choice.
`cards.js` was then regenerated from `cards.json` and hashed **byte-identical to before the test**.

**Revisit when.** The tagging is agreed. The honest note to carry into that conversation: on this
session's reading the deck is mostly light, and a *Diep* sitting of 28 cards is one evening — if
deep evenings should last longer, the fix is to promote cards, not to relabel the comic ones.

## D25 — The card on the screen is restored only while it is still allowed

**Chosen 2026-08-28, from a bug Pim found in play:** every sitting opened on the same
*Kleine dingen* card, and switching that category off did not get rid of it.

**The cause, which was one thing in three places.** `stand.huidige` — the id of the card on the
screen — is restored when the app is reopened and when a panel is closed. Both routes asked a
weaker question than they should have: *does this card exist, and is it not thumbed down?* Neither
consulted the category filter or the licht/diep dial. And `nieuwSpel()` zeroed the score but never
let go of `huidige`, so *Nieuw spel, punten op nul* handed back the card — and the step — the
sitting had just been stopped on. One card could therefore survive a filter change, a new game and
every reopen, indefinitely.

**The fix.** One predicate, `magNog(id)`, built on `speelbaar()`, used by both restore routes. The
filter, the dial and the thumbs are now honoured in exactly one place, so a fourth restore route
added later cannot get this wrong differently. `nieuwSpel()` clears `huidige`.

**What a new game does and does not reset.** It resets the score and lets go of the current card.
It keeps the verdicts — they are about the deck, not about this evening (D16) — and it keeps
`gezien`, the record of which cards have been dealt this time round the deck. Resetting `gezien`
was rejected: it would deal back the cards you looked at ten minutes ago, and the deck already
starts over by itself when it has been all the way round (D13).

**Switching a category off while looking at one of its cards now replaces the card.** That is the
point of the fix rather than a side effect of it: the alternative is a control that visibly does
nothing until the next tap. *Verder spelen* still returns to the same card, because there the card
is still allowed and continuing is what the button says.

**A second defect, found while reproducing the first.** The filter's opening line read *"Tik een
categorie aan als je ergens geen zin in hebt"* — tap what you do **not** want. Tapping a category
selects it, and only selected categories are dealt, which the second line already said
correctly (*"Alleen deze categorieën worden gedeeld"*). So the instruction told a player to do the
exact opposite of what the button does: tap *Kleine dingen* to be rid of it, and it becomes the
only thing you get. The line now says *"Tik aan waar je zin in hebt; dan doen alleen die mee."*

**Not changed: the filter stays a list of what plays, not a list of what is banned.** Flipping the
meaning would silently invert every filter already saved on the phone, and the rest of the app —
the second line, the empty-deck message — is already written for it. Named here because
[`APP_BRIEF.md`](APP_BRIEF.md) frames the feature the other way round (*"for the evenings when
nobody wants a dilemma"*), and that framing is what the wrong line came from.

**Revisit when.** Selecting nine categories to exclude one is annoying enough in use to be worth
the migration.

## D26 — The deck can be put back together, and the counter counts what is in play

**Chosen 2026-08-28, after Pim asked what the counter meant.** A card that has been dealt is not
dealt again *at all* until every other playable card has gone — `deel()` picks from
`beschikbaar()`, which is `speelbaar()` minus `gezien` — and then `gezien` empties itself and the
deck starts over silently. It was never "shown less often", and a session spent scrolling through
cards to test the app therefore locks those cards out for a whole pass.

**So the menu gained one button: *Begin het deck opnieuw*.** It empties `gezien` and nothing else.
It is shown only when there is something to put back.

**What it deliberately does not touch.** The thumbs, which are verdicts on the deck rather than on
tonight (D16, D14). And `gezienOp`, the date each card was last asked, which is what lets an old
card say *"Dit vroegen we op ⟨datum⟩"* (D20's private layer). Wiping those to fix a counter would
be throwing away memory to tidy a number. **The consequence, stated because it is real:** cards
dealt while testing carry that day's date, so in a year they will claim to have been asked then.
That is the honest price of keeping the history in one place, and clearing a date is a separate
decision from putting a card back in the pile.

**A confirmation was not added.** Nothing is lost — the button makes cards available, it does not
remove anything — and a confirmation on a harmless action teaches you to tap through
confirmations, which matters because the import in D22 has a real one.

**The counter was wrong, and is now measured from one pool.** It compared `gezien.length`, which
holds ids from the whole deck, against `speelbaar().length`, which is filtered. Narrowing the
filter to *Kleine dingen* therefore produced **"41 van 12 kaarten gehad."** Both numbers now come
from the same pool: `speelbaar().length - beschikbaar().length` out of `speelbaar().length`, which
is exactly what `deel()` works from.

**And the counter now says what it means**, in one line under it, because "41 van 158 kaarten
gehad" invites the reading that those cards are merely rarer.

**Revisit when.** Never, unless the deck stops dealing without repeating.

## D27 — The dates can be wiped, by the owner, on the phone, behind a question

**Chosen 2026-08-28, at Pim's request.** D26 deliberately left `gezienOp` — the date each card was
last asked — alone when the deck is put back together. That is still right for the general case,
but it left a specific mess: an evening spent scrolling through cards to test the app stamped 41 of
them with that day's date, so a year later they would claim to have been asked then. The menu now
has a second button, *Wis de datums van eerdere keren*.

**It could not be done from a session, and that is the architecture working.** The dates live in
`localStorage` on one phone; there is no server and no path from a laptop to that data (D10, D9).
A session can ship the button; only the owner can press it. Worth naming, because "just clean it up
for me" is a reasonable thing to ask and the honest answer is that nobody here can reach it.

**Two buttons, not one, and they do different things.** *Begin het deck opnieuw* puts every card
back in the pile and loses nothing. *Wis de datums* loses something permanently: after it, no card
can say when it was last asked. Folding them together would have made the harmless action carry the
destructive one, which is how people end up wiping history to fix a counter.

**So this one asks and the other does not.** The confirmation names the number of cards, says which
line disappears, and says it cannot be undone; the button bar becomes *Ja, wis de datums* /
*Nee, laat staan* — the same shape as the memory import's question (D22), so a question that costs
something always looks the same. This is the reasoning of D26 applied in the other direction:
confirmations are spent where something is at stake, which is what keeps them worth reading.

**The question is scrolled into view when it appears.** The menu is long enough that *Het deck*
sits below the fold, and the bar turns red whether or not the sentence explaining why is visible.
A confirmation you can act on without being able to read it is worse than none.

**What it does not touch.** `gezien`, so the deck keeps its place; the thumbs; and a Tijdcapsule's
own `geschrevenOp`, which is the card's identity rather than a record of it being dealt — a capsule
still says when it was written.

**Revisit when.** Never. If wiping the dates turns out to be something done routinely rather than
once after testing, that is evidence the year-old-card line is unwanted, not that this button needs
changing.

## D28 — *Rode vlaggen* gets two more sentence shapes, and still offers exactly two options

**Chosen 2026-10-22 (owner).** The deck goes from 158 to **178 cards**: ten more *Wat kies je*
(159–168) and ten more *Rode vlaggen* (169–178). The cards were written and approved in a
`Date-day Assistant` session, which is where this deck's Dutch is authored, and appended here
unchanged. No existing card was touched, reworded, removed or renumbered.

**The problem, measured rather than assumed.** All twenty of the original *Rode vlaggen* cards
opened with the same three words — *"Wat is erger:"*. Twenty out of twenty. D19 wrote that shape
down as the category's definition, and at twenty cards it was the definition. At thirty it would
have been a template: a category whose every card announces itself identically stops being a
dilemma and starts being a form, and the opening words are the first thing read aloud.

**The second shape, ids 169–173.** *"Wat kun je nog net verdragen: X, of Y?"* — which is the
wording of **rule 13 itself**, the rule printed with the category. The question the category was
built to ask was already written in its own rule and had never been used as a card opening.

**The third shape, ids 174–178.** The flag sits on an **imaginary third person** rather than on
either player: a first date, a new housemate, new neighbours, someone on a weekend away, a
colleague. Four of the five open with a short scene sentence and then the dilemma; 178 names its
third person without one. **D19's privacy point is unchanged and is the reason this shape is safe:
none of them is about a real person.** Putting the flag on an invented stranger keeps the card
comic rather than pointed, which is also why it is funny.

**Why the app did not change.** All three shapes offer **exactly two options**, so the choice the
player makes is the same shape it always was. Rule 13 requires two — *kiest ieder één van de twee*
— and the *Rode vlaggen* flow in `app.js` is built on that, so nothing in the code, the rules or
the generated `cards.js` structure needed a line. This was verified rather than assumed: all thirty
cards contain the connector, and `build_vragenspel.py` accepted the deck unchanged.

**Alternatives.** Replace the twenty originals with varied ones — rejected: renumbering or removing
cards silently repoints everything the phone remembers, since `gezien`, `gezienOp` and the thumbs
are all keyed by card id. Write forty more in the existing shape — rejected, it is the shape that
was the problem, not the count. Add a fourth category instead — rejected: the dilemma works, and
D19's own *Revisit when* said to write the next batch from `card_feedback.local.json` rather than
from imagination, which is what happened.

**No `diepte` field was added.** All twenty new cards are light and belong under *licht* when D24's
tagging lands. Tagging them now would put a field in the deck that nothing reads yet.

**Revisit when.** A third of the category shares an opening again, or the thumbs say one of the
three shapes is carrying the other two.

## D29 — The game mechanics are removed: a card, read aloud, and three buttons

**Chosen 2026-10-22 (owner), asked for in these words:** *"Uit het vragenspel wil ik eigenlijk alle
spelelementen verwijderen… Ik wil terug naar de basis van een kaart per categorie, waar de speler
zelf de kaarten voorleest en de app alleen de kaart laat zien. Ik wil alleen drie opties: Punt voor
speler A, punt voor speler B en overslaan. Mooie kaart en niet meer tonen mogen blijven."*

**What the app does now.** A card appears. One of the two reads it aloud. The footer offers the
same three actions under every card — a point for either player, or *Overslaan* — plus the two
thumbs, which are unchanged. All three deal the next card immediately.

**What was removed.** The one-minute timers and everything they drove (`TIMER_SECONDEN`,
`stapTimers`, `startKlok`, `tekenKlok`, `klokTekst`, `stopKlok`, `klokAfgelopen`,
`volgendeSpeler`); the three-second countdown for *Wie van ons?*; the beep (`piep`, a Web Audio
oscillator) and the vibration (`trilling`); and all six per-category flows — `stapKiezen`,
`stapMensen`, `stapWieAftellen`, `stapWieUitslag`, `stapWieRaak`, `stapWieMis`, `stapWeetWie`,
`stapWeetNiemand`, `stapOvertuigd`, `stapGeenPunt`. With them went `geefPuntAllebei` (there is no
"a point each" button any more) and `stapPuntGegeven`. 214 lines of `app.js`, and the CSS for the
clock, the countdown and the large timer button.

**The confirmation step went with them.** Awarding a point used to open a screen saying *"Een punt
voor X."* and wait for a second tap on *Volgende kaart*. That is one tap too many for an app whose
stated job is to show the card and nothing else, so a point now deals the next card straight away.

This was the one call the original request did not make explicitly, so it was built as an inference
and flagged as one at handover. **The owner confirmed it the same day, 2026-10-22: the instant next
card stays and the confirmation screen does not come back.** Recorded so that a later session reads
a decision here rather than an open question — the alternative was considered and rejected by the
person whose game it is, not left unexamined.

**The instruction did not disappear, it stopped being machinery.** The six categories that had a
flow now show their rule as a quiet line of text under the question, rendered by the same
`toonExtraLijst` the flows used. `soortVan` survives and does the same job it always did — it just
selects a sentence instead of a flow. **Three of those lists ended in a sentence about the minute**
(*"Daarna één minuut om de ander te overtuigen…"*, *"Eén minuut per persoon."*); those sentences
went with the timer and the rest of the author's Dutch is unchanged. Nothing was reworded.

**Alternatives.** Keep the timers behind a setting — rejected: a mechanic nobody can see is still a
mechanic to maintain, and "one correct path" (CLAUDE.md) forbids two. Keep the flows for the
categories whose rules name a procedure — rejected: that is the thing being removed, and it would
leave the app doing six different things under eleven identical-looking cards. Leave the
instruction out entirely — rejected: the rule still has to reach the players, and the printed deck
is retired (D17), so the screen is the only place left that can say it.

**D21 is superseded, on two points.**

1. **Mensen kijken now scores.** D21 gave it no scoring tap, reasoning that rule 12 says *"Er is
   nooit een goed antwoord"* and a category with no right answer that asked who won would be
   inventing one. Three uniform buttons give it a score by default. **The owner was asked and chose
   to let it score**, on the grounds that uniformity is the whole point of the change and an
   exception would be a fourth code path under a footer that is otherwise identical everywhere. The
   old reasoning is not wrong — it is outranked. Nothing stops the two of them tapping *Overslaan*
   on a card that cannot be won.
2. **The courtesy line is gone from the screen.** D21 showed *"Wees aardig: hij hoort het niet,
   maar het gaat wel over een echt mens"* on the first *Mensen kijken* card of each sitting, which
   needed a flag tracking whether it had been shown. **The owner was asked and chose to drop it.**
   The sentence is not lost: it is still rule 12 in `cards.json`, untouched. D19 argued that a
   category built on inventing lives for strangers needs that said out loud once — recorded here as
   a known cost, not an oversight.

**D16 is superseded on what scores, which the phase-4 brief did not expect.** D16 listed four
scoring categories and argued that *"a scoring tap on all 118 cards would have put a toll on every
card, which is the mistake the gate made"*. D21 made it five. **It is now all eleven**, and 178 of
178 cards can score. The toll argument is answered rather than ignored: the tap is not a toll
because there is no longer anything else to tap — the button that scores is the same button that
deals the next card, so a scoring card and a conversation card cost exactly one tap each. The rest
of D16 stands: the score runs until *Stoppen*, there are no rounds, and the names never leave the
phone.

**D13 and D16's other halves are untouched.** It is still a sitting with no gate and no guess step,
the score and the end screen are unchanged, and Tijdcapsule (D20, D23) and the light/deep dial
(D24) were not part of this and still work.

**A *Weet jij dit?* card says nothing on screen.** There is no instruction line for it, by the
owner's decision of 2026-10-22: with three buttons, *"a point for Speler 1"* already is the
self-report, so a sentence asking who knew it would repeat what the footer says. **No answer is
stored, now or ever** — D7, CLAUDE.md hard limit 2.

**What this costs, stated plainly.** `APP_BRIEF.md` ranked *"Run the timers"* as reason 3 of 5 for
building an app rather than using the paper deck, and required that the special categories' flows
be respected. Both are now reversed, and they are annotated at the line per D18. What is left that
paper cannot do: it deals without repeating, it retires cards you disliked, it keeps the score, it
holds cards you wrote at the table, it sleeps a Tijdcapsule for a year, and it remembers all of it.
Shorter than the list D13 left, and that is the honest price of getting the app out of the way.

**The deck was not touched.** No card added, removed, reworded or renumbered; `cards.json` and
`cards.js` are byte-identical and the build was deliberately not run.

**Revisit when.** A sitting is played this way and the three buttons turn out to be two too many,
or the missing minute is missed.

## D30 — The memory file goes out as a download. D22's share sheet never worked on the phone

**Chosen 2026-10-22 (owner), after the back-up button failed on his phone.** `bewaarBackup` builds
a `Blob` and clicks an `<a download>`. `navigator.share()` is gone from the app. There is still
exactly one route.

**What actually happened.** Tapping *Bewaar een back-up* in Chrome on the owner's phone showed
*"Bewaren lukte niet"* with **no share sheet at all** — the failure was instant. That message is
reached only when `navigator.canShare({files:[…]})` has already returned **true**, so the browser
said it could share the file and then refused.

**The cause, confirmed in Chromium's own source rather than guessed.**
`third_party/blink/renderer/modules/webshare/FILE_TYPES.md` lists every file type Chrome will
share. The whole Text category is `css`, `csv`, `ehtml`, `htm`, `html`, `shtm`, `shtml`, `text`,
`txt`. **`.json` is not on the list, and neither is `application/json`.** The Web Share spec says a
file type blocked for security reasons rejects with `NotAllowedError`, which is thrown before any
sheet is drawn. That is exactly the observed behaviour, and it means the app could never have
backed up a single time on this phone.

**D22's premise was wrong, and this is the more useful half of the finding.** D22 chose the share
sheet over a download because *"the game is played from a web app on the iOS home screen"*, where a
download has nowhere to land. It is played in **Chrome on an Android phone, in an ordinary tab**,
where a download lands in Downloads with a notification and can be found again. The objection that
ruled downloads out does not apply to the device the game is actually played on.

**And it inverted a written instruction.** [`PHASE_3_PROMPT.md`](PHASE_3_PROMPT.md) asked for the
Blob download first, and said: *"THEN TEST IT ON MY PHONE from the home-screen app, not only in a
desktop browser… If it fails there, switch to `navigator.share()`."* The download was never shipped
and the phone test was never run — D22 records that plainly under *"What was not verified"* — so
the switch to sharing was made on a theory about iOS rather than on the phone. **The lesson is the
one D22 itself wrote down: the untested path is the one that breaks.** D22 also pre-authorised this
exact remedy — *"If it fails there, the change is to swap the one `navigator.share` call for a
download — not to add one beside it"* — so this is that instruction being carried out.

**Alternatives.** Keep the share sheet and ship the file as `.txt` with `text/plain`, which is on
Chromium's list — **rejected by the owner**: the back-up would stop looking like what it is, and
the import picker's `accept=".json"` would have to be widened to match, so a working route would be
traded for a cosmetic one. Offer a download beside the share sheet — rejected, and not a close
call: two routes is what D22 and `CLAUDE.md` forbid, and it is how this bug stayed invisible.

**What this costs, stated rather than discovered later.** D22 could promise that `laatsteExport` is
stamped only when `share()` resolves, so the two-month nudge could never name a back-up that was
never made. **A download has no "it finished" event, so the stamp is now made on the attempt.** If
the phone refuses the download, the menu will claim a back-up that does not exist. That is a real
regression in honesty, accepted because the alternative was a button that never worked at all.

**`T.exportAf` was removed.** It said *"Afgebroken. Er is niets bewaard."* and existed for a share
sheet the player could cancel; a download has no cancel to observe.

**What was verified, and what was not.** Verified in a browser at phone width: the file is named
`vragenspel-geheugen-YYYY-MM-DD.json`, carries `application/json`, is valid JSON with all sixteen
fields and the `vragenspel_geheugen` marker; the anchor is in the document when clicked and removed
after; **the download does not navigate the tab**, so the sitting is not lost; the exported file
imports back and restores the state exactly; and a file that is not ours is still refused out loud.
**Not verified: the owner's Android phone.** That is the only test that counts, it is the test D22
skipped, and only he can run it.

**Revisit when.** The phone says whether the download worked. If it did not, the next step is not a
second route — it is to find out what Chrome did with it.

## D31 — Forty dilemmas, written to three engines, and the register widens

**Chosen 2026-10-22 (owner).** The deck goes from 178 to **218 cards**: forty more *Wat kies je*
(179–218). No other category changed, and no existing card was touched, reworded or renumbered.
*Wat kies je* is now 70 cards, the largest category in the deck.

**Where they came from.** The owner asked for Reddit-style dilemmas — *would you rather*, *what
if*, the Dutch *dinsdagdilemma*. **Reddit itself was unreachable from the session** (direct requests
are refused and the browser pane blocks the domain), so nothing was read there first-hand. The
usable sources were secondary write-ups on what makes a *would you rather* thread work, the Dutch
*Dilemma op Dinsdag* archive for its format, and the deck's own data.

**No card was copied, translated or adapted from either source.** All forty are written here, to
the patterns rather than from the text. This matters because the repo is public: lifting someone's
list into it is both a copyright problem and a worse card. One draft was discarded during writing
because it had landed close to an existing *Dilemma op Dinsdag* entry.

**What `card_feedback.local.json` contributed, without any of it ending up here.** D19's *Revisit
when* said to write the next batch from that file rather than from imagination, and that is what
happened. **What the file actually says stays in the file** — which cards the two of them loved or
put away is a fact about them, not about the deck (D14). What follows are the design rules derived
from it, stated as rules about cards.

**The three engines a dilemma can run on.**

1. **The cursed gift** — two attractive powers, each ruined by an ironic catch. The argument is
   about which defect you could live with. **The strongest of the three**, and eighteen of the
   forty use it.
2. **The absurd lesser evil** — two burdens, pick one. This is *Dilemma op Dinsdag*'s whole format.
   Seventeen of the forty.
3. **The comic trade-off** — a choice that reveals something without getting heavy. Five.

**The rule that decides whether engine 2 works, and it is the useful finding.** A two-burden
dilemma is funny when the burden is **absurd** and dead when the burden is a **real loss**.
Identical structure, opposite result: a card about squeaking shoes is a game, a card about never
walking again is grief wearing the same grammar. Engine 2 was used here only with absurd burdens.
The general guidance agrees from the other direction: if one option is clearly better the argument
collapses, so each side needs its own upside and its own drawback.

**The register widens, deliberately.** The owner was asked how far into the absurd to go and chose
to **allow mild gross-out** — smells, sneezing, sweat, damp clothes. Nothing explicit, nothing
cruel, and nothing about a real person, which is D19's privacy point and still absolute. This is a
change of voice for the deck and is recorded as one rather than slipped in.

**They are shorter on purpose.** The new forty average **92 characters** against 112 for the
existing *Wat kies je* and 140 for the batch of that morning (D28). Nineteen of the old thirty
exceed 95 characters, which drops the question to the app's smallest type. A dilemma that has to be
read twice is not funny the second time.

**And deliberately varied in form**, because D28's lesson is one batch away. Of this morning's ten
*Rode vlaggen*, eight opened on the same construction. These forty mix the comma form
(*"X, of Y?"*) with the two-sentence form (*"X. Of Y."*), and no opening is used more than a few
times.

**Alternatives.** Put them in *Rode vlaggen* — rejected: D28 already warned that category was
becoming a template. Expand *Wat als* — not taken now, though it is the smallest category at 8
cards and is **open reflection, not a dilemma at all**, which is a real gap someone should look at.
Ten cards as a trial — rejected by the owner in favour of forty.

**Verified.** The build accepts the deck; ids run 1–218 with no gap; `meta.card_count` and the
category count both updated; cards 1–178 byte-identical field for field. In a browser at 390 px all
forty deal, render, and carry the *Allebei kiezen* instruction, three buttons and two thumbs. The
longest new card (124 characters) fits on a phone screen with room left.

**Revisit when.** The thumbs say which of the three engines is carrying the batch — and whether the
wider register was a good idea or a passing mood.

## D32 — The deck's centre of gravity moves to the dilemma, and *Wat als* comes off the floor

**Chosen 2026-10-22 (owner).** Thirty-nine more cards, ids 219–257: thirty-seven *Wat kies je* and
two *Wat als*. Written and approved by the owner and appended unchanged. The deck is **257 cards**.
No existing card was touched, reworded, removed or renumbered, and nothing in `app.js`,
`index.html` or `style.css` changed — this was content only.

**What it does to the deck, which is the part worth recording.** *Wat kies je* is now **107 of 257
cards — 42% of the deck**, up from 32% this morning and from 19% before today. Counting *Rode
vlaggen* and *Onenigheid*, **more than half of every sitting is now a two-option choice.** That is
the intended direction and it was chosen deliberately, but it is a change in *what the game is*,
not merely in how long it lasts: the deck opened as a mixed box of questions about a shared past
and now leans on the dilemma as its main engine. Recorded so that a later session reading
"deck size is the binding constraint" (D13) does not mistake this for growth alone.

**Alternatives.** Spread the batch across the thinner categories — *Verhalen*, *Wij*, *Kleine
dingen*, all at 12 — which would have kept the mix closer to the original and is the obvious
counter-argument to the paragraph above. Rejected by the owner: the dilemmas are what the sittings
actually run on, and a category is not worth padding for the sake of a ratio. Hold the batch until
more verdicts exist. Rejected: the cards were already written and approved.

***Wat als* comes off the floor, and keeps its shape.** It had been stuck at the 8 cards it was
created with — the smallest category in the deck — and it is **not a dilemma category**: its cards
are open reflection with no choice in them. The two new ones keep that. **257 is not even a
question.** It tells the two of them to do something to each other and then swap: a wish, and the
other invents the catch. That is a card shape the deck did not have.

**Which is a quiet confirmation of D29.** Phase 4 took the game mechanics out of the app that same
day, on the principle that the players run the game and the app only shows the card. Card 257 is
that principle used deliberately: a game, carried entirely by a sentence on a card, with the app
doing nothing but displaying it and offering the same three buttons as everywhere else. The
machinery left the code and came back as text, which is what D29 said should happen.

**Checked before appending, because it would have been a silent failure.** *Wat als* has no flow
that assumes two options: `soortVan` returns `gewoon` for it, `AANWIJZINGEN` has no `gewoon` entry,
and nothing anywhere in the app inspects a card's text. Both new cards deal as bare cards with the
standard footer, verified in a browser against the existing cards 57 and 58.

**Provenance, and a departure from D19 worth naming.** D19's *Revisit when* said to write the next
batch from `card_feedback.local.json` rather than from imagination. D31 did exactly that. **This
batch did not** — it came from external would-you-rather compilations and from r/WouldYouRather,
at the owner's direction and with the cards written by him. That is his call to make and it is
recorded as a choice rather than an oversight. What the feedback file says still stays in the
feedback file (D14).

**reddit.com cannot be reached from a Claude Code session, and this is the workaround.** The JSON
API answers 403; the HTML is a client-side shell titled *"Welcome to Reddit"* containing no posts;
and the one tool that could execute its JavaScript is blocked by policy. Ids 250–257 therefore come
from **PDFs the owner saved by hand on 2026-10-22** — the post *"Ultimate list of would you rather
and hypothetical questions"* and the subreddit's top-of-all-time page. **A future session should not
waste a turn re-discovering this.** The remaining cards come from public compilations, retrieved
the same day; the list is in the changelog entry.

**The card-length ceiling has been reached.** Card 221 is **206 characters**, the longest in the
deck, past the previous maximum of 173. `maatVoor` has three sizes and the smallest covers
everything over 95, so a card this long gets no further help from the layout. At 390 px it fits
without clipping and without pushing the footer off screen — but it is at the edge, and the next
card longer than this one will not be. **If cards keep growing, the fix is a fourth size, not a
longer card.**

**No `diepte` field was added.** Every card in the batch is *licht* except **253**, which is the one
deep card; that is written down in the changelog for whoever lands D24's tagging. Adding the field
now would put data in the deck that nothing reads.

**Revisit when.** The thumbs say whether a deck that is 42% dilemma is better or merely longer —
and whether *Wat als*, now that it has been touched for the first time, is worth a batch of its own
rather than two cards carried in on the back of another category.
