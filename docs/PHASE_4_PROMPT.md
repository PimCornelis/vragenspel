---
type: handoff
subject: Phase 4 — strip the game mechanics, keep the card
status: scoped 2026-10-22, nothing built. Decisions below are the owner's, taken in writing
written: 2026-10-22
scoped_in: a Date-day Assistant session, which is why no code was touched
---

# Phase 4 — strip the game mechanics

**The owner asked for this on 2026-10-22, in these words:**

> Uit het vragenspel wil ik eigenlijk alle spelelementen verwijderen. Hiermee bedoel ik de
> aanwijstimers en dergelijke. Ik wil terug naar de basis van een kaart per categorie, waar de
> speler zelf de kaarten voorleest en de app alleen de kaart laat zien. Ik wil alleen drie opties:
> Punt voor speler A, punt voor speler B en overslaan. Mooie kaart en niet meer tonen mogen
> blijven.

**This was scoped in a Date-day Assistant session, which is the wrong place to change this code** —
that session loads a different project's rules, and `CLAUDE.md` here requires reading
[`DECISIONS.md`](DECISIONS.md) before a structural change. So the scoping was done there and the
work was left here. Nothing in `app.js`, `style.css`, `index.html` or `cards.json` has been
touched.

## The four questions that were ambiguous, and the owner's answers

Asked and answered 2026-10-22. **Do not re-open these; build them.**

| Question | Answer |
| --- | --- |
| What does "een kaart per categorie" mean? | **One card at a time from the whole deck.** The category stays as the label on the card, and the existing *"Waar heb je zin in?"* filter keeps deciding which categories play. No rotation, no choosing a category per card |
| Does a score still run? | **Yes, and the end screen stays.** The running score in the top bar, *Stoppen*, and the result screen with the dove and the winner all stay exactly as they are. Only the route to a point gets shorter |
| What happens to the six categories that had their own flow? | **Their instruction is shown as a quiet line of text on the card.** The app stops executing it; the players run it themselves. The rule does not disappear from the screen, it stops being machinery |
| Do Tijdcapsule and the light/deep dial survive? | **Both stay.** Neither is a game mechanic. Tijdcapsule is D20 and D23; the dial is D24 |

## What the card does after this change

1. The card appears: category tag, the quiet `eerder` lines, the question, the number.
2. If the category has an instruction, it appears as a short list under the question, in the
   existing `extra` section.
3. One of the players reads it aloud. **The app does nothing else.**
4. The footer offers exactly three actions and two thumbs.

## The footer — three actions, and they are the only ones

| Button | What it does |
| --- | --- |
| *(name of player 1)* | A point for player 1, then **straight to the next card** |
| *(name of player 2)* | A point for player 2, then straight to the next card |
| **Overslaan** | No point, straight to the next card |

Plus the two thumbs that are already there and do not change: **Mooie kaart** (`T.duimOp`) and
**Niet meer tonen** (`T.duimNeer`), both via `wisselDuim`.

**Three things to know about that table.**

- **"Overslaan" does not exist yet.** Zero occurrences of the word in `app.js`, `style.css`,
  `index.html` and `cards.json`, checked 2026-10-22. It is a new button, not a surviving one.
  It must award no point and it must not retire the card — retiring is what the thumb is for.
- **The point buttons already read as the bare player name**, not *"Punt voor X"* —
  `puntKnoppen` builds them from `naamVan(speler)`, which defaults to *Speler 1* / *Speler 2*.
  Keep the bare name: it is shorter on a phone and it already works. The owner described the
  function, not the label. **If he wants the longer label, he will say so.**
- **The confirmation step goes.** Today a point opens `stapPuntGegeven`, which says
  *"Een punt voor X."* and then needs a second tap on *Volgende kaart*. That is one tap too many
  for "the app only shows the card". **A point should deal the next card immediately.** This is the
  one call in this brief that the owner did not make explicitly — flag it when handing over, and it
  is cheap to put back.

## What gets removed

Call sites were checked one function at a time on 2026-10-22, and every one of these is reachable
**only** from code in this list. **Confirm each before deleting anyway** — `app.js` is 71 kB and
this was a targeted read, not a full one.

**The clock, and everything it drives**

- `TIMER_SECONDEN` (60), `stapTimers`, `startKlok`, `tekenKlok`, `klokTekst`, `stopKlok`,
  `klokAfgelopen`, `volgendeSpeler`
- `piep` — called only from `klokAfgelopen`
- `trilling` — called only from the *Wie van ons?* countdown and from `klokAfgelopen`

**The per-category flows**

- `stapKiezen` (*Wat kies je*, *Onenigheid*, *Rode vlaggen* — the minute each)
- `stapMensen` (*Mensen kijken*)
- `stapWieAftellen`, `stapWieUitslag`, `stapWieRaak`, `stapWieMis` (*Wie van ons?* — point on three)
- `stapWeetWie`, `stapWeetNiemand` (*Weet jij dit?*)
- `stapOvertuigd`, `stapGeenPunt`
- `geefPuntAllebei` — called only from the *Wie van ons?* match, and there is no "both get a point"
  button any more
- `stapPuntGegeven` and its `puntSpeler` variable, per the decision above

**The machinery that held them together**

- `KAARTSTAPPEN` (built at the bottom of the file) collapses to `[stapKaart]`.
  **`toonDuimen` guards on `KAARTSTAPPEN.indexOf(stapNu) === -1`** — check that the thumbs still
  appear once the table has one entry.
- `stapKaart`'s five-way branch on `soortVan` goes. What replaces it is in the next section.
- `puntKnoppen(extraKnop)` becomes a fixed three-button footer.

**Two functions that must NOT be removed although their callers disappear**

