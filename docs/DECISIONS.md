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
