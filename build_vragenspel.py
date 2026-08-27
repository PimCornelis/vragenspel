"""
build_vragenspel.py - regenerate the printable deck from cards.json.

    cards.json  ->  VRAGENSPEL.html

cards.json is the single source of truth for the deck. This script owns the printable
LAYOUT only: the stylesheet, the English briefing (which does not print), and the shape
of one card. It owns none of the deck's content. To change a question, a category colour
or a rule, edit cards.json and run this again. Never hand-edit VRAGENSPEL.html - the next
run overwrites it.

Run it by double-clicking build_vragenspel.bat, which sits beside this file.
Nothing here reaches the network, and nothing here runs git.

Usage:
    python build_vragenspel.py            write VRAGENSPEL.html
    python build_vragenspel.py --check    write nothing, say whether it is up to date
"""

import io
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "cards.json")
OUT = os.path.join(HERE, "VRAGENSPEL.html")

# --------------------------------------------------------------------------
# The printable page, minus the deck. {{CARD_COUNT}} is filled in from the data,
# so the printed count cannot drift from the number of cards actually in the file.
# --------------------------------------------------------------------------

HEAD = """<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="utf-8">
<title>Vragenspel — {{CARD_COUNT}} kaarten</title>
<style>
  :root{--ink:#1e2330;--muted:#5d6672;--line:#cfd5dd;--paper:#fdfdfb}
  *{box-sizing:border-box}
  body{margin:0;padding:28px;background:#e9ecef;color:var(--ink);
    font-family:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;line-height:1.45}
  .sheet{max-width:900px;margin:0 auto}
  .briefing{background:var(--paper);border:1px solid var(--line);border-radius:10px;
    padding:26px 30px;margin-bottom:28px}
  .briefing h1{font-size:1.45rem;margin:0 0 4px}
  .briefing .sub{color:var(--muted);font-size:.93rem;margin-bottom:18px}
  .briefing h2{font-size:.95rem;letter-spacing:.06em;text-transform:uppercase;color:#2b4a6b;
    margin:20px 0 6px}
  .briefing ol,.briefing ul{margin:6px 0 0;padding-left:20px}
  .briefing li{margin-bottom:6px}

  .rules{background:var(--paper);border:2px solid #2b4a6b;border-radius:10px;padding:24px 28px;
    margin-bottom:22px;page-break-after:always}
  .rules h2{margin:0 0 12px;font-size:1.3rem}
  .rules ol{padding-left:20px;margin:0}
  .rules li{margin-bottom:9px}

  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
  .c{background:var(--paper);border:1px solid var(--line);border-top:4px solid var(--cc);
    border-radius:7px;padding:14px 15px 26px;position:relative;min-height:118px;
    page-break-inside:avoid;break-inside:avoid}
  .tag{font-family:system-ui,sans-serif;font-size:.58rem;letter-spacing:.14em;
    text-transform:uppercase;color:var(--cc);margin-bottom:7px}
  .q{font-size:.93rem}
  .no{position:absolute;bottom:8px;right:12px;font-family:system-ui,sans-serif;
    font-size:.6rem;color:#a8b0ba}

  @media print{
    body{background:#fff;padding:0}
    .briefing{display:none}
    .grid{gap:0}
    .c{border-radius:0;border:1px dashed #999;border-top:3px solid var(--cc);min-height:112px}
  }
</style>
</head>
<body>
<div class="sheet">

<div class="briefing">
  <h1>Vragenspel — {{CARD_COUNT}} kaarten</h1>
  <div class="sub">Built for the Date-day Assistant project · 2026-08-14 · dilemmas 2026-08-15 · trivia, wie-van-ons and onenigheid 2026-08-24 · Dutch, printable</div>

  <h2>What this is, and what it deliberately isn't</h2>
  <p>You asked for trivia about the two of you, but what you described is a different game:
  <em>discovering</em> things you don't already know. Real trivia needs answers one of you already
  has. So this deck does both — <strong>the other person guesses your answer first, then you
  actually answer.</strong> The guess is the trivia; the answer is the discovery; the gap between
  them is where the conversation is.</p>

  <h2>What's excluded, on purpose</h2>
  <p>No "what's your biggest fear", no "when did we first meet", no "what do you love about me".
  After eight years those produce the answer you've both already heard. Every question here is
  built to retrieve a <em>specific memory</em> rather than a summary of a person — that's what
  makes someone tell a story instead of giving a verdict.</p>

  <h2>Nine categories</h2>
  <ul>
    <li><strong>Vroeger</strong> — youth, where the unmined material is after eight years together</li>
    <li><strong>Kleine dingen</strong> — small and concrete; these reveal more than the big ones</li>
    <li><strong>Verhalen</strong> — direct story prompts, phrased as "vertel over"</li>
    <li><strong>Wij</strong> — about the two of you, but angled away from the obvious</li>
    <li><strong>Wat als</strong> — the only forward-looking ones; kept few on purpose</li>
    <li><strong>Weet jij dit?</strong> — real trivia, added 2026-08-24. These have a
      <em>correct answer</em>, so they are scored properly: the other person either knows or does not</li>
    <li><strong>Wie van ons?</strong> — point at the same time, then argue about it</li>
    <li><strong>Onenigheid</strong> — low-stakes arguments with no right answer. Pick a side and
      commit</li>
    <li><strong>Wat kies je</strong> — would-you-rather dilemmas, added 2026-08-15. Absurd on purpose, but each one is <em>actually</em> hard — that is where the arguing is</li>
  </ul>

  <h2>The better way to use it — one card a night</h2>
  <p><strong>This does not have to be a game night.</strong> The strongest idea found while
  researching how other couples' decks are used is the <em>evening card</em>: one card, once a day,
  at dinner. No scores, no streaks, no obligation to finish.</p>
  <p>At <strong>{{CARD_COUNT}} cards that is about four months of dinners</strong> — which turns a present that
  gets played once into one that keeps arriving. Keep the deck on the table rather than in a
  cupboard; a deck in a drawer is a deck that gets used twice.</p>

  <h2>Printing and making it</h2>
  <p>Print (Ctrl&nbsp;+&nbsp;P) — this briefing doesn't print, the rules card and the cards do.
  Three per row, dashed cut lines. On thin card stock it cuts into a real deck; a paper cutter and
  half an hour and it's done.</p>
  <p><strong>As a present, this is the strongest thing on your gift list</strong> — it's personal,
  it costs almost nothing, and it's made rather than ordered, so no delivery deadline. If you want
  it to look like a present rather than a printout, the obvious upgrade is a 3D-printed box with
  both your names on it.</p>
  <p><strong>Read the deck before you use it.</strong> Cut any card you don't want to be asked —
  it's your deck, and one badly-landing question in the wrong week is worth avoiding.</p>
</div>

<div class="rules">
  <h2>Spelregels</h2>
  <ol>
"""

