---
type: changelog
project: vragenspel
---

# Changelog

Newest at top. The *why* is the part that matters.

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