- **`toonExtraLijst(kop, regels)` stays and gets reused.** Today it is called only from the flows
  being deleted. It is exactly the renderer the instruction line needs, so repoint it instead of
  deleting it. No new rendering code is required for this change.
- **`toonExtraTekst` stays.** It has a surviving caller: the empty-deck message
  (`T.leegFilter` / `T.leegAlles`).

## The instruction line — the Dutch already exists

**Do not add a field to `cards.json` and do not touch its `rules` array.** Two reasons, both
checked:

1. **The app never reads `cards.json`'s rules.** No reference to them anywhere in `app.js` or
   `cards.js`. Those 13 rules were for the printable deck, which is retired (D17), and six of them
   still describe the older game — the guess step, the refusal, the minute. Putting that prose on a
   card would show the player a mechanic that no longer exists.
2. **`soortVan` already maps each category to a key, and the Dutch per category is already in
   `T`.** It was written for the app, not for the rulebook. Keep `soortVan`; it stops selecting a
   flow and starts selecting an instruction.

What is in `T` today, and what the card should show:

| Category | Heading | Lines, after the minute is taken out |
| --- | --- | --- |
| *Wat kies je* | `T.kiesKop` — "Allebei kiezen" | "Zeg het tegelijk, geen slagen om de arm." |
| *Rode vlaggen* | `T.vlaggenKop` — "Ieder één van de twee" | "Welke zou je nog kunnen verdragen?" |
| *Onenigheid* | `T.onenigheidKop` — "Ieder een kant" | "Ook als je het er eigenlijk mee eens bent." |
| *Mensen kijken* | `T.mensenKop` — "Allebei raden" | "Tegelijk, hardop, over iemand die je ziet." · "Er is nooit een goed antwoord." |
| *Wie van ons?* | — | `T.wieWijzen` — "Aanwijzen op drie" |
| *Weet jij dit?* | — | **nothing yet; see below** |
| the other five | — | nothing. A bare card |

**Three of those lists end in a sentence about the minute** — `T.kiesRegels` and `T.vlaggenRegels`
close with *"Daarna één minuut om de ander te overtuigen…"* and `T.onenigheidRegels` with
*"Één minuut per persoon."* **Drop those closing sentences and keep the rest.** The remaining lines
stand on their own, and dropping a sentence needs no new Dutch written, which is the surgical
option. Do not rewrite the sentences that stay — hard limit 5 is about card text, but the author's
Dutch is the author's everywhere.

## Two things the owner still has to decide, and they are both Dutch

Do not invent either of these. Ask, build the rest, and leave them for a follow-up if no answer
comes.

1. **What, if anything, a *Weet jij dit?* card says.** There is a `T.weetKop` ("Wie wist het?") but
   no instruction line, and the old flow carried the meaning. With three uniform buttons, *"Punt
   voor A"* already **is** the self-report, so the honest default is **no line at all**. If he wants
   one, something like *"Eén goed antwoord."* — but that sentence is his to write, not this
   session's. **No answer is ever stored either way** (hard limit 2, D7).
2. **Whether *Mensen kijken* may now score.** **D21 says it deliberately does not.** Three uniform
   buttons give it a score by default, because uniformity is the whole point of this change.
   Recommendation: let it score and record that D21 is superseded on this point. **If he wants the
   exception kept, that is a fourth code path and it should be his explicit call, not a quiet one.**

## Bookkeeping this change owes

- **A new decision, `D29`.** D28 is the highest in [`DECISIONS.md`](DECISIONS.md) as of
  2026-10-22 — D28 is the twenty cards added that day, not this change. It must say what was
  removed, that the owner asked for it, and that **D21 is
  superseded on whether *Mensen kijken* scores**. Check D13 and D16 while writing it: the sitting
  and the score both survive, so they are probably untouched, but read them rather than assuming.
- **Annotate, never rewrite.** Per D18, any passage in [`APP_BRIEF.md`](APP_BRIEF.md) that argues
  for the timers or the per-category flows gets `[SUPERSEDED — D29]` **at the line**. A banner at
  the top is not enough.
- **A changelog entry** in [`CHANGELOG.md`](CHANGELOG.md), newest at top, with the *why*.
- **The commit summary and description**, ready to paste into GitHub Desktop. Never run git here.
- **Regenerate nothing.** `cards.json` does not change, so `cards.js` does not change and the build
  does not need to run. If you find yourself running it, something in this brief was misread.

## Out of scope

- **The deck.** No cards added, removed, renumbered or reworded. `build_vragenspel.py` still
  refuses a gap in the ids, and renumbering would silently repoint everything the phone remembers.
- **Tijdcapsule, the light/deep dial, the filter, the menu, the memory file, the verdict block.**
  All stay as they are.
- **`fetch`.** Settled in D12 and must not appear.

## How to know it worked

State the expected result before running each check, then compare — `CLAUDE.md`, "verify before
declaring done".

1. **At 390 px wide**, a card shows: category, question, number, and for the six categories above a
   short instruction under the question. The footer shows **exactly three buttons and two thumbs**,
   and nothing else.
2. **Tap a point button.** The score in the top bar goes up by one and the **next card appears
   immediately** — no intermediate screen, no second tap.
3. **Tap Overslaan.** The next card appears, the score does not move, and the skipped card is not
   in *Niet meer tonen*.
4. **Deal a card from each of the eleven categories.** No timer, no countdown, no beep, no
   vibration, and no screen that asks who pointed at whom.
5. **`grep -c` for `TIMER_SECONDEN`, `startKlok`, `piep`, `trilling`, `stapWieAftellen` and
   `geefPuntAllebei` in `app.js`.** Expected: zero for every one of them.
6. **Stoppen still works** and the result screen still names a winner.
7. **Tijdcapsule and the light/deep dial still open and still work.**
