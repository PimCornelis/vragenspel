'use strict';

/* Vragenspel — the browser app.

   A sitting, not a ritual: cards keep coming until you stop. One card fills the screen,
   the whole background takes the category's colour, and the next card is one tap away.

   There are no rounds. A score runs from the moment you start until you tap Stoppen, and
   then it says who won. The deck simply shuffles again when it has been all the way
   round; nothing announces it, because nothing needs to.

   Which cards can score is not invented here — it is what the deck's own rules card says.
   Weet jij dit? has one right answer. Wat kies je and Onenigheid end in a minute each of
   arguing, so they end in whoever did the convincing. Wie van ons? is a match or it is
   not. The other five categories are conversation and score nothing, which is what keeps
   the game quick.

   Nothing here stores an answer. A "Weet jij dit?" card's answer lives in a person's
   head; the app only ever asks who knew it and takes the players' word.

   NAMES NEVER LEAVE THE PHONE. The two players can type their names in the menu; they
   are kept in localStorage and appear in no file in this repository, which is public.
   docs/DECISIONS.md D16.

   The deck arrives in window.VRAGENSPEL_DECK from cards.js, which build_vragenspel.py
   generates from cards.json. This file never carries a copy of a card. Cards written in
   the app are DRAFTS, kept apart from the deck until a session promotes them into
   cards.json and the build is run — docs/DECISIONS.md D15.

   Written for a phone, one hand, at a terrace. */


/* ==================================================== 1. everything in Dutch */

var T = {
  volgende:      'Volgende kaart',
  terug:         'Terug',
  bewaar:        'Bewaar kaart',
  kopieer:       'Kopieer',
  niemand:       'Niemand',
  gelijk:        'Allebei',

  kiesMinuten:   'Naar de minuten',
  kiesKop:       'Allebei kiezen',
  kiesRegels:    ['Zeg het tegelijk, geen slagen om de arm.',
                  'Daarna één minuut om de ander te overtuigen dat hij fout zit.'],

  wieWijzen:     'Aanwijzen op drie',
  wieNu:         'Wijs!',
  wieKop:        'Wezen jullie hetzelfde?',
  wieZelfde:     'Ja, hetzelfde',
  wieElkaar:     'Nee, naar elkaar',
  wieRaak:       'Dat klopt dus. Een punt voor allebei.',
  wieMis:        'Dan is dat het gesprek.',

  weetKop:       'Wie wist het?',
  weetUitleg:    'Alleen jullie weten het goede antwoord. Het spel bewaart het niet.',
  weetNiemand:   'Niemand wist het',
  weetStilte:    'Geen punt, en een korte stilte.',

  onenigheidKop:    'Ieder een kant',
  onenigheidRegels: ['Ook als je het er eigenlijk mee eens bent.',
                     'Eén minuut per persoon.'],

  overtuigdKop:  'Wie heeft overtuigd?',
  overtuigdGeen: 'Niemand gaf toe',
  puntVoor:      'Een punt voor',
  geenPunt:      'Geen punt.',

  start:         'Start',
  stop:          'Stop',
  tijd:          'Tijd.',

  menu:          'Menu',
  eigenSchrijven:'Eigen kaart schrijven',
  naarOordeel:   'Wat vonden we ervan',
  stoppen:       'Stoppen en de stand opmaken',

  uitslagWint:   'wint',
  uitslagGelijk: 'Gelijkspel',
  uitslagNiets:  'Nog geen punten',
  uitslagNietsOnder: 'Speel een paar kaarten met een streepje wedstrijd erin.',
  uitslagOnder:  function (n) {
    return n === 1 ? 'Na 1 kaart.' : 'Na ' + n + ' kaarten.';
  },
  uitslagUitleg: 'De duimen blijven staan. Alleen de punten gaan terug naar nul.',
  verder:        'Verder spelen',
  nieuwSpel:     'Nieuw spel, punten op nul',

  filterUit:     'Alles doet mee. Tik een categorie aan als je ergens geen zin in hebt.',
  filterAan:     'Alleen deze categorieën worden gedeeld:',

  leegKop:       'Niets meer te delen',
  leegFilter:    'Geen kaarten meer in de gekozen categorieën. Kies er een categorie bij.',
  leegAlles:     'Alle kaarten zijn weggelegd. Haal er een paar terug bij ' +
                 '"Wat vonden we ervan".',

  eigenBewaard:  'Bewaard. Deze kaart doet vanaf nu mee.',
  eigenLeeg:     'Typ eerst een vraag.',
  eigenGeen:     'Nog geen eigen kaarten.',
  eigenUitleg:   'Deze kaarten doen meteen mee, maar staan nog niet in het deck zelf. ' +
                 'Geef ze via "Wat vonden we ervan" door aan een Claude Code-sessie, ' +
                 'anders zijn ze weg als je de browsergegevens wist.',
  eigenWeg:      'Wissen',
  eigenNr:       'eigen',

  duimOp:        'Mooie kaart',
  duimNeer:      'Niet meer tonen',

  oordeelGeen:   'Nog niets beoordeeld. Gebruik de duimen onder een kaart.',
  oordeelTerug:  'Terughalen',
  oordeelGeenOp: 'Nog geen mooie kaarten aangewezen.',
  oordeelGeenNeer:'Nog geen kaarten weggelegd.',
  gekopieerd:    'Gekopieerd.',
  nietGekopieerd:'Kopiëren lukte niet. Selecteer de tekst hierboven en kopieer met de hand.',

  spelerStandaard: ['Speler 1', 'Speler 2'],
  deckStand:     function (gehad, totaal, eigen, weg) {
    return gehad + ' van ' + totaal + ' kaarten gehad. ' +
           eigen + ' zelfgeschreven, ' + weg + ' weggelegd.';
  },

  geenGeheugen:  'Deze browser onthoudt niets — de app werkt, maar de stand, de namen ' +
                 'en alles wat jullie beoordelen zijn weg zodra je hem sluit. Zet ' +
                 'privémodus uit als dat niet de bedoeling is.'
};


