---
type: changelog
project: vragenspel
---

# Changelog

Newest at top. The *why* is the part that matters.

## 2026-08-28 — A score instead of rounds, and the interface finished

**What.** Rounds removed entirely. A running score, a result screen that says who won, names the
players type on the phone, a pigeon, and a pass over the whole interface. The category dropdown
that was white-on-white is gone rather than patched.

**Rounds went because they measured the wrong thing.** The counter answered *how far through the
deck are we* — the right question when the deck was four months of dinners, the wrong one when it
became an evening. Pim also read *"3 van 49"* as a round being 49 cards long; it was not, it was a
category filter left on from testing narrowing the deck to 49. Either way the counter was
answering a question nobody was asking. The deck now simply starts over when it has been all the
way round, and says nothing about it.

**What scores, and why not everything.** Taken from the rules card in `cards.json` rather than
invented. *Weet jij dit?* has one right answer, so it asks who knew it. *Wat kies je* and
*Onenigheid* end in a minute each of arguing, so they ask who convinced. *Wie van ons?* is a match
or it is not; a match is a point each. The other five categories score nothing on purpose — a
scoring tap on all 118 cards would put a toll on every card, which is exactly the mistake the gate
made. 54 of 118 cards can score, so an evening still produces a real result.

**The names never enter this repository.** Pim gave the two players' names when asking for this.
**Neither is in any file here** — not in the code, not in a comment, not in these
docs. The app has two name fields, defaulting to *Speler 1* and *Speler 2*, typed on the phone and
kept in `localStorage`. They are also left out of the *Wat vonden we ervan* export block on
purpose, so a name cannot ride into a Claude Code session and from there into something committed.
`CLAUDE.md` is unconditional on this and the repository is public. `DECISIONS.md` D16.

**The pigeon.** Pim asked for light pigeon theming, so the furniture around the cards is one:
slate and dove grey rather than black, a bird drawn in inline SVG on the result screen, and a
small one beside each point scored. The winner's panel and the bird carry the green-to-violet
sheen a pigeon's neck actually has. A motif carries no name, which is why it was allowed where a
name was not. The card colours themselves are untouched — those belong to the deck.

**The dropdown was removed, not fixed.** The category picker on the "eigen kaart" panel was a
native `<select>`, whose open list is drawn by the browser and came out white text on white. It
was patched first with `color-scheme:dark` and an explicit `option` rule — both kept, since they
also fix scrollbars and the caret — but the control itself is now the same colour-coded chips the
menu already uses. That removes the OS-drawn popup entirely, matches the rest of the app, and is a
bigger tap target. **It also removed the one thing in this app that could not be verified from
here**, since a native popup is drawn outside the page and never appears in a screenshot.

**Other polish.** A newly dealt card animates in rather than blinking. The top bar carries the
score instead of a counter. Long questions step down through three sizes rather than overflowing.
Panels sit on slate rather than near-black, and the result screen is centred and typeset as an
ending rather than another panel.

**Verified.** Score starts at 0-0 with neutral names; typing names updates the top bar and the
buttons and persists; a point on *Weet jij dit?*, a point each on a *Wie van ons?* match, and a
point for whoever convinced after the timers all land correctly; ordinary cards offer no scoring
tap; the result screen shows a winner, a draw, and a not-yet-started state, and *Nieuw spel* clears
the score while leaving the thumbs, the names and the written cards alone; the chip picker sets the
category on a saved card; the deck starts over silently with no round text anywhere in the
interface; `index.html` still deals a card when rendered from a `file://` URL by headless Chrome.

**Still untested.** Not opened on a real phone. Pointer input through the browser tool timed out
all session, so buttons were fired through their real click handlers rather than by physical taps,
and there are still no swipe gestures — advancing is by button.

## 2026-08-28 — The app becomes a sitting: no gate, thumbs, and cards you can write

**What.** `index.html`, `style.css` and `app.js` rebuilt, hours after the entry below. The app now
deals cards continuously, shows each one whole, and lets you review the deck while you play.
`.gitignore` gained a named entry and `card_feedback.local.json` was created. Same session as
the entry below, which ran past midnight.

