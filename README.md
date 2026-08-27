# Vragenspel

A Dutch question deck for two people — 118 cards in 9 categories — in two forms that share one
source of truth: a printable paper deck, and a browser app for the phone.

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
| `build_vragenspel.py` | Regenerates the printable page from `cards.json` |
| `build_vragenspel.bat` | Double-click launcher for the above; writes `build_log.txt` beside it |
| `VRAGENSPEL.html` | The printable deck. **Generated — do not edit by hand** |
| `CLAUDE.md` | Rules for any Claude Code session working in this repo |
| `docs/` | Decisions, changelog, and the brief for the browser app |

## Printing

Open `VRAGENSPEL.html` in a browser and press Ctrl + P. The rules card and the 118 numbered cards
print; the design briefing at the top does not.

## The browser app

Not built yet. What it must do that paper cannot, and why, is in
[`docs/APP_BRIEF.md`](docs/APP_BRIEF.md).

## Tech

Vanilla HTML, CSS and JavaScript. No framework, no build step, no dependencies, no server, no
accounts, no analytics. Python 3 is needed only to regenerate the printable page.
