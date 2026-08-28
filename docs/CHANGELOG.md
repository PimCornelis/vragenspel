---
type: changelog
project: vragenspel
---

# Changelog

Newest at top. The *why* is the part that matters.

## 2026-08-28 (phase 3, fix) — The dates from testing can be wiped, from the phone

**Asked for after D26.** Putting the deck back together deliberately leaves `gezienOp` alone — the
date each card was last asked, which is what lets an old card say *"Dit vroegen we op ⟨datum⟩"*.
That is right in general, but it left a specific mess: an evening spent scrolling through cards to
test the app stamped 41 of them with that day's date, so in a year they would claim to have been
asked then.

**The menu now has a second button under *Het deck*: *Wis de datums van eerdere keren*.**

**It could not be done from a session, which is the architecture working rather than failing.** The
dates are in `localStorage` on one phone; there is no server and no path from a laptop to that data
(D10, D9). A session can ship the button; only the owner can press it.

**Two buttons, because they cost different things.** *Begin het deck opnieuw* loses nothing.
*Wis de datums* loses something permanently, so it asks first: the confirmation names how many
cards, says which line disappears, and says it cannot be undone, and the button bar becomes
*Ja, wis de datums* / *Nee, laat staan* — the same shape as the memory import's question, so a
question that costs something always looks the same. That is D26's reasoning in the other
direction: a confirmation is spent where something is at stake, which is what keeps the one on the
import worth reading.

**The question is scrolled into view when it appears**, because the menu is long enough that
*Het deck* sits below the fold and the bar turns red either way. A confirmation you can act on
without being able to read it is worse than none. Found by looking at the screen rather than at the
code.

**What it leaves alone:** `gezien`, so the deck keeps its place; the thumbs; and a Tijdcapsule's own
`geschrevenOp`, which is the card's identity rather than a record of it being dealt.

**Verified.** With 41 dates, a thumb up, a thumb down and a sleeping capsule: the button appears,
*Nee* leaves all 41 dates in place and restores the normal bar, *Ja* empties them, reports it,
removes the button and survives a save. `gezien` (41), both thumbs and the capsule's written date
all untouched. The *"Dit vroegen we op 15 januari 2024"* line showed on a card before the wipe and
was gone after it. The confirmation measured on screen: fully inside the viewport. No console
errors; deck untouched. D27.

## 2026-08-28 (phase 3, fix) — The deck can be reset, and its counter stops lying under a filter

**Asked from play:** what does "41 van 158 kaarten gehad" mean, and will those cards come up less
often now?

**The honest answer was worse than "less often".** `deel()` picks from `beschikbaar()` — playable
minus seen — so a card that has been dealt is not dealt **at all** until every other playable card
has gone; only then does `gezien` empty itself and the deck start over. An evening spent scrolling
through cards to test the app therefore locks those cards out for a whole pass through the deck.

**So the menu gained one button: *Begin het deck opnieuw*,** shown only when there is something to
put back. It empties `gezien` and nothing else — not the thumbs, which are verdicts on the deck
rather than on tonight, and not `gezienOp`, the date each card was last asked, which is what lets
an old card say *"Dit vroegen we op ⟨datum⟩"*. Wiping those to fix a counter would be throwing away
memory to tidy a number. No confirmation: nothing is lost, and a confirmation on a harmless action
teaches you to tap through the one on the import, which is not harmless. D26.

**The counter itself was wrong.** It measured `gezien.length`, which holds ids from the whole deck,
against `speelbaar().length`, which is filtered — so narrowing the filter to *Kleine dingen*
produced **"41 van 12 kaarten gehad."** Both numbers now come from the same pool, the one `deel()`
actually works from.

**And it now says what it means**, in a line under it: *"Een kaart die geweest is wordt niet meer
gedeeld tot de rest ook geweest is. Daarna begint het deck vanzelf opnieuw."* The bare number
invited exactly the reading that prompted the question.

**Verified before and after.** Before: 41 seen and the filter on *Kleine dingen* gave "41 van 12".
After, with one card also thumbed down: "41 van 157" unfiltered, "12 van 12" filtered — which
matches `beschikbaar()` being 0 — and after the reset, "0 van 157", the button gone, `gezien`
empty, the thumbs and all 41 dates still there. Dealing then produced six different cards and the
counter climbed with them. No console errors; deck untouched.

## 2026-08-28 (phase 3, fix) — One card could outlive the filter, a new game and every reopen