**Why, in Pim's words.** Away from one card a night and towards *Penguin Cards* — "more cards
quicker, to play as a game for sitting at a terrace drinking a glass of wine."

**What Penguin Cards turned out to be, since it shaped this.** Researched rather than assumed: it
is an app, not a physical deck — 4,800+ questions in 27 packs, you pick a mood, one card fills the
screen with the pack's colour as the background, swipe left to skip and right to continue, and
there is no guess step, no timer and no scoring. Its own line for the ritual is *one question on
screen, then the phone goes face-down, then you talk*.

**The gate is gone, and that is a real loss rather than a tidy-up.** The entry below called it the
entire reason the app exists, and [`APP_BRIEF.md`](APP_BRIEF.md) reason 1 called it the only thing
paper cannot do at all. Both were right for the game as specified then. Under terrace pacing the
guess is a toll on every card. **What the app still does that paper cannot** — deal without
repeating, retire cards you disliked, run the timers, hold cards written at the table, remember
all of it — **is a real list but a weaker one, and it is written down that way on purpose.**
`DECISIONS.md` D13.

**The paper deck and the app now describe different games.** `cards.json`'s rules card still says
*"Eerst gokken"* and *"Eén keer per avond mag ieder een kaart weigeren"*; the app does neither.
The rules are the author's words and were **not** edited to match — that is Pim's call, not a
session's. Recorded so it is a known inconsistency rather than a discovered one.

**Reviewing while playing.** Two buttons under every card. *Mooie kaart* marks one of the good
ones; *niet meer tonen* retires it and it is never dealt again. A card cannot be both, both can be
undone under *Wat vonden we ervan*, and the buttons appear only on screens that actually have a
card under them — the first version put them on the "nothing left to deal" screen too, where they
silently judged whichever card happened to be dealt last.

**Where the verdicts go, and why not into this repository.** The phone cannot write to the laptop
and there is no server between them, so the menu produces a block of text to copy into a Claude
Code session, which merges it into `card_feedback.local.json`. **That file is gitignored — by the
existing `*.local.json` rule and by name.** Which questions a particular couple loved, and which
they refused to ever see again, is a fact about those two people rather than about the deck, and
everything committed here is world-readable. A thumbs-down on one specific card can say a great
deal. `DECISIONS.md` D14.

**Cards written in the app are drafts.** They play immediately and are labelled as not yet being
in the deck. They enter `cards.json` only when a session puts them there and the build runs,
because two editable copies of one deck is the failure D3 exists to prevent. **The panel warns, in
Dutch, at the moment of typing, that a card taken into the deck ends up on a public website** —
a card typed at a terrace is one build away from being published, and that is the only moment the
warning can help. `CLAUDE.md` now carries the matching rule for the session doing the promoting,
because the app cannot run that check itself: it would have to know the names, and no name may
exist in this repository. `DECISIONS.md` D15.

**Deck size is now the binding constraint.** 118 cards was four months at one a night. At a
terrace it is five or six sittings, and a retired card shrinks it further. `APP_BRIEF.md`'s
"length is not free" warning was written under the old pacing and now points the other way.

**Verified.** Thumbs toggle, persist, and are mutually exclusive; 40 consecutive deals produced no
repeat and never dealt a retired card; with every playable card seen the deck reshuffles and the
counter reads *"ronde 2"* rather than dead-ending; with everything retired it says so instead;
writing a card refuses empty text, stores it, plays it at once with "eigen" where the number goes,
and removing it also clears its verdict; the export block carries deck cards by id and written
cards by full text. `index.html` rendered from a `file://` URL by headless Chrome still deals a
real card. All 118 card texts searched for in `app.js`, `index.html` and `style.css`: **zero**.