/* ========================================================= 2. the saved state */

var SLEUTEL = 'vragenspel';
var TIMER_SECONDEN = 60;
var EIGEN_START_ID = 1001;   /* clear of the deck's 1..118, which the build validates */

var stand = null;
var geheugenWerkt = true;

function legeStand() {
  return {
    gezien: [],                    /* ids dealt since the deck was last all the way round */
    duimOp: [],                    /* ids marked as one of the good ones */
    duimNeer: [],                  /* ids retired; never dealt again */
    eigen: [],                     /* cards written here: {id, category, text} — drafts */
    volgendEigenId: EIGEN_START_ID,
    filter: [],                    /* chosen categories; empty means everything plays */
    huidige: null,                 /* id of the card on the screen */
    namen: ['', ''],               /* what the two of them are called; '' means unnamed */
    punten: [0, 0],                /* the score, this game */
    gespeeld: 0                    /* cards played this game, for the result screen */
  };
}

function laadStand() {
  var opgeslagen;
  try {
    opgeslagen = window.localStorage.getItem(SLEUTEL);
  } catch (e) {
    geheugenWerkt = false;
    return legeStand();
  }
  if (!opgeslagen) return legeStand();

  var gelezen;
  try {
    gelezen = JSON.parse(opgeslagen);
  } catch (e) {
    return legeStand();
  }

  /* Take only the fields this version knows about, so an older save cannot arrive with a
     field missing and leave the game in a half-built state. */
  var schoon = legeStand();
  Object.keys(schoon).forEach(function (naam) {
    if (Object.prototype.hasOwnProperty.call(gelezen, naam)) schoon[naam] = gelezen[naam];
  });
  return schoon;
}

function bewaarStand() {
  if (!geheugenWerkt) return;
  try {
    window.localStorage.setItem(SLEUTEL, JSON.stringify(stand));
  } catch (e) {
    geheugenWerkt = false;
    toonWaarschuwing();
  }
}

function naamVan(speler) {
  return stand.namen[speler].trim() || T.spelerStandaard[speler];
}


/* ================================================== 3. the elements on the page */

var waarschuwingEl = document.getElementById('waarschuwing');
var standBovenEl = document.getElementById('stand-boven');
var menuKnopEl = document.getElementById('menu-knop');
var kaartEl = document.getElementById('kaart');
var tagEl = document.getElementById('tag');
var vraagEl = document.getElementById('vraag');
var extraEl = document.getElementById('extra');
var nrEl = document.getElementById('nr');
var actiesEl = document.getElementById('acties');
var duimenEl = document.getElementById('duimen');

var menuEl = document.getElementById('menu');
var filterEl = document.getElementById('filter');
var filterUitlegEl = document.getElementById('filter-uitleg');
var deckUitlegEl = document.getElementById('deck-uitleg');
var naamEls = [document.getElementById('naam-0'), document.getElementById('naam-1')];

var eigenEl = document.getElementById('eigen');
var eigenCategorieEl = document.getElementById('eigen-categorie');
var eigenTekstEl = document.getElementById('eigen-tekst');
var eigenMeldingEl = document.getElementById('eigen-melding');
var eigenUitlegEl = document.getElementById('eigen-uitleg');
var eigenLijstEl = document.getElementById('eigen-lijst');

var oordeelEl = document.getElementById('oordeel');
var oordeelUitlegEl = document.getElementById('oordeel-uitleg');
var oordeelMooiEl = document.getElementById('oordeel-mooi');
var oordeelNietEl = document.getElementById('oordeel-niet');
var oordeelBlokEl = document.getElementById('oordeel-blok');
var oordeelMeldingEl = document.getElementById('oordeel-melding');

var uitslagEl = document.getElementById('uitslag');
var duifGrootEl = document.getElementById('duif-groot');
var uitslagKopEl = document.getElementById('uitslag-kop');
var uitslagOnderEl = document.getElementById('uitslag-onder');
var eindstandEl = document.getElementById('eindstand');
var uitslagUitlegEl = document.getElementById('uitslag-uitleg');

var PANELEN = [menuEl, eigenEl, oordeelEl, uitslagEl];

var stapNu = null;      /* the card step being shown, so a panel can come back to it */

/* The steps that are a card. Every other screen has no card under it, so it gets no
   verdict buttons. Filled in at the bottom of this file, once the steps exist. */
var KAARTSTAPPEN = [];

var eigenCategorie = null;   /* the category chosen for a card being written */