MID = """  </ol>
</div>

<div class="grid">
"""

TAIL = """</div>

</div>
</body>
</html>
"""

CARD = ('  <div class="c" style="--cc:%s">' + chr(10) +
        '    <div class="tag">%s</div>' + chr(10) +
        '    <div class="q">%s</div>' + chr(10) +
        '    <div class="no">%d</div>' + chr(10) +
        '  </div>' + chr(10))

RULE = '    <li>%s</li>' + chr(10)


def load(path=DATA):
    with io.open(path, encoding="utf-8") as f:
        return json.load(f)


def check(deck):
    """Refuse to generate from data that is not internally consistent."""
    colours = {c["name"]: c["colour"] for c in deck["categories"]}
    cards = deck["cards"]

    ids = [c["id"] for c in cards]
    if ids != list(range(1, len(cards) + 1)):
        raise SystemExit("cards.json: ids are not 1..%d without gaps" % len(cards))

    for card in cards:
        if card["category"] not in colours:
            raise SystemExit("cards.json: card %d has unknown category %r"
                             % (card["id"], card["category"]))
        for ch in "<>&":
            if ch in card["text"]:
                raise SystemExit("cards.json: card %d contains %r; card text is plain "
                                 "text, not HTML" % (card["id"], ch))

    stated = deck["meta"].get("card_count")
    if stated is not None and stated != len(cards):
        raise SystemExit("cards.json: meta.card_count says %d, there are %d cards"
                         % (stated, len(cards)))

    for cat in deck["categories"]:
        actual = sum(1 for c in cards if c["category"] == cat["name"])
        if cat.get("count") is not None and cat["count"] != actual:
            raise SystemExit("cards.json: category %r says %d cards, there are %d"
                             % (cat["name"], cat["count"], actual))
    return colours


def render(deck):
    colours = check(deck)
    cards = deck["cards"]
    out = [HEAD.replace("{{CARD_COUNT}}", str(len(cards)))]

    for rule in deck["rules"]:
        out.append(RULE % rule)

    out.append(MID)

    previous = None
    for card in cards:
        if previous is not None and card["category"] != previous:
            out.append(chr(10))     # blank line between category groups, for reading the source
        previous = card["category"]
        out.append(CARD % (colours[card["category"]], card["category"],
                           card["text"], card["id"]))

    out.append(TAIL)
    return "".join(out)


def main(argv):
    deck = load()
    html = render(deck)

    if "--check" in argv:
        try:
            with io.open(OUT, encoding="utf-8", newline="") as f:
                current = f.read()
        except IOError:
            print("VRAGENSPEL.html does not exist yet. Run without --check to write it.")
            return 1
        if current == html:
            print("VRAGENSPEL.html is up to date with cards.json "
                  "(%d cards, %d categories, %d rules)."
                  % (len(deck["cards"]), len(deck["categories"]), len(deck["rules"])))
            return 0
        print("VRAGENSPEL.html DIFFERS from what cards.json produces. "
              "Run without --check to regenerate it.")
        return 1

    with io.open(OUT, "w", encoding="utf-8", newline="") as f:
        f.write(html)

    print("Read   : %s" % DATA)
    print("Wrote  : %s" % OUT)
    print("Deck   : %d cards, %d categories, %d rules"
          % (len(deck["cards"]), len(deck["categories"]), len(deck["rules"])))
    for cat in deck["categories"]:
        print("         %-14s %s  %d" % (cat["name"], cat["colour"],
                                         sum(1 for c in deck["cards"]
                                             if c["category"] == cat["name"])))
    print("")
    print("Check it: open VRAGENSPEL.html in a browser and press Ctrl+P. The briefing")
    print("must not appear in the print preview; the rules card and %d numbered cards must."
          % len(deck["cards"]))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