**Fixed on first use.** The category dropdown on the "eigen kaart" panel was white text on a
white list — unreadable except for the highlighted row. The `<select>` itself was styled, but the
open list is drawn by the browser rather than by the stylesheet: it inherited the page's light
text colour and kept the operating system's white background. Fixed with `color-scheme:dark` on
`:root`, which tells the browser to draw its own widgets dark, **and** an explicit
`.veld option` rule, because the two are honoured by different browsers. Verified by computed
style — all nine options now compute to `rgb(31,35,44)` behind `rgb(253,253,251)`. **The open
list itself could not be screenshotted**: it is drawn by the operating system, outside the page,
so it does not appear in a page capture.

**Still untested.** Not opened on a real phone. The browser tool's pointer clicking timed out all
session, so buttons were fired through their real click handlers rather than by physical taps —
which means **swipe gestures were not implemented**: advancing is by button, not by swiping as
Penguin does.

## 2026-08-27 — Phase 2: the browser app

**What.** `index.html`, `style.css` and `app.js` written from scratch — the browser form of the
deck. `build_vragenspel.py` gained a second output, `cards.js`. Vanilla HTML, CSS and JavaScript;
no framework, no build step, no npm, no CDN script, nothing loaded over the network at all.
`DECISIONS.md` D9.

**The gate, which is the entire reason the app exists.** A card shows its category and its
question and nothing else until someone presses *Wij hebben gegokt*. This was built and proved
first, before any other feature: on paper the question and the instruction to guess sit in front
of both players at once, so the guess gets skipped, and the honour system is the only thing
holding the deck's central mechanic together. `APP_BRIEF.md` reason 1.

**Proved rather than asserted.** The hidden half is not merely styled out of sight — before the
button is pressed the words *"Nu het echte antwoord"* are **absent from the page's text content**,
checked by reading `innerText`, not by looking at a screenshot. A player who scrolls, or who
opens the page source out of curiosity, finds nothing to spoil.

**The `file://` question, decided.** `APP_BRIEF.md` left this open deliberately. **Decision: the
deck is generated a second time as `cards.js` and loaded with a `<script>` tag.** A page opened
over `file://` may not `fetch()` a neighbouring `.json`, so the `fetch` route would have produced
an app that works on the hosted site and fails silently when `index.html` is double-clicked — the
worst of the two failure modes, because it only appears on the laptop and never on the phone.
`cards.json` stays the only editable copy; `cards.js` joins `VRAGENSPEL.html` as a generated one,
the same shape that already exists, so editing the deck still means "edit `cards.json`, run the
build" and no new habit is required. **There is one path in the code: `fetch` does not appear in
it.** `CLAUDE.md`, "One correct path, no fallbacks".

**Evidence the generator change broke nothing.** `--check` was run *before* regenerating and
reported `VRAGENSPEL.html` already current with `cards.js` missing — so the printable layout was
untouched by the edit. After regenerating, `VRAGENSPEL.html` hashed **identical** to before
(`sha256 9f5ea3a8…`). The printable deck is byte-for-byte what it was.

**Evidence `file://` actually works**, rather than being argued to work: `index.html` was rendered
by headless Chrome from a `file://` URL and dumped. It dealt card 74 with its category, question
and buttons in place, and the "this browser remembers nothing" warning stayed hidden, so
`localStorage` works there too.

**No second copy of the deck.** Every one of the 118 card texts was searched for in `app.js`,
`index.html` and `style.css`: **zero matches**. The only category names in `app.js` are the four
that have rules of their own, which the code must name to apply them. `CLAUDE.md` hard limit 4.

**No answers stored, and the app says so out loud.** A *Weet jij dit?* card asks *"Klopt dat?"* and
takes the player's word. The verdict is displayed and then forgotten — it is never written to
`localStorage`, which was verified by reading the stored string straight after answering "Ja, dat
klopt" on *"Wat is mijn schoenmaat?"*: it contained only which cards were seen, which were refused,
the date and the counters. The card itself carries the sentence *"Alleen jij weet het goede
antwoord. Het spel bewaart het niet."* `DECISIONS.md` D7.

**Two rules that were interpreted rather than copied, so they can be argued with.**