/* =============================================================== 4. the pigeon

   Drawn here rather than loaded, because the app has no dependencies and never reaches
   the network. The pigeon is the app's motif, chosen by Pim; it is decoration and
   carries no name. */

var SVG_NS = 'http://www.w3.org/2000/svg';

function maakDuif(groot) {
  var svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('aria-hidden', 'true');

  if (groot) {
    /* The green-to-violet sheen a pigeon's neck actually has. */
    var defs = document.createElementNS(SVG_NS, 'defs');
    var grad = document.createElementNS(SVG_NS, 'linearGradient');
    grad.setAttribute('id', 'duif-glans');
    grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0');
    grad.setAttribute('x2', '1'); grad.setAttribute('y2', '1');
    [['0%', '#4d8f78'], ['48%', '#6d7fae'], ['100%', '#8a63ab']].forEach(function (paar) {
      var stop = document.createElementNS(SVG_NS, 'stop');
      stop.setAttribute('offset', paar[0]);
      stop.setAttribute('stop-color', paar[1]);
      grad.appendChild(stop);
    });
    defs.appendChild(grad);
    svg.appendChild(defs);
  }

  var kleur = groot ? 'url(#duif-glans)' : 'currentColor';

  /* In drawing order, back to front: the tail tucks behind the body, the wing sits on
     top of it as a darker panel, and the legs are strokes rather than fills. */
  var vormen = [
    { rol: 'vlak', d: 'M72 52 L99 44 L98 68 L74 70 Z' },
    { rol: 'vlak', d: 'M42 41 C62 36 79 45 80 59 C81 73 69 82 53 82 ' +
                      'C36 82 25 73 26 60 C27 48 31 44 42 41 Z' },
    { rol: 'vlak', cx: 35, cy: 32, r: 15 },
    { rol: 'vlak', d: 'M21 28 L3 34 L21 40 Z' },
    { rol: 'vleugel', d: 'M42 52 C56 48 69 54 73 63 C63 71 49 71 41 65 C37 61 38 55 42 52 Z' },
    { rol: 'poot', d: 'M48 82 L46 95 M61 82 L63 95' }
  ];

  vormen.forEach(function (vorm) {
    var el;
    if (vorm.d) {
      el = document.createElementNS(SVG_NS, 'path');
      el.setAttribute('d', vorm.d);
    } else {
      el = document.createElementNS(SVG_NS, 'circle');
      el.setAttribute('cx', vorm.cx);
      el.setAttribute('cy', vorm.cy);
      el.setAttribute('r', vorm.r);
    }

    if (vorm.rol === 'vleugel') {
      el.setAttribute('fill', 'rgba(0,0,0,.18)');
    } else if (vorm.rol === 'poot') {
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke', kleur);
      el.setAttribute('stroke-width', '3.4');
      el.setAttribute('stroke-linecap', 'round');
    } else {
      el.setAttribute('fill', kleur);
    }
    svg.appendChild(el);
  });

  var oog = document.createElementNS(SVG_NS, 'circle');
  oog.setAttribute('cx', '30'); oog.setAttribute('cy', '29');
  oog.setAttribute('r', '2.6');
  oog.setAttribute('fill', 'rgba(0,0,0,.55)');
  svg.appendChild(oog);

  return svg;
}


/* ===================================================== 5. drawing the screen */

function toonWaarschuwing() {
  waarschuwingEl.textContent = T.geenGeheugen;
  waarschuwingEl.hidden = false;
}

function toonActies(acties) {
  actiesEl.replaceChildren();
  acties.forEach(function (actie) {
    var knop = document.createElement('button');
    knop.type = 'button';
    knop.className = 'knop' +
      (actie.groot ? ' knop-groot' : '') +
      (actie.stil ? ' knop-stil' : '') +
      (actie.waarschuwing ? ' knop-waarschuwing' : '');
    knop.textContent = actie.tekst;
    knop.addEventListener('click', actie.doe);
    actiesEl.appendChild(knop);
  });
}

/* The two verdict buttons. Under every card, at every step of it, because an opinion
   arrives whenever it arrives — but never on a screen that is not a card, where they
   would silently judge whichever card happened to be dealt last. */
function toonDuimen() {
  duimenEl.replaceChildren();
  if (stand.huidige === null) return;
  if (KAARTSTAPPEN.indexOf(stapNu) === -1) return;

  [{ klasse: 'duim-op',   tekst: T.duimOp,   lijst: 'duimOp' },
   { klasse: 'duim-neer', tekst: T.duimNeer, lijst: 'duimNeer' }].forEach(function (soort) {
    var aan = stand[soort.lijst].indexOf(stand.huidige) !== -1;
    var knop = document.createElement('button');
    knop.type = 'button';
    knop.className = 'duim ' + soort.klasse;
    knop.setAttribute('aria-pressed', aan ? 'true' : 'false');
    knop.textContent = soort.tekst;
    knop.addEventListener('click', function () { wisselDuim(soort.lijst); });
    duimenEl.appendChild(knop);
  });
}

function leegExtra() {
  extraEl.replaceChildren();
  extraEl.hidden = true;
}

function maakKop(tekst) {
  var kop = document.createElement('h2');
  kop.className = 'extra-kop';
  kop.textContent = tekst;
  return kop;
}

