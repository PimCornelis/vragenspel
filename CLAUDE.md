# Vragenspel — the rules for any session working in this repo

**This file is authoritative and overrides your defaults.** Claude Code loads it at the start of
every session in this folder. There is no other rules file and no cloud project behind this repo —
that is deliberate, and the reasoning is in [`docs/DECISIONS.md`](docs/DECISIONS.md) D4.

Read [`docs/DECISIONS.md`](docs/DECISIONS.md) before changing anything structural. Read
[`docs/APP_BRIEF.md`](docs/APP_BRIEF.md) before touching the app.

## What this is

A Dutch question deck for two people, in two forms that share one source of truth:

- **`cards.json`** — 118 cards in 9 categories, plus the rules. **The only editable copy of the
  deck.**
- **`VRAGENSPEL.html`** — a printable page, **generated** from `cards.json`. Never edit it by hand.
- **`cards.js`** — the deck for the app, **generated** from `cards.json`. Never edit it by hand.
- **`index.html`, `style.css`, `app.js`** — the browser app. Hand-written; these are the files to
  edit. Built 2026-08-27.
- **`card_feedback.local.json`** — what the two of them thought of the cards. **Gitignored, and
  must stay that way** (`docs/DECISIONS.md` D14). Read it before proposing deck changes.

The app is a **sitting**, not an evening ritual: cards deal one after another, there is no guess
step, and a thumb down retires a card. This replaced the original one-card-a-night design on
2026-08-28 — `docs/DECISIONS.md` D13, which also records that the printed rules card still
describes the older game.

## The five hard limits

Breaking any of these is worse than not doing the work.

1. **Never run git in this folder.** Not `commit`, not `add`, not bare `status`. Pim commits in
   GitHub Desktop. If a status is genuinely needed: `git --no-optional-locks status --short`.
2. **No answers are ever stored.** *Weet jij dit?* cards have a right answer that lives in a
   person's head. `"Wat is mijn schoenmaat?"` gets no stored answer, ever. Scoring is
   self-reported — the app asks "was that right?" and takes their word. (`docs/DECISIONS.md` D7)
3. **This repo is public and its GitHub Pages site is public.** See "What must never enter this
   repo" below. (`docs/DECISIONS.md` D5)
4. **`cards.json` is the single source of truth.** Edit the deck there and regenerate. A second
   editable copy of the cards — inlined in the app, duplicated in a JS file — is the exact failure
   phase 1 existed to remove. (`docs/DECISIONS.md` D3)
5. **Never edit a card's Dutch text to "improve" it.** Wording, spelling and punctuation are the
   author's. Add cards; do not correct them.

## What must never enter this repo

Everything committed here is world-readable at
`https://pimcornelis.github.io/vragenspel/`, whatever the repository's privacy setting.

- **No names.** Not the players', not family, not friends. The deck was checked before it was
  moved here: zero occurrences, and that is the state to keep.
- **No answers, and nothing that is a fact about a person** — dates, sizes, addresses, habits.
- **No credentials of any kind**, not even placeholder-looking ones.
- **Nothing copied out of `Date-day Assistant`** except the deck itself. That repo is private
  because it holds a gift ledger and a personal profile, and this repo is the only publisher.
- **No card verdicts.** What they liked and disliked stays in `card_feedback.local.json`, which is
  gitignored. It looks harmless enough to commit by reflex. It is not. (`docs/DECISIONS.md` D14)

**Two gates that need a human eye, not a glob.**

1. **Promoting a card written in the app into `cards.json` publishes it.** Drafts are typed at a
   terrace, which is exactly where a name slips in. Read every draft before it goes in, against
   every bullet above. The app cannot do this check — it would have to know the names, and no name
   may exist here. (`docs/DECISIONS.md` D15)
2. **A file can be clean while the sentence describing it is not.** A source path in a changelog
   once carried a first name and a birthday into this repo, and no card scan would have caught it.

If a change would put something here you would not show a stranger, stop and say so.

## How to work here

- **Detective, not decorator.** Form a theory, gather evidence with one targeted test at a time,
  confirm, then fix the cause. No speculative fixes because they sound plausible.
- **Surgical changes only.** The smallest change that solves the problem. Do not restructure
  working code because a newer convention exists.
- **One correct path, no fallbacks.** A silent fallback hides a broken tool. Say what failed.
- **Clarity over cleverness.** Pim is a mechanical engineer, not a software engineer — he will not
  debug this. Code arrives working, and jargon is explained on first use.
- **Verify before declaring done.** State what correct output looks like *before* you run the
  check, then compare. "It rendered" is not "it's right".
- **Never claim a file exists without listing the directory and seeing it.**

## Technical constraints

- **Vanilla HTML, CSS and JavaScript. No framework, no build step, no npm, no CDN script, no
  analytics, no accounts, no server.** (`docs/DECISIONS.md` D9)
- **Dutch for everything a player reads**, without exception. English only in files no player
  opens — this one, the docs, code comments. (`docs/DECISIONS.md` D8)
- **State lives in `localStorage`**, so it is per-device. The game is played from one phone.
  (`docs/DECISIONS.md` D10)
- **Phone first.** It is used on a phone, held in one hand, at a terrace. Design for that screen
  and test at that width.
- **`file://` blocks `fetch()` — settled, do not reopen.** The app loads the deck from the
  generated `cards.js` with a `<script>` tag, so double-clicking `index.html` works exactly like
  the hosted site does. **`fetch` must not appear in the app.** Change the deck in `cards.json`
  and run the build, the same as for the printable page. (`docs/DECISIONS.md` D12)

## Regenerating the printable deck

Edit `cards.json`, then **double-click `build_vragenspel.bat`**. It resolves its own folder, writes
everything it prints to `build_log.txt` beside it, and pauses so the window can be read.

`python build_vragenspel.py --check` regenerates in memory and reports whether `VRAGENSPEL.html`
is already current, without writing. Use it to prove a change did what you expected.

## Before you hand anything over

- **Say what was executed and what was not**, in the same breath as handing it over.
- **Write the commit summary and description**, ready to paste into GitHub Desktop. Claude never
  commits, and GitHub Desktop cannot pre-fill a message — the session that made the change is the
  only thing that knows why.
- **Anything Pim runs gets a double-clickable launcher**, not a command to paste, and it pauses
  before closing and writes a log.
- **Log the change** in [`docs/CHANGELOG.md`](docs/CHANGELOG.md), with the *why*, newest at top.

## Where this repo sits

It is registered in `02 Claude Projects/Project Orchestrator/projects/REGISTRY.md` but lives
**outside** that vault, so no automated check reaches it — that registry row is maintained by
hand. New cards are written where the profile is, in a Date-day Assistant session, and land in
`cards.json` here.