- **Cards are dealt at random, not in `cards.json` order.** The brief says "deals the next unseen
  card". Read literally that means twenty *Vroeger* evenings in a row before the first dilemma
  ever appears, because the file is grouped by category. A physical deck is shuffled, so this one
  is too.
- **An evening ends at 4am, not at midnight.** The rules say one refusal *per avond*. A card at
  half past twelve belongs to the evening that is still happening, not to tomorrow.

**Additions not in the brief, flagged because they were not asked for.** *Opnieuw beginnen* behind
a confirmation, because 118 cards otherwise ends in a dead end after four months; and a visible
Dutch warning when `localStorage` is unavailable, because a game that silently forgets everything
is worse than one that says it will.

**What is honestly untested.** The app has not been opened on a real phone — it was designed and
proved at 390×844 in a desktop browser, which is the right width but not the real thing. The
browser tool's pointer clicking timed out throughout the session, so buttons were exercised
through their real click handlers rather than by physical taps. And no player has used it yet.

## 2026-08-27 — Repository created; the deck moved here

**What.** New repository at `C:\Users\Pim_C\Claude Code\vragenspel`, created in a Project
Orchestrator session. `cards.json`, `build_vragenspel.py`, `build_vragenspel.bat` and the
generated `VRAGENSPEL.html` were **moved** here from
the private `Date-day Assistant` repository. Written from
scratch: `CLAUDE.md`, `README.md`, `.gitignore`, `.gitattributes`, `docs/DECISIONS.md`,
`docs/APP_BRIEF.md`, `docs/PHASE_2_PROMPT.md`, and this file.

**Why a new repository.** The app has to be reachable from a phone, which means GitHub Pages,
whose published site is world-readable whatever the repository's privacy setting. The Date-day
repository holds a gift ledger and a personal profile and its privacy is load-bearing, so it can
never be the publisher. `DECISIONS.md` D1 and D5.

**Why the deck moved rather than being copied.** Two editable copies of one deck in two
repositories is the failure the phase-1 extraction existed to remove, and `grep` cannot cross a
repository boundary to catch the drift. One copy, one owner. The generator came with the data so
the printable page still works. `DECISIONS.md` D3.

**Evidence the move broke nothing.** All four files compared byte-identical with `cmp` after
copying. Then, in the new folder, `python build_vragenspel.py --check` — expected beforehand to
report the page already current, and it did: *"VRAGENSPEL.html is up to date with cards.json (118
cards, 9 categories, 11 rules)"*, exit 0. The generator resolves its own folder with
`os.path.dirname(os.path.abspath(__file__))`, so no code needed editing.

**The privacy check, run before anything was copied.** `cards.json` and `VRAGENSPEL.html` were
grepped case-insensitively for every given and family name involved: **zero occurrences in both**.
The phase-1 brief had claimed this; it was re-verified here rather than inherited, because these
files were about to become public. The brief itself contains names seven times and therefore
**did not move** — `docs/APP_BRIEF.md` is a fresh document with the same requirements and no
personal detail.

**A leak the Stage 5 audit caught, recorded because it nearly shipped.** The deck was clean, but
the *source path* written into this changelog and into `DECISIONS.md` was not: it named the private
folder the files came from, which carried a first name and a birthday date into a public
repository. The card scan would never have found it, because it was in the prose about the move
rather than in the deck. Both references now name only the repository. **A file can be clean while
the sentence describing where it came from is not.**

**What was deliberately not done.** The app. This repository was scaffolded in a chat session,
which cannot open a browser and prove game logic works. `DECISIONS.md` D11; the prompt that starts
the build is `docs/PHASE_2_PROMPT.md`.

**Divergence from the vault framework, recorded not hidden.** This repository uses `CLAUDE.md` as
its authoritative rules file instead of `HOUSE_RULES.md` plus a cloud bootstrap, and it lives
outside the Obsidian vault, so `00 Vault/tools/reconcile.py` never checks it. Both are registered
in `Project Orchestrator/projects/REGISTRY.md`. `DECISIONS.md` D2 and D4.