function toonExtraLijst(kop, regels) {
  extraEl.replaceChildren();
  extraEl.appendChild(maakKop(kop));
  var lijst = document.createElement('ul');
  lijst.className = 'extra-lijst';
  regels.forEach(function (regel) {
    var item = document.createElement('li');
    item.textContent = regel;
    lijst.appendChild(item);
  });
  extraEl.appendChild(lijst);
  extraEl.hidden = false;
}

function toonExtraTekst(kop, tekst, metDuif) {
  extraEl.replaceChildren();
  if (metDuif) {
    var duif = maakDuif(false);
    duif.setAttribute('class', 'punt-duif');
    extraEl.appendChild(duif);
  }
  if (kop) extraEl.appendChild(maakKop(kop));
  var alinea = document.createElement('p');
  alinea.className = 'extra-tekst';
  alinea.textContent = tekst;
  extraEl.appendChild(alinea);
  extraEl.hidden = false;
}

/* The running score, in the top bar. */
function toonStand() {
  standBovenEl.replaceChildren();
  [0, 1].forEach(function (speler) {
    if (speler === 1) {
      var streep = document.createElement('span');
      streep.className = 'stand-streep';
      streep.textContent = '·';
      standBovenEl.appendChild(streep);
    }
    var blok = document.createElement('span');
    blok.className = 'stand-speler';

    var naam = document.createElement('span');
    naam.className = 'stand-naam';
    naam.textContent = naamVan(speler);
    blok.appendChild(naam);

    var punt = document.createElement('span');
    punt.className = 'stand-punt';
    punt.textContent = stand.punten[speler];
    blok.appendChild(punt);

    standBovenEl.appendChild(blok);
  });
}

/* Go to a card step. One place, so the clock is always stopped and any panel closed. */
function ga(stapFunctie) {
  stopKlok();
  stapNu = stapFunctie;
  sluitPanelen();
  kaartEl.hidden = false;
  toonStand();
  stapFunctie();
  toonDuimen();
}

function sluitPanelen() {
  PANELEN.forEach(function (paneel) { paneel.hidden = true; });
  document.body.classList.remove('paneel-open');
}

function openPaneel(paneel, vulFunctie, acties) {
  stopKlok();
  kaartEl.hidden = true;
  sluitPanelen();
  paneel.hidden = false;
  document.body.classList.add('paneel-open');
  duimenEl.replaceChildren();
  toonStand();
  vulFunctie();
  toonActies(acties);
}


/* ============================================ 6. which cards are still available */

function alleKaarten() {
  return DECK.cards.concat(stand.eigen);
}

function kaartMetId(id) {
  var gevonden = null;
  alleKaarten().forEach(function (kaart) {
    if (kaart.id === id) gevonden = kaart;
  });
  return gevonden;
}

function isEigen(id) {
  return id >= EIGEN_START_ID;
}

function speelbaar() {
  return alleKaarten().filter(function (kaart) {
    if (stand.duimNeer.indexOf(kaart.id) !== -1) return false;
    if (stand.filter.length && stand.filter.indexOf(kaart.category) === -1) return false;
    return true;
  });
}

function beschikbaar() {
  return speelbaar().filter(function (kaart) {
    return stand.gezien.indexOf(kaart.id) === -1;
  });
}

/* The printed deck is shuffled, so this one is too. When every card has been dealt it
   quietly starts over — there are no rounds to announce. */
function deel() {
  var mogelijk = beschikbaar();

  if (!mogelijk.length) {
    var alles = speelbaar();
    if (!alles.length) { ga(stapLeeg); return; }
    stand.gezien = [];
    mogelijk = alles;
  }

  var gekozen = mogelijk[Math.floor(Math.random() * mogelijk.length)];
  stand.huidige = gekozen.id;
  if (stand.gezien.indexOf(gekozen.id) === -1) stand.gezien.push(gekozen.id);
  stand.gespeeld += 1;
  bewaarStand();
  ga(stapKaart);
}


/* ================================================= 7. reviewing while playing */

function wisselDuim(lijstNaam) {
  var anderNaam = lijstNaam === 'duimOp' ? 'duimNeer' : 'duimOp';
  var lijst = stand[lijstNaam];
  var ander = stand[anderNaam];
  var id = stand.huidige;

  var plek = lijst.indexOf(id);
  if (plek === -1) {
    lijst.push(id);
    var andere = ander.indexOf(id);      /* a card cannot be both */
    if (andere !== -1) ander.splice(andere, 1);
  } else {
    lijst.splice(plek, 1);
  }
  bewaarStand();
  toonDuimen();
}

function haalOordeelTerug(id, lijstNaam) {
  var plek = stand[lijstNaam].indexOf(id);
  if (plek !== -1) stand[lijstNaam].splice(plek, 1);
  bewaarStand();
  vulOordeel();
}


/* ============================================================== 8. the score */

function geefPunt(speler) {
  stand.punten[speler] += 1;
  bewaarStand();
  toonStand();
}

function geefPuntAllebei() {
  stand.punten[0] += 1;
  stand.punten[1] += 1;
  bewaarStand();
  toonStand();
}

/* One point, then the next card. Used by every category that scores. */
var puntSpeler = 0;      /* who the point just went to, for the screen that says so */

function puntKnoppen(extraKnop) {
  var acties = [0, 1].map(function (speler) {
    return {
      tekst: naamVan(speler),
      doe: function () { geefPunt(speler); puntSpeler = speler; ga(stapPuntGegeven); }
    };
  });
  acties.push(extraKnop);
  return acties;
}

