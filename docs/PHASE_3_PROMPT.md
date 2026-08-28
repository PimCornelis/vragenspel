---
type: handoff
project: vragenspel
subject: The opening prompt for the phase-3 build
since: 2026-08-28
---

# Phase 3 — durability, the private memory, and the two new categories

**Open Claude Code in `C:\Users\Pim_C\Claude Code\vragenspel`** — not in any vault folder — and
paste everything between the markers, or just say *"read docs/PHASE_3_PROMPT.md and follow it."*

**The deck work is already done.** `cards.json` is at **158 cards / 11 categories / 13 rules**:
*Mensen kijken* (20) and *Rode vlaggen* (20) were added on 2026-08-28 and `cards.js` is rebuilt.
They deal today as ordinary cards. Phase 3 gives them their own flow — it does not add them.

<!-- PASTE FROM HERE -->

```
FIRST, BEFORE ANYTHING ELSE: confirm you are in the right repo. The working directory must
contain cards.json, CLAUDE.md, index.html and app.js. If any is missing you are in the wrong
folder — say so and stop. Do not adapt and do not create the missing files.

PHASE 3. CLAUDE.md is already loaded; its SIX hard limits apply to everything below, and limit 6
(the private layer never crosses into this repository) is the one that governs most of this job.
Read docs/DECISIONS.md D19 and D20 before writing any code.

Do these in order and show me the result of each before starting the next.

1. PERSISTENT STORAGE. Call navigator.storage.persist() on load, once, and remember what it
   returned. Show the answer in the menu in Dutch — something like "Opslag: beschermd" or
   "Opslag: niet beschermd (maak af en toe een back-up)". I play from a home-screen web app on
   my phone, which is the strongest signal WebKit uses when granting the request, so I want to
   SEE whether it was granted rather than assume it. Guard the whole thing in try/catch: some
   browsers do not have the API at all and that must not break the page.

2. EXPORT AND IMPORT A MEMORY FILE. This is the point of the phase — everything else rests on it.

   EXPORT: one button that writes the whole private layer to a file named
   vragenspel-geheugen-YYYY-MM-DD.json — seen cards with the date each was last played, thumbs,
   own cards, Tijdcapsule cards, names, score. Build it as a Blob and offer it as a download.
   THEN TEST IT ON MY PHONE from the home-screen app, not only in a desktop browser: iOS
   downloads from a standalone web app are exactly the thing that works in theory and not in
   practice. If it fails there, switch to navigator.share() with a file so it can go to Files or
   Notes. PICK ONE AND SHIP ONE — do not leave both paths in the code (CLAUDE.md, "one correct
   path, no fallbacks"). Tell me which you picked and what the phone actually did.

   IMPORT: a file input that reads such a file back and REPLACES the stored state, behind a
   confirmation that says in Dutch what is about to be overwritten. Replace, not merge — we play
   from one phone and a merge is bugs I would never find. Refuse a file that is not one of ours,
   with a readable Dutch message rather than a silent failure.

   NUDGE: the menu shows the date of the last export, and if it is more than two months ago it
   says so, once, quietly. No notifications, no badge, no streak.

3. RODE VLAGGEN — its own flow. Every card is "wat is erger: X of Y". Both choose, then one
   minute each to argue the other chose wrong. Reuse the Wat kies je timer; do not write a second
   one. Rule 13 in cards.json is the text.

4. MENSEN KIJKEN — its own flow. Both guess out loud at the same time about someone in the room,
   then compare. There is NEVER a right answer, so this category scores nothing and must not
   offer a scoring tap. Rule 12 in cards.json is the text; show its "wees aardig" line on the
   first Mensen kijken card of each sitting and not on every one.

5. TIJDCAPSULE — cards that sleep. A new kind of card I write at the table, for instance "Wat
   aten we het meest in Puglia?" or "Wat gebeurde er die nacht in Thailand?". When I write one I
   choose when it may come back: 3 maanden, 6 maanden, 1 jaar, or "verras me" (pick something
   between three months and two years). It is NOT dealt before then. When it comes due it is
   marked as a Tijdcapsule and says when it was written.

   THE HARD PART, AND IT IS NOT NEGOTIABLE: a Tijdcapsule card is about two real people. It lives
   in localStorage and in the export file and NOWHERE ELSE. There is no promote-to-deck path for
   it — the panel that lets an ordinary written card be promoted into cards.json must refuse a
   Tijdcapsule card, and say why in Dutch. Store the question and the dates. Never an answer.
   CLAUDE.md hard limit 6 and DECISIONS.md D20.

   Also: when any card is dealt that has been played before, and the last time was more than a
   year ago, show a quiet line above it — "Dit vroegen we op <datum>. Is het antwoord veranderd?"
   That needs only the date per card id, which step 2 already stores.

6. DIEPTE — the light/deep dial. Add a "diepte" field of "licht" or "diep" to every card in
   cards.json, and open a sitting with a choice: licht, diep, or alles. DO NOT COMMIT YOUR
   TAGGING. Propose it to me as a list grouped by category and let me correct it first — the
   cards are mine and which ones land heavy is my call, not yours. Once I have agreed the list,
   write it into cards.json and rebuild.

Rules for the whole job:
- Every word a player sees is Dutch. Everything only I read can be English.
- Before each check you run, say in plain words what correct output would look like, then compare.
- Test on a phone-width screen, and for step 2 on my actual phone.
- Nothing new may reach the network. No dependency, no CDN, no build step.
- Do not run git. Write the commit summary and description for me to paste into GitHub Desktop.
- Log what changed and why in docs/CHANGELOG.md, newest at top, and add decisions to
  docs/DECISIONS.md for anything you chose that I did not specify.
- If a change reverses something docs/APP_BRIEF.md argues for, mark that passage at the line.
```

<!-- PASTE UNTIL HERE -->

## What is deliberately not in this prompt

- **Swipe gestures.** Still missing, still wanted, but they need real pointer testing on a phone
  and they are not what this phase is about.
- **A second phone.** The export file is the mechanism if that ever matters; the ergonomics can
  wait until it does. (`DECISIONS.md` D10, D20)
- **More cards.** The next batch gets written from `card_feedback.local.json` — from what the
  thumbs actually say — rather than from imagination.
