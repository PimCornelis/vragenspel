---
type: handoff
project: vragenspel
subject: The opening prompt for the phase-2 build
since: 2026-08-27
---

# Phase 2 — the prompt to paste into Claude Code

Open Claude Code in `C:\Users\Pim_C\Claude Code\vragenspel` and paste everything between the
markers. **`CLAUDE.md` loads automatically** — the prompt does not repeat what is already in it.

**Do not paste the prose around the markers.** It is for the reader, not for Claude.

<!-- PASTE FROM HERE -->

```
PHASE 2 — build the browser app. Read docs/APP_BRIEF.md first; CLAUDE.md is already loaded and
its five hard limits apply to everything below.

Build index.html, style.css and app.js in this folder. Vanilla only — no framework, no build
step, no CDN script, no npm.

Order matters. Do these in sequence and show me the result of each before starting the next:

1. THE GATE, and nothing else. A card appears showing only its category and question. A button
   says the guess has been made. Only then does the rest of the card appear. Prove it works on a
   phone-width screen — take a screenshot at 390px wide and show it to me. This step alone is the
   reason the app exists; if it is not right, nothing after it matters.

2. THE DECK. Read cards.json. Do not inline the cards into the JavaScript, and do not create a
   second editable copy of them. Decide the file:// question in docs/APP_BRIEF.md deliberately,
   tell me which way you went and why, and leave only one path in the code.

3. ONE CARD A NIGHT. localStorage remembers which card ids are spent and what date it is. A new
   day deals the next unseen card. Dealing a second card the same evening is possible but takes a
   deliberate second tap.

4. THE FOUR SPECIAL CATEGORIES. Wat kies je, Wie van ons?, Weet jij dit? and Onenigheid replace
   the guess step with their own flow — read the rules in cards.json. Weet jij dit? asks "klopt
   dat?" and takes the player's word. No answer is ever stored.

5. THE TIMERS. One minute per person for Wat kies je and Onenigheid. It must be startable with
   one thumb without looking.

6. THE REFUSALS. One per evening per player, counted, reset the next day.

7. CATEGORY FILTER. Off by default.

Rules for the whole job:
- Every word a player sees is Dutch. Everything only I read can be English.
- Before each check you run, say in plain words what correct output would look like, then compare.
- Tell me what you executed and what you did not.
- Do not run git. Write the commit summary and description for me to paste into GitHub Desktop.
- Log what changed and why in docs/CHANGELOG.md, newest at top.
```

<!-- PASTE UNTIL HERE -->

## Before the first play

Publishing is Pim's, not Claude's. On GitHub: **Settings → Pages → Source: Deploy from a branch →
`main` / root.** The site appears at `https://pimcornelis.github.io/vragenspel/` a minute or two
later. It is world-readable at that URL whatever the repository's privacy setting — the reasoning
and the check that made that acceptable are in [`DECISIONS.md`](DECISIONS.md) D5.
