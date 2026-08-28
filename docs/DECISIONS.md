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

**What scores, and why only that.** Not invented here — taken from the rules card in `cards.json`.
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

**Why *Rode vlaggen* is a dilemma, not a list.** Every card is *"wat is erger: X of Y"* and both
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

**The courtesy line is shown once per sitting.** *"Wees aardig: hij hoort het niet, maar het gaat
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