**Reported from play:** every sitting opened on the same *Kleine dingen* card, and turning that
category off did not shake it loose.

**The cause was one thing in three places.** `stand.huidige` is restored when the app reopens and
when a panel closes. Both routes checked only that the card existed and was not thumbed down —
neither consulted the category filter or the licht/diep dial. And `nieuwSpel()` zeroed the score
without letting go of `huidige`, so *Nieuw spel, punten op nul* handed back the very card, and the
very step, the sitting had just been stopped on. Together that let one card survive a filter
change, a new game and every reopen indefinitely.

**Fixed with one predicate, not three patches.** `magNog(id)` is built on `speelbaar()`, so the
filter, the dial and the thumbs are honoured in exactly one place; both restore routes call it.
`nieuwSpel()` now clears `huidige`. Switching a category off while looking at one of its cards
replaces the card, which is the point rather than a side effect. *Verder spelen* still returns to
the same card, because there it is still allowed. D25.

**A new game keeps `gezien`**, the record of which cards have gone this time round the deck —
resetting it would deal back the cards from ten minutes ago, and the deck already starts over by
itself when it is exhausted (D13). The verdicts stay too, per D16.

**A second defect, found while reproducing the first.** The filter's opening line said *"Tik een
categorie aan als je ergens geen zin in hebt"* — tap what you do **not** want. Tapping selects, and
only selected categories are dealt, which the next line already stated correctly. The instruction
therefore told a player to do the exact opposite of what the button does: tap *Kleine dingen* to be
rid of it and it becomes the only thing dealt. Now: *"Tik aan waar je zin in hebt; dan doen alleen
die mee."* The filter's meaning is unchanged — a list of what plays, not a list of what is banned —
because flipping it would silently invert any filter already saved on the phone.

**Reproduced before it was fixed, and each case checked after.** With card 21 on screen and
*Kleine dingen* excluded: before, *Nieuw spel* left card 21 in place and reopening brought it back;
after, both deal a fresh card from an allowed category, and switching a category off mid-card
replaces it. Unchanged and re-checked: an interrupted sitting still resumes its card, a
thumbed-down card is still not restored, a menu round trip in the middle of a timer still returns
to the same step on the same card, *Verder spelen* still continues the same card, and a fully
retired deck still ends on *"Niets meer te delen"*. No console errors; deck untouched.

## 2026-08-28 (phase 3) — The private layer built: a memory file, cards that sleep, two new flows

**No deck change.** `cards.json` is untouched and `cards.js` was rebuilt and hashed
**byte-identical** to before this session. Everything below is `app.js`, `index.html`, `style.css`.

**Storage is asked to stay, and the answer is shown rather than assumed.**
`navigator.storage.persist()` is called once per load, its answer is remembered, and the menu says
*"Opslag: beschermd"* or *"Opslag: niet beschermd (maak af en toe een back-up)"* — or, where the
browser has no such API, that it says nothing about it. All three paths are guarded; a browser
without the API must not break the page, and does not. D20.

**The memory file — the point of the phase.** One button builds the whole private layer as
`vragenspel-geheugen-YYYY-MM-DD.json` and hands it to the **share sheet**, not to a download.
**One path, shipped, no fallback**: the game is played from a home-screen web app, which is exactly
where an iOS download has nowhere to land and the share sheet is the platform's own *save this
file* gesture. **This was tested on a desktop browser, which has no Web Share API at all — so the
refusal path is proven and the working path is not.** It still needs running on the phone. If it
fails there the fix is to swap the one call, not to add a second route. D22.

**Import replaces, it never merges.** A file is refused out loud in Dutch if it is not ours;
otherwise a confirmation names the back-up's date and what will be overwritten, and only then does
it replace the state. Merging two states is a bug class nobody would find, and the game is played
from one phone (D10). The date of the last back-up sits in the menu, and after two months it says
so — once, quietly. It is stamped only when the share actually completes, so the nudge cannot
report a back-up that was never made.

**Rode vlaggen got its flow, through the existing timer.** Both choose, then a minute each to argue
the other chose wrong, then *"Wie heeft overtuigd?"* and a point — the same clock as *Wat kies je*,
not a second one. **So Rode vlaggen scores**, which takes D16's scoring list from four categories
to five: 74 of 158 cards can now score. D21.

