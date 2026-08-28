"""
build_vragenspel.py - regenerate cards.js from cards.json.

    cards.json  ->  cards.js    the deck, for the browser app

cards.json is the single source of truth for the deck. This script owns no content at
all: it validates the deck and re-emits it as a script the page can load. To change a
question, a category colour or a rule, edit cards.json and run this again. Never
hand-edit cards.js - the next run overwrites it.

Why cards.js exists. index.html has to work when it is double-clicked, and a page opened
over file:// is not allowed to fetch() a neighbouring .json file. So the deck is emitted
as a JavaScript assignment the page loads with a <script> tag. It is generated, never
edited - cards.json stays the only editable copy of the deck.

The printable deck was retired on 2026-08-28. This script used to emit VRAGENSPEL.html
as well; it no longer does, and the page and its layout templates are gone. The reason is
docs/DECISIONS.md D17 - the app and the paper deck had drifted into describing two
different games, and only one of them was being played.

Run it by double-clicking build_vragenspel.bat, which sits beside this file.
Nothing here reaches the network, and nothing here runs git.

Usage:
    python build_vragenspel.py            write cards.js
    python build_vragenspel.py --check    write nothing, say whether it is up to date
"""

import io
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "cards.json")
OUT_JS = os.path.join(HERE, "cards.js")


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


JS_HEAD = """/* cards.js - GENERATED FILE. Do not edit.

   Written by build_vragenspel.py from cards.json, which is the only editable copy of the
   deck. Change a question there and run the build again; anything typed into this file is
   lost on the next run.

   It exists so index.html works when it is double-clicked: a page opened over file:// may
   not fetch() cards.json, but it may load a script. */

window.VRAGENSPEL_DECK = """

JS_TAIL = """;
"""


def render_js(deck):
    """The same deck as a script the browser app can load over file://."""
    check(deck)
    body = json.dumps(deck, ensure_ascii=False, indent=2)
    # JSON is valid JavaScript here with one exception: U+2028 and U+2029 are line
    # terminators to a JavaScript parser but ordinary characters to a JSON one. Escape
    # them, so a card that ever contains one cannot silently produce a broken script.
    body = body.replace(u" ", u"\u2028").replace(u" ", u"\u2029")
    return JS_HEAD + body + JS_TAIL

def main(argv):
    deck = load()
    js = render_js(deck)
    name = os.path.basename(OUT_JS)

    if "--check" in argv:
        try:
            with io.open(OUT_JS, encoding="utf-8", newline="") as f:
                current = f.read()
        except IOError:
            print("%s does not exist yet. Run without --check to write it." % name)
            return 1
        if current == js:
            print("%s is up to date with cards.json." % name)
            stale = 0
        else:
            print("%s DIFFERS from what cards.json produces. "
                  "Run without --check to regenerate it." % name)
            stale = 1
        print("Deck: %d cards, %d categories, %d rules."
              % (len(deck["cards"]), len(deck["categories"]), len(deck["rules"])))
        return stale

    with io.open(OUT_JS, "w", encoding="utf-8", newline="") as f:
        f.write(js)

    print("Read   : %s" % DATA)
    print("Wrote  : %s" % OUT_JS)
    print("Deck   : %d cards, %d categories, %d rules"
          % (len(deck["cards"]), len(deck["categories"]), len(deck["rules"])))
    for cat in deck["categories"]:
        print("         %-14s %s  %d" % (cat["name"], cat["colour"],
                                         sum(1 for c in deck["cards"]
                                             if c["category"] == cat["name"])))
    print("")
    print("Check it: double-click index.html. It must deal a card, not an error.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
