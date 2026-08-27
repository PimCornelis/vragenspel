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

**Revisit when.** Phase 2 is done — then this entry is history.
