---
type: brief
project: vragenspel
subject: What the browser app was built to do, and why — the 2026-08-27 brief, frozen
since: 2026-08-27
status: HISTORY. Not the current requirements. See ../CLAUDE.md and DECISIONS.md
---

# The browser app — the original brief, kept as history

> **This is not the current specification. It is the argument that was made on 2026-08-27,
> frozen.** For what the app must do *now*, read [`../CLAUDE.md`](../CLAUDE.md) and
> [`DECISIONS.md`](DECISIONS.md). Every superseded passage below is marked at the line it
> appears on, so nothing here can be absorbed as a live requirement before the banner is
> reached.
>
> **Parts of this brief are out of date, on purpose.**
>
> The app was built to this brief on 2026-08-27 and changed the night after. It is now a
> **sitting** — cards deal continuously at a terrace — rather than one card a night, and **the
> gate is gone**. Reason 1 below, the requirement that the gate is the product, and the "one card
> a night" rhythm no longer describe the app. `docs/DECISIONS.md` **D13** records what replaced
> them and what that cost.
>
> The rest of this document still holds: what the four special categories need, no answers stored,
> phone first, Dutch throughout, `cards.json` as the single source of truth. The section
> "Extra cards, when they come" now argues the wrong way round — see D13's second cost.
>
> It is kept rather than rewritten because a brief that is edited to agree with what was built
> stops being evidence of what was decided and why.

The paper deck works. This document is the argument for building a second form of it, and the
requirements that followed. **Do not build from it. Build from `CLAUDE.md` and `DECISIONS.md`.**

## Why an app at all — ranked

The first reason alone justifies the project. The rest are conveniences.

1. **[SUPERSEDED — D13. The gate was built, then removed the next night.]**
   **Hide the second half of the card until the guess is made.** On paper the question and the
   instruction to guess sit in front of both players at once, so everyone skips straight to
   answering. The app can gate it: show the question, take the guess, *then* reveal.
   **The deck's central mechanic is currently on the honour system. This is the fix, and it is
   the only thing paper cannot do at all.**
2. **[PARTLY SUPERSEDED — D13. Still true that it deals without repeating; "across months" is
   not, the pacing is now a sitting.]** Remember where you are. One card a night at dinner makes
   118 cards about four months. On paper that needs someone to remember which cards are spent. The app knows it
   is a new day and deals the next unseen card.
3. **Run the timers.** *Wat kies je* and *Onenigheid* both specify one minute per person, and
   nobody is going to hold a phone stopwatch mid-argument.
4. **[SUPERSEDED — D13. There is no refusal limit in the app; a card is retired instead.]**
   Count the refusals. One refusal per evening per player is currently enforced by honesty.
5. **Filter by category**, for the evenings when nobody wants a dilemma.

## Requirements

- **[SUPERSEDED — D13]** ~~The gate is the product. If the reveal is not gated, the app is a
  worse version of paper. Build that first and prove it before anything else.~~
- **[SUPERSEDED — D13]** ~~One card a night is the default rhythm, not a deck to burn through.
  The app should make dealing a second card possible and slightly deliberate.~~
- **[SUPERSEDED — D19, D21. There are six such categories now, not four: *Mensen kijken* and
  *Rode vlaggen* were added on 2026-08-28 and have their own flows too. And they do not "replace
  the guess step", because there is no guess step any more — D13.]**
  **The four categories with their own rules** — *Wat kies je*, *Wie van ons?*, *Weet jij dit?*,
  *Onenigheid* — replace the guess step. Their card flow differs and the app must respect it.
- **Self-reported scoring only.** For *Weet jij dit?* the app asks whether that was right and
  takes the answer. It never holds the answer itself.
- **Phone first.** One hand, at a dinner table, at that screen width.
- **Dutch for every word a player sees.**

## Constraints that are not negotiable

They are stated in full in [`../CLAUDE.md`](../CLAUDE.md); the ones that shape the app's
architecture are:

- **`cards.json` is the single source of truth.** The app reads the deck; it never carries its own
  copy of it. This is the whole reason the deck was extracted from the printable page.
- **No answers stored, ever.**
- **No accounts, no server, no analytics, no third-party services.** State belongs in the browser.
- **Vanilla HTML, CSS and JavaScript.** No framework, no build step, no CDN script.

## One thing to decide deliberately in phase 2

**[DECIDED 2026-08-27 — `cards.js` is generated and loaded with a `<script>` tag; `fetch` does not
appear in the app. D12.]**

**`file://` blocks `fetch()`.** If `index.html` loads `cards.json` with `fetch`, the hosted site
works and double-clicking the file locally does not. Either accept that the app is only ever
opened from its URL, or generate a `cards.js` from `cards.json` in `build_vragenspel.py` so both
work — which keeps one editable copy and adds one generated one, the same shape as the printable
page. **Pick one, write down which, and do not leave both paths in the code.**

## Extra cards, when they come

**[SUPERSEDED — D13. This now points the wrong way: at terrace pacing 118 cards is five or six
sittings, and every retired card shrinks it. Deck size is the binding constraint, not a risk.]**

**Length is not free.** 118 cards is already about four months of one a night. Doubling it does
not double the value; it makes the good cards rarer. **New categories that only work on a screen**
— a card with a timer, a card that deals a second card, a card that asks for a photo — are worth
more than another forty questions.

New cards are written where the players are known, not here, and land in `cards.json`.