function stapPuntGegeven() {
  toonExtraTekst('', T.puntVoor + ' ' + naamVan(puntSpeler) + '.', true);
  toonActies([{ tekst: T.volgende, doe: deel }]);
}


/* =========================================================== 9. the card's steps */

function huidigeKaart() {
  return kaartMetId(stand.huidige);
}

function soortVan(categorie) {
  if (categorie === 'Wat kies je') return 'kies';
  if (categorie === 'Wie van ons?') return 'wie';
  if (categorie === 'Weet jij dit?') return 'weet';
  if (categorie === 'Onenigheid') return 'onenigheid';
  return 'gewoon';
}

/* Long questions step down a size rather than overflowing the screen. */
function maatVoor(tekst) {
  if (tekst.length > 95) return 'vraag heellang';
  if (tekst.length > 55) return 'vraag lang';
  return 'vraag';
}

function stapKaart() {
  var kaart = huidigeKaart();
  document.body.style.setProperty('--cc', KLEUREN[kaart.category]);
  tagEl.textContent = kaart.category;
  vraagEl.className = maatVoor(kaart.text);
  vraagEl.textContent = kaart.text;
  nrEl.textContent = isEigen(kaart.id) ? T.eigenNr : kaart.id;
  leegExtra();

  /* Restart the arrival animation. Removing the class, reading offsetWidth and adding it
     back is the standard way to make a CSS animation play a second time: the read forces
     the browser to apply the removal before the class returns. */
  kaartEl.classList.remove('in');
  void kaartEl.offsetWidth;
  kaartEl.classList.add('in');

  var soort = soortVan(kaart.category);

  if (soort === 'kies' || soort === 'onenigheid') {
    toonActies([{ tekst: T.kiesMinuten, doe: function () { ga(stapKiezen); } }]);
  } else if (soort === 'wie') {
    toonActies([{ tekst: T.wieWijzen, doe: function () { ga(stapWieAftellen); } }]);
  } else if (soort === 'weet') {
    toonActies([{ tekst: T.weetKop, doe: function () { ga(stapWeetWie); } }]);
  } else {
    toonActies([{ tekst: T.volgende, doe: deel }]);
  }
}

/* ---- Wat kies je and Onenigheid: say it, a minute each, then who convinced ---- */
function stapKiezen() {
  var soort = soortVan(huidigeKaart().category);
  if (soort === 'kies') toonExtraLijst(T.kiesKop, T.kiesRegels);
  else toonExtraLijst(T.onenigheidKop, T.onenigheidRegels);
  toonActies([{ tekst: T.start + ' · ' + naamVan(0), groot: true,
                doe: function () { ga(stapTimers); } }]);
}

function stapOvertuigd() {
  extraEl.replaceChildren(maakKop(T.overtuigdKop));
  extraEl.hidden = false;
  toonActies(puntKnoppen({
    tekst: T.overtuigdGeen, stil: true,
    doe: function () { ga(stapGeenPunt); }
  }));
}

function stapGeenPunt() {
  toonExtraTekst('', T.geenPunt);
  toonActies([{ tekst: T.volgende, doe: deel }]);
}

/* ---- Wie van ons? — point on three, then a match or not ---- */
var aftelId = null;

function stapWieAftellen() {
  var over = 3;
  extraEl.replaceChildren();
  var getal = document.createElement('p');
  getal.className = 'aftellen';
  getal.textContent = over;
  extraEl.appendChild(getal);
  extraEl.hidden = false;
  toonActies([]);

  aftelId = window.setInterval(function () {
    over -= 1;
    if (over > 0) { getal.textContent = over; return; }
    window.clearInterval(aftelId);
    aftelId = null;
    getal.textContent = T.wieNu;
    trilling([120]);
    window.setTimeout(function () {
      if (stapNu === stapWieAftellen) ga(stapWieUitslag);
    }, 900);
  }, 1000);
}

function stapWieUitslag() {
  extraEl.replaceChildren(maakKop(T.wieKop));
  extraEl.hidden = false;
  toonActies([
    { tekst: T.wieZelfde, doe: function () { geefPuntAllebei(); ga(stapWieRaak); } },
    { tekst: T.wieElkaar, stil: true, doe: function () { ga(stapWieMis); } }
  ]);
}

function stapWieRaak() {
  toonExtraTekst('', T.wieRaak, true);
  toonActies([{ tekst: T.volgende, doe: deel }]);
}

function stapWieMis() {
  toonExtraTekst('', T.wieMis);
  toonActies([{ tekst: T.volgende, doe: deel }]);
}

/* ---- Weet jij dit? — self-reported, and nothing is written down ---- */
function stapWeetWie() {
  toonExtraTekst(T.weetKop, T.weetUitleg);
  toonActies(puntKnoppen({
    tekst: T.weetNiemand, stil: true,
    doe: function () { ga(stapWeetNiemand); }
  }));
}

function stapWeetNiemand() {
  toonExtraTekst('', T.weetStilte);
  toonActies([{ tekst: T.volgende, doe: deel }]);
}


/* ===================================================== 10. the one-minute timers */

