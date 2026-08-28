# Vragenspel

A Dutch question deck for two people — 158 cards in 11 categories — played on a phone at a table.
One card at a time, no accounts, no server, nothing leaves the browser.

## The mechanic

It is not a quiz. The point is the guess that comes before the answer.

1. Draw a card and read it aloud.
2. **The drawer first guesses what the other will answer.** Out loud, no hedging.
3. **Then the real answer** — and not in one sentence.
4. **Exactly one follow-up question** is allowed per answer.
5. Once per evening either player may refuse a card, without explaining.

Four categories replace step 2 with their own rule: **Wat kies je** (both choose, then one minute
to argue the other is wrong), **Wie van ons?** (point at three, simultaneously), **Weet jij dit?**
(one right answer — right is a point, wrong is a short silence), **Onenigheid** (pick a side even
if you agree, one minute each).

## Categories

| Category | Cards |
| --- | --- |
| Mensen kijken | 20 |
| Rode vlaggen | 20 |
| Vroeger | 20 |
| Wat kies je | 20 |
| Kleine dingen | 12 |
| Verhalen | 12 |
| Weet jij dit? | 12 |
| Wie van ons? | 12 |
| Wij | 12 |
| Onenigheid | 10 |
| Wat als | 8 |

## No answers are stored

*Weet jij dit?* cards have a correct answer, and it lives in a person's head — never in this
repository. "Wat is mijn schoenmaat?" has no stored answer and never will. Scoring is
self-reported.

## Files

| File | Purpose |
| --- | --- |
| `cards.json` | The deck. **The only editable copy** — everything else is generated from it |
| `build_vragenspel.py` | Regenerates `cards.js` from `cards.json` |
| `build_vragenspel.bat` | Double-click launcher for the above; writes `build_log.txt` beside it |
| `cards.js` | The deck for the app. **Generated — do not edit by hand** |
| `index.html`, `style.css`, `app.js` | The browser app |
| `card_feedback.local.json` | What we thought of the cards. **Gitignored — never published** |
| `CLAUDE.md` | Rules for any Claude Code session working in this repo |
| `docs/` | Decisions, changelog, and the brief for the browser app |

## The printable deck was retired

Until 2026-08-28 the same `cards.json` also produced a printable paper deck. It was retired because
the app and the paper deck had drifted into describing two different games — the paper rules card
still taught a guess-first game the app no longer plays. One game, one place. See
[`docs/DECISIONS.md`](docs/DECISIONS.md) D17.

## The browser app

Open `index.html` — by double-clicking it, or from the hosted site. Both work: the deck is loaded
from the generated `cards.js`, because a page opened over `file://` may not `fetch()` a `.json`
file beside it.

**It plays a sitting, not an evening.** One card fills the screen, the background takes the
category's colour, and the next card is one tap away. It deals without repeating until the deck
has been all the way round, then quietly starts over.

**There is a score.** The categories whose rules already have a winner — *Weet jij dit?*,
*Wat kies je*, *Wie van ons?* and *Onenigheid* — hand out a point; the other five are just
conversation. Stop whenever you like and the app says who won. **Both players can type their name
in the menu; names are kept on the phone and appear in no file in this repository.**

**The app plays a different game from the paper deck.** There is no guess step and no refusal —
the printed rules card still describes both. That is deliberate and recorded in
[`docs/DECISIONS.md`](docs/DECISIONS.md) D13.

While you play you review the deck. **Mooie kaart** marks one of the good ones; **niet meer tonen**
retires a card and it is never dealt again. Both can be undone under *Wat vonden we ervan*, which
also produces a block of text to hand to a Claude Code session — that is how the verdicts reach
the laptop, since there is no server between the phone and it. They land in
`card_feedback.local.json`, which is **not committed**: which questions a couple loved is nobody
else's business and this repository is public.

You can also write a card in the menu. New cards play at once but are **drafts** — they are not in
`cards.json` until a session puts them there and the build is run, because `cards.json` stays the
only editable copy of the deck.

It also runs the two one-minute timers and can filter by category. State lives in the browser's
`localStorage`, so **play from one phone** — two phones means two decks that drift apart on the
first evening.

The original argument for building it is in [`docs/APP_BRIEF.md`](docs/APP_BRIEF.md); read its
header first, because the pacing it specifies has since been replaced.

## Tech

Vanilla HTML, CSS and JavaScript. No framework, no build step, no dependencies, no server, no
accounts, no analytics. Python 3 is needed only to regenerate `cards.js` after editing the deck.