**Mensen kijken got its flow, and deliberately no score.** Rule 12 says *"Er is nooit een goed
antwoord"*, so there is no scoring tap anywhere in it — a category that cannot be scored must not
be asked who won. The *"wees aardig"* line shows on the first Mensen kijken card of a sitting and
not on the rest: said once it is a reminder, said twenty times it is nagging. D21.

**Tijdcapsule — cards that sleep.** Written at the table, with 3 maanden / 6 maanden / 1 jaar /
*verras me* (a day between three months and two years, and the date is not shown, because that is
the whole point of the option). A capsule is not in the deck at all until its date; then it is
dealt marked as a Tijdcapsule, saying when it was written.

**The gate that mattered most.** A Tijdcapsule card has **no promotion path, checked or otherwise**.
The category is defined in `app.js` and deliberately not in `cards.json`, so it cannot be picked
when writing an ordinary draft; capsules carry their own id range; they are filtered out of the
*Wat vonden we ervan* block by id rather than trusted not to appear in it; and the panel says in
Dutch that they are not in the block and never will be. **Only the question and the dates are
stored — never an answer.** Verified: a capsule with a thumbs-up produced a Claude Code block
containing none of its text and none of its id. `CLAUDE.md` hard limit 6, D20, D23.

**Old cards say when they were last asked.** Every card's last-played date is now kept, and a card
dealt more than a year later carries a quiet line above it: *"Dit vroegen we op ⟨datum⟩. Is het
antwoord veranderd?"*

**The light/deep dial is built; the tagging is not committed.** A sitting opens on *Licht / Diep /
Alles*, changeable in the menu. `cards.json` has no `diepte` field yet **on purpose** — which cards
land heavy is the author's call, so the tagging was proposed for correction rather than written.
Until it lands, the dial is not offered at all, because a *Diep* sitting on an unlabelled deck is
an empty deck. Proposal: **28 diep, 130 licht**. D24.

**The menu was rearranged rather than grown.** The four panels moved out of the button bar into a
list inside the menu; six stacked buttons on a phone push the thing you came for off the screen.

**One English string removed.** The file picker's native *"Choose file"* button is hidden behind a
Dutch button — D8 has no exceptions, and that text is one a player reads.

**Verified, at 375px, against stated expectations before each run.** `persist()` returned false on
the test browser and the menu said so, and the answer was stored. Export: filename
`vragenspel-geheugen-2026-08-28.json`, every field of the private layer present under the marker
`vragenspel_geheugen: 1`, and on a browser that cannot share, the Dutch refusal rather than
silence. Import: a foreign file and a broken file each refused in Dutch; a real file confirmed with
its date and counts, then replaced the state exactly, dropped the other sitting's current card, and
kept this phone's storage answer. Rode vlaggen ran end to end through `stapTimers` to a point.
Mensen kijken offered only *Volgende kaart*, with the courtesy line on the first card and not the
second. All four capsule intervals produced the right wake dates (+92, +183, +365, and 396 days for
*verras me*), a sleeping capsule was absent from the playable deck, and a due one dealt correctly
with its written date and no card number. The dial, tested against a temporary tagged build:
130 / 28 / 158 playable. `cards.js` then rebuilt and hashed identical. Existing flows —
*Weet jij dit?*, *Wie van ons?*, plain cards, the result screen — all still correct. No `fetch`
anywhere in the app.

**Not done, and not silently:** the export has not been run on the owner's phone, and the diepte
tagging is a proposal awaiting his corrections.

## 2026-08-28 (later still) — Deck to 158 cards; the private layer fenced before it is built

**Deck.** Two categories added, **Mensen kijken** (20, `#4a5a6b`) and **Rode vlaggen** (20,
`#8a2b2b`), with a rule each appended to the rules card. 118 → **158 cards, 11 categories, 13
rules**. `cards.js` rebuilt. `DECISIONS.md` D19.

**Why these two.** Deck size had become the binding constraint at terrace pacing. *Mensen kijken*
answers come from the room rather than the deck, so the same card plays differently every time —
the only category here with unbounded reuse, and the only one that needs the terrace it is played
on. *Rode vlaggen* is a dilemma in the shape of *Wat kies je*, the best-performing existing
category: both choose, then a minute of arguing. Domestic and comic on purpose, and **about nobody
real** — which is both the privacy rule and the reason they are funny rather than pointed.

**Its courtesy rule is in the rules card, not in a comment.** *Wees aardig: hij hoort het niet,
maar het gaat wel over een echt mens.* A category built on inventing lives for strangers needs
that said once, inside the game.