var klokId = null;
var klokSpeler = 0;
var klokRest = TIMER_SECONDEN;
var klokFase = 'wacht';             /* wacht | loopt | af */

function stopKlok() {
  if (klokId !== null) { window.clearInterval(klokId); klokId = null; }
  if (aftelId !== null) { window.clearInterval(aftelId); aftelId = null; }
}

function klokTekst(seconden) {
  var m = Math.floor(seconden / 60);
  var s = seconden % 60;
  return m + ':' + (s < 10 ? '0' : '') + s;
}

function stapTimers() {
  klokSpeler = 0;
  klokRest = TIMER_SECONDEN;
  klokFase = 'wacht';
  startKlok();
}

function tekenKlok() {
  extraEl.replaceChildren();

  var beurt = document.createElement('p');
  beurt.className = 'beurt';
  beurt.textContent = naamVan(klokSpeler);
  extraEl.appendChild(beurt);

  var klok = document.createElement('p');
  klok.className = 'klok';
  klok.textContent = klokFase === 'af' ? T.tijd : klokTekst(klokRest);
  extraEl.appendChild(klok);
  extraEl.hidden = false;

  if (klokFase === 'loopt') {
    toonActies([{ tekst: T.stop, groot: true, doe: klokAfgelopen }]);
  } else if (klokSpeler === 0) {
    toonActies([{ tekst: T.start + ' · ' + naamVan(1), groot: true, doe: volgendeSpeler }]);
  } else {
    toonActies([{ tekst: T.overtuigdKop, doe: function () { ga(stapOvertuigd); } }]);
  }
}

function startKlok() {
  klokFase = 'loopt';
  tekenKlok();
  klokId = window.setInterval(function () {
    klokRest -= 1;
    if (klokRest <= 0) { klokAfgelopen(); return; }
    tekenKlok();
  }, 1000);
}

function klokAfgelopen() {
  stopKlok();
  klokRest = 0;
  klokFase = 'af';
  piep();
  trilling([200, 100, 200]);
  tekenKlok();
}

function volgendeSpeler() {
  klokSpeler = 1;
  klokRest = TIMER_SECONDEN;
  startKlok();
}

/* Three short beeps, made by the browser itself — no sound file, no third party. A phone
   on silent, or a browser that will not make sound, simply makes none: the screen says
   "Tijd." either way, which is why this one is allowed to fail quietly. */
var audioCtx = null;

function piep() {
  try {
    if (!audioCtx) {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtx = new Ctx();
    }
    for (var i = 0; i < 3; i++) {
      var begintOp = audioCtx.currentTime + i * 0.22;
      var toon = audioCtx.createOscillator();
      var volume = audioCtx.createGain();
      toon.frequency.value = 880;
      volume.gain.setValueAtTime(0.0001, begintOp);
      volume.gain.exponentialRampToValueAtTime(0.25, begintOp + 0.02);
      volume.gain.exponentialRampToValueAtTime(0.0001, begintOp + 0.16);
      toon.connect(volume);
      volume.connect(audioCtx.destination);
      toon.start(begintOp);
      toon.stop(begintOp + 0.18);
    }
  } catch (e) { /* no sound on this device; the screen still says Tijd. */ }
}

function trilling(patroon) {
  if (navigator.vibrate) {
    try { navigator.vibrate(patroon); } catch (e) { /* not supported; harmless */ }
  }
}


/* ==================================================== 11. nothing left to deal */

function stapLeeg() {
  document.body.style.setProperty('--cc', '#2b3038');
  tagEl.textContent = '';
  vraagEl.className = 'vraag lang';
  vraagEl.textContent = T.leegKop;
  nrEl.textContent = '';
  toonExtraTekst('', stand.filter.length ? T.leegFilter : T.leegAlles);
  toonActies([{ tekst: T.menu, doe: openMenu }]);
}


/* ============================================================ 12. the menu */

function openMenu() {
  openPaneel(menuEl, vulMenu, [
    { tekst: T.terug, doe: sluitMenu },
    { tekst: T.eigenSchrijven, stil: true, doe: openEigen },
    { tekst: T.naarOordeel, stil: true, doe: openOordeel },
    { tekst: T.stoppen, stil: true, doe: openUitslag }
  ]);
}

function sluitMenu() {
  if (stand.huidige !== null && kaartMetId(stand.huidige)) ga(stapNu || stapKaart);
  else deel();
}

function meervoud(aantal, enkel, meer) {
  return aantal + ' ' + (aantal === 1 ? enkel : meer);
}

/* One toggle per category. The same control is used for the filter here and for picking
   a category when writing a card. */
function vulCategorieën(houder, isAan, bijKlik) {
  houder.replaceChildren();
  DECK.categories.forEach(function (categorie) {
    var knop = document.createElement('button');
    knop.type = 'button';
    knop.className = 'cat';
    knop.style.setProperty('--cc', categorie.colour);
    knop.setAttribute('aria-pressed', isAan(categorie.name) ? 'true' : 'false');
    knop.textContent = categorie.name;
    knop.addEventListener('click', function () { bijKlik(categorie.name); });
    houder.appendChild(knop);
  });
}

function vulMenu() {
  naamEls.forEach(function (veld, speler) {
    veld.value = stand.namen[speler];
    veld.placeholder = T.spelerStandaard[speler];
  });

  vulCategorieën(filterEl,
    function (naam) { return stand.filter.indexOf(naam) !== -1; },
    wisselCategorie);

  filterUitlegEl.textContent = stand.filter.length
    ? T.filterAan + ' ' + stand.filter.join(', ') + '.'
    : T.filterUit;

  deckUitlegEl.textContent = T.deckStand(stand.gezien.length, speelbaar().length,
                                         stand.eigen.length, stand.duimNeer.length);
}

function wisselCategorie(naam) {
  var plek = stand.filter.indexOf(naam);
  if (plek === -1) stand.filter.push(naam);
  else stand.filter.splice(plek, 1);
  bewaarStand();
  vulMenu();
}

/* Names are typed here and go no further than this phone. */
function bewaarNaam(speler) {
  stand.namen[speler] = naamEls[speler].value;
  bewaarStand();
  toonStand();
}


/* ================================================= 13. writing your own card */

function openEigen() {
  openPaneel(eigenEl, vulEigen, [
    { tekst: T.bewaar, doe: bewaarEigen },
    { tekst: T.terug, stil: true, doe: openMenu }
  ]);
}

function vulEigen() {
  if (!eigenCategorie) eigenCategorie = DECK.categories[0].name;

  vulCategorieën(eigenCategorieEl,
    function (naam) { return naam === eigenCategorie; },
    function (naam) { eigenCategorie = naam; vulEigen(); });

  eigenUitlegEl.textContent = stand.eigen.length ? T.eigenUitleg : T.eigenGeen;

  eigenLijstEl.replaceChildren();
  stand.eigen.forEach(function (kaart) {
    eigenLijstEl.appendChild(maakRegel(kaart, T.eigenWeg, function () {
      verwijderEigen(kaart.id);
    }));
  });
}

/* One row: the card, and the button that takes it away again. */
function maakRegel(kaart, knopTekst, doe) {
  var regel = document.createElement('div');
  regel.className = 'regel';
  regel.style.setProperty('--cc', KLEUREN[kaart.category] || '#5d6672');

  var tekst = document.createElement('div');
  tekst.className = 'regel-tekst';
  var cat = document.createElement('span');
  cat.className = 'regel-cat';
  cat.textContent = kaart.category;
  tekst.appendChild(cat);
  tekst.appendChild(document.createTextNode(kaart.text));
  regel.appendChild(tekst);

  var knop = document.createElement('button');
  knop.type = 'button';
  knop.className = 'regel-weg';
  knop.textContent = knopTekst;
  knop.addEventListener('click', doe);
  regel.appendChild(knop);

  return regel;
}

function bewaarEigen() {
  var tekst = eigenTekstEl.value.trim();
  if (!tekst) { eigenMeldingEl.textContent = T.eigenLeeg; return; }

  stand.eigen.push({
    id: stand.volgendEigenId,
    category: eigenCategorie,
    text: tekst
  });
  stand.volgendEigenId += 1;
  bewaarStand();

  eigenTekstEl.value = '';
  eigenMeldingEl.textContent = T.eigenBewaard;
  vulEigen();
}

function verwijderEigen(id) {
  stand.eigen = stand.eigen.filter(function (kaart) { return kaart.id !== id; });
  ['duimOp', 'duimNeer', 'gezien'].forEach(function (lijst) {
    var plek = stand[lijst].indexOf(id);
    if (plek !== -1) stand[lijst].splice(plek, 1);
  });
  if (stand.huidige === id) stand.huidige = null;
  bewaarStand();
  vulEigen();
}


/* ================================================ 14. the verdicts, and the export

   This phone cannot write to the laptop and there is no server between them, so the
   verdicts travel by hand: a block of text to copy into a Claude Code session, which
   writes it to card_feedback.local.json. That file is gitignored, and deliberately: what
   the two of you liked and disliked is nobody else's business, and this repository is
   public. docs/DECISIONS.md D14. */

function openOordeel() {
  openPaneel(oordeelEl, vulOordeel, [
    { tekst: T.kopieer, doe: kopieerOordeel },
    { tekst: T.terug, stil: true, doe: openMenu }
  ]);
}

function vulOordeel() {
  var opKaarten = stand.duimOp.map(kaartMetId).filter(Boolean);
  var neerKaarten = stand.duimNeer.map(kaartMetId).filter(Boolean);

  oordeelUitlegEl.textContent = (opKaarten.length + neerKaarten.length)
    ? meervoud(opKaarten.length, 'kaart', 'kaarten') + ' mooi gevonden, ' +
      meervoud(neerKaarten.length, 'kaart', 'kaarten') + ' weggelegd.'
    : T.oordeelGeen;

  oordeelMooiEl.replaceChildren();
  if (!opKaarten.length) oordeelMooiEl.appendChild(maakUitleg(T.oordeelGeenOp));
  opKaarten.forEach(function (kaart) {
    oordeelMooiEl.appendChild(maakRegel(kaart, T.oordeelTerug, function () {
      haalOordeelTerug(kaart.id, 'duimOp');
    }));
  });

  oordeelNietEl.replaceChildren();
  if (!neerKaarten.length) oordeelNietEl.appendChild(maakUitleg(T.oordeelGeenNeer));
  neerKaarten.forEach(function (kaart) {
    oordeelNietEl.appendChild(maakRegel(kaart, T.oordeelTerug, function () {
      haalOordeelTerug(kaart.id, 'duimNeer');
    }));
  });

  oordeelBlokEl.value = maakExport(opKaarten, neerKaarten);
  oordeelMeldingEl.textContent = '';
}