**The card texts are self-contained**, so the deck ships ahead of the app work — both categories
deal correctly today as ordinary cards.

**The private layer was fenced before a line of it exists**, which is the whole of L20 applied on
purpose rather than after the fact. `CLAUDE.md` gained a **sixth hard limit**: Tijdcapsule cards,
the names, the thumbs and the memory export are facts about two people, they live on the phone and
in an exported file, and there is no path — coded or manual — that moves them into `cards.json`,
into a committed file, or into a session that could reach one. A Tijdcapsule card is **not
promotable to the deck at all**: not "checked more carefully", exempt from D15's promotion path
entirely. `.gitignore` now covers `vragenspel-geheugen*.json`, and `CLAUDE.md` says a session
handed such a file reads what it needs and **quotes nothing** from it. `DECISIONS.md` D20.

**Why a file and not just the browser.** Storage on iOS is best-effort by policy and can be evicted
after a period without interaction — which is precisely the shape of a card designed to sleep for a
year. `navigator.storage.persist()` plus the home-screen web app is the strongest request the
platform allows, and it is still a request. So the file is the record and the phone is the working
copy. Retrieved 2026-08-28: [WebKit storage
policy](https://webkit.org/blog/14403/updates-to-storage-policy/) and [MDN
`persist()`](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist).

**Prepared, not built.** [`PHASE_3_PROMPT.md`](PHASE_3_PROMPT.md) — persistent storage, export and
import of the memory file, the two new category flows, Tijdcapsule cards, and a light/deep dial
whose tagging is proposed for review rather than committed, because which cards land heavy is the
author's call.

**Verified.** 158 unique ids, 1–158 contiguous; `meta.card_count` matches; no card carries an
`answer` key; `--check` reports `cards.js` current; `cards.js` parses as JSON and yields 158 cards;
zero name hits in `cards.json` or `cards.js`.

## 2026-08-28 (later) — Printable deck retired; the brief frozen; a name taken off a public page

**A review session, not a build session.** Nothing about how the app plays changed.

**The printable deck is retired.** `build_vragenspel.py` no longer emits `VRAGENSPEL.html`; the
layout templates are deleted and the script went from 300 lines to 140. `cards.json` → `cards.js`
is the only build output now. **Why now:** the entry below left the paper rules card teaching
*"Eerst gokken"* and one refusal per evening, which the app has not done since the entry beneath
that. A known inconsistency is fine in a document and is a defect in a deck someone reads aloud at
a table. Pim's call. `DECISIONS.md` D17.

**Evidence it broke nothing.** `cards.js` was copied before the rewrite and compared after:
**byte-identical**. The deck the app loads did not move. `VRAGENSPEL.html` is in `_to_delete/`
rather than deleted — Claude cannot delete in a connected folder — and `_to_delete/` is gitignored.

**`APP_BRIEF.md` is now marked HISTORY, and superseded passages are marked where they are
written.** The top banner was correct and complete, and three sections below it the body still read
*"The gate is the product… build that first"* as a live requirement. A reader absorbs a requirement
where it is written, not where it is corrected. Six passages now carry `[SUPERSEDED — D13]` or
similar at the line. **It was not rewritten into agreement** — the argument in its own banner for
keeping it as evidence is right, and is now `DECISIONS.md` D18 with a matching rule in `CLAUDE.md`.
`CLAUDE.md` also now names itself and `DECISIONS.md` as the current requirements.

**A name came off a public page.** `CLAUDE.md` said *"Pim is a mechanical engineer, not a software
engineer — he will not debug this."* True, written in a private planning session, and then
published under his own GitHub handle. It now reads *"the owner"*, as do the two other mentions in
that file. **`docs/` keeps his name**: the changelog and decisions are the record of who decided
what, and editing the record to tidy it is worse than the exposure. Julie's name remains at zero
everywhere, which is the invariant that actually matters.

**Verified after all of it.** `build_vragenspel.py --check` reports `cards.js` current; zero of the
118 card texts appear in `app.js`, `index.html` or `style.css`; the app makes no network call of
any kind; `card_feedback.local.json` is absent from `.git/index`; and the name scan over every file
in the repository returns zero for every name except the owner's own GitHub handle in his own URLs.

**Not done, and named rather than left implied.** The app still has no way to save the feedback
block to a file — Pim asked for a save option and it is app work, so it belongs in a Claude Code
session, not here. And there are still no swipe gestures.

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