function maakUitleg(tekst) {
  var alinea = document.createElement('p');
  alinea.className = 'paneel-uitleg';
  alinea.textContent = tekst;
  return alinea;
}

/* Deck cards are identified by id — cards.json is right there beside the session that
   reads this. Cards written here carry their full text, because nothing else has them.
   The names are deliberately NOT in this block: they never leave the phone. */
function maakExport(opKaarten, neerKaarten) {
  function kort(kaart) {
    return isEigen(kaart.id)
      ? { eigen: true, categorie: kaart.category, tekst: kaart.text }
      : { id: kaart.id, tekst: kaart.text };
  }
  return JSON.stringify({
    vragenspel_feedback: 1,
    mooi: opKaarten.map(kort),
    nietMeer: neerKaarten.map(kort),
    eigenKaarten: stand.eigen.map(function (kaart) {
      return { categorie: kaart.category, tekst: kaart.text };
    })
  }, null, 2);
}

function kopieerOordeel() {
  oordeelBlokEl.select();
  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    oordeelMeldingEl.textContent = T.nietGekopieerd;
    return;
  }
  navigator.clipboard.writeText(oordeelBlokEl.value).then(function () {
    oordeelMeldingEl.textContent = T.gekopieerd;
  }, function () {
    oordeelMeldingEl.textContent = T.nietGekopieerd;
  });
}


/* ========================================================= 15. stopping, and who won */

function openUitslag() {
  openPaneel(uitslagEl, vulUitslag, [
    { tekst: T.verder, doe: sluitMenu },
    { tekst: T.nieuwSpel, stil: true, doe: nieuwSpel }
  ]);
}

function vulUitslag() {
  duifGrootEl.replaceChildren(maakDuif(true));

  var a = stand.punten[0];
  var b = stand.punten[1];

  if (a === 0 && b === 0) {
    uitslagKopEl.textContent = T.uitslagNiets;
    uitslagOnderEl.textContent = T.uitslagNietsOnder;
  } else if (a === b) {
    uitslagKopEl.textContent = T.uitslagGelijk;
    uitslagOnderEl.textContent = T.uitslagOnder(stand.gespeeld);
  } else {
    uitslagKopEl.textContent = naamVan(a > b ? 0 : 1) + ' ' + T.uitslagWint;
    uitslagOnderEl.textContent = T.uitslagOnder(stand.gespeeld);
  }

  eindstandEl.replaceChildren();
  [0, 1].forEach(function (speler) {
    var blok = document.createElement('div');
    blok.className = 'eindstand-speler' +
      (stand.punten[speler] > stand.punten[1 - speler] ? ' wint' : '');

    var naam = document.createElement('span');
    naam.className = 'eindstand-naam';
    naam.textContent = naamVan(speler);
    blok.appendChild(naam);

    var punt = document.createElement('span');
    punt.className = 'eindstand-punt';
    punt.textContent = stand.punten[speler];
    blok.appendChild(punt);

    eindstandEl.appendChild(blok);
  });

  uitslagUitlegEl.textContent = T.uitslagUitleg;
}

/* A new game resets the score and nothing else: the verdicts on the cards are about the
   deck, not about this evening, so they stay. */
function nieuwSpel() {
  stand.punten = [0, 0];
  stand.gespeeld = 0;
  bewaarStand();
  sluitMenu();
}


/* ============================================================= 16. starting up */

function begin() {
  stand = laadStand();
  if (!geheugenWerkt) toonWaarschuwing();

  if (stand.huidige !== null && kaartMetId(stand.huidige) &&
      stand.duimNeer.indexOf(stand.huidige) === -1) {
    ga(stapKaart);
    return;
  }
  deel();
}


/* ================================================================ 17. the deck

   window.VRAGENSPEL_DECK comes from cards.js, generated from cards.json by
   build_vragenspel.py. If it is not there, say what failed: an empty screen would send
   someone looking for a bug in the game instead of a missing build. */

var DECK = window.VRAGENSPEL_DECK;
var KLEUREN = {};          /* category name -> colour, resolved once */

if (!DECK || !DECK.cards || !DECK.cards.length) {
  document.body.replaceChildren();
  document.body.textContent =
    'De kaarten konden niet geladen worden: cards.js ontbreekt of is stuk. ' +
    'Draai build_vragenspel.bat opnieuw.';
} else {
  KAARTSTAPPEN = [stapKaart, stapKiezen, stapWieAftellen, stapWieUitslag, stapWieRaak,
                  stapWieMis, stapWeetWie, stapWeetNiemand, stapOvertuigd, stapGeenPunt,
                  stapPuntGegeven, stapTimers];

  DECK.categories.forEach(function (categorie) {
    KLEUREN[categorie.name] = categorie.colour;
  });

  naamEls.forEach(function (veld, speler) {
    veld.addEventListener('input', function () { bewaarNaam(speler); });
  });

  menuKnopEl.addEventListener('click', function () {
    if (PANELEN.every(function (p) { return p.hidden; })) openMenu();
    else sluitMenu();
  });

  begin();
}
