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

   THE PRIVATE LAYER. Tijdcapsule cards, the names, the thumbs and the dates each card was
   last asked are facts about two real people. They live in localStorage and in a file the
   players export for themselves, and in nothing else. A Tijdcapsule card has NO route into
   cards.json — not a checked one, none — and both the panel that writes them and the panel
   that promotes ordinary drafts say so in Dutch. docs/DECISIONS.md D20, and CLAUDE.md
   hard limit 6.

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
                 'privémodus uit als dat niet de bedoeling is.',

  /* ---- is de opslag beschermd? ---- */
  opslagJa:       'Opslag: beschermd. Deze telefoon ruimt het spel niet zomaar op.',
  opslagNee:      'Opslag: niet beschermd (maak af en toe een back-up).',
  opslagOnbekend: 'Opslag: deze browser zegt er niets over (maak af en toe een back-up).',

  /* ---- het geheugenbestand ---- */
  geheugen:      'Geheugen en back-up',
  geheugenUitleg:'Alles wat dit spel over jullie onthoudt staat op deze telefoon en ' +
                 'nergens anders. Eén bestand is de enige kopie die je zelf in handen ' +
                 'hebt: de gespeelde kaarten, de duimen, jullie eigen kaarten, de ' +
                 'tijdcapsules, de namen en de stand.',
  exportKnop:    'Bewaar een back-up',
  exportGelukt:  'Bewaard. Kies "Bewaar in Bestanden" als je hem wilt terugvinden.',
  exportAf:      'Afgebroken. Er is niets bewaard.',
  exportKan:     'Deze browser kan geen bestand delen. De back-up werkt op de telefoon, ' +
                 'in het spel dat op je beginscherm staat.',
  exportFout:    'Bewaren lukte niet. Probeer het nog een keer.',

  backupNooit:   'Nog geen back-up gemaakt.',
  backupOp:      function (datum) { return 'Laatste back-up: ' + datum + '.'; },
  backupOud:     function (datum) {
    return 'Laatste back-up: ' + datum + '. Dat is meer dan twee maanden geleden.';
  },

  importGeen:    'Dit is geen geheugenbestand van dit spel.',
  importStuk:    'Dit bestand kon niet gelezen worden.',
  importVervang: function (datum, duimen, eigen, capsules) {
    return 'Je zet de back-up van ' + datum + ' terug: ' +
           meervoud(duimen, 'beoordeelde kaart', 'beoordeelde kaarten') + ', ' +
           meervoud(eigen, 'eigen kaart', 'eigen kaarten') + ', ' +
           meervoud(capsules, 'tijdcapsule', 'tijdcapsules') + ', de namen en de stand. ' +
           'Alles wat nu op deze telefoon staat wordt daardoor vervangen en is dan weg.';
  },
  importJa:      'Ja, vervangen',
  importNee:     'Nee, laat staan',
  importKlaar:   'Teruggezet. Het spel speelt verder met wat er in het bestand stond.',

  /* ---- Mensen kijken: de woorden van regel 12 ---- */
  mensenKnop:    'Allebei raden',
  mensenKop:     'Allebei raden',
  mensenRegels:  ['Tegelijk, hardop, over iemand die je ziet.',
                  'Er is nooit een goed antwoord.'],
  mensenAardig:  'Wees aardig: hij hoort het niet, maar het gaat wel over een echt mens.',

  /* ---- Rode vlaggen: de woorden van regel 13 ---- */
  vlaggenKop:    'Ieder één van de twee',
  vlaggenRegels: ['Welke zou je nog kunnen verdragen?',
                  'Daarna één minuut om de ander te overtuigen dat hij de verkeerde koos.'],

  /* ---- Tijdcapsule ---- */
  capsule:       'Tijdcapsule schrijven',
  capsuleCat:    'Tijdcapsule',
  capsuleLet:    'Een tijdcapsule gaat over jullie twee. Hij blijft op deze telefoon en in ' +
                 'je back-upbestand, en komt nooit in het deck en nooit in het blok voor ' +
                 'Claude Code. Schrijf alleen de vraag op, nooit het antwoord.',
  capsuleWanneer:'Wanneer mag hij terugkomen?',
  capsuleBewaar: 'Leg hem weg',
  capsuleLeeg:   'Typ eerst een vraag.',
  capsuleKlaar:  function (datum) { return 'Weggelegd tot ' + datum + '.'; },
  capsuleGeen:   'Nog geen tijdcapsules.',
  capsuleUitleg: 'Deze kaarten slapen tot hun datum en worden dan vanzelf gedeeld.',
  capsuleSlaapt: function (datum) { return 'slaapt tot ' + datum; },
  capsuleSlaaptStil: 'slaapt nog — datum onbekend',
  capsuleWakker: 'doet mee',
  capsuleWeg:    'Wissen',
  capsuleGeschreven: function (datum) { return 'Geschreven op ' + datum + '.'; },
  eerderGevraagd: function (datum) {
    return 'Dit vroegen we op ' + datum + '. Is het antwoord veranderd?';
  },

  /* ---- licht of diep ---- */
  diepteKop:     'Waar hebben jullie zin in?',
  diepteUitleg:  'Licht blijft aan de oppervlakte. Diep gaat door tot het ergens over gaat. ' +
                 'Alles laat het deck kiezen.',
  diepteNamen:   { licht: 'Licht', diep: 'Diep', alles: 'Alles' },
  diepteNu:      function (naam) { return 'Nu: ' + naam + '.'; },

  oordeelCapsules: 'Tijdcapsules staan hier niet bij en komen hier ook nooit bij te staan. ' +
                   'Ze gaan over jullie twee, dus ze blijven op deze telefoon en in de ' +
                   'back-up. Ze kunnen niet in het deck worden opgenomen.'
};


/* ========================================================= 2. the saved state */

var SLEUTEL = 'vragenspel';
var TIMER_SECONDEN = 60;
var EIGEN_START_ID = 1001;     /* clear of the deck's 1..158, which the build validates */
var CAPSULE_START_ID = 5001;   /* and clear of the drafts, so an id says what a card is */
var OUDE_KAART_DAGEN = 365;    /* older than this and the card says when it was last asked */
var BACKUP_OUD_DAGEN = 62;     /* two months, after which the menu mentions it */

var stand = null;
var geheugenWerkt = true;

function legeStand() {
  return {
    gezien: [],                    /* ids dealt since the deck was last all the way round */
    gezienOp: {},                  /* id -> the date that card was last dealt, YYYY-MM-DD */
    duimOp: [],                    /* ids marked as one of the good ones */
    duimNeer: [],                  /* ids retired; never dealt again */
    eigen: [],                     /* cards written here: {id, category, text} — drafts */
    volgendEigenId: EIGEN_START_ID,
    capsules: [],                  /* the private layer: {id, text, geschrevenOp, wakkerOp} */
    volgendCapsuleId: CAPSULE_START_ID,
    filter: [],                    /* chosen categories; empty means everything plays */
    diepte: 'alles',               /* licht | diep | alles */
    huidige: null,                 /* id of the card on the screen */
    namen: ['', ''],               /* what the two of them are called; '' means unnamed */
    punten: [0, 0],                /* the score, this game */
    gespeeld: 0,                   /* cards played this game, for the result screen */
    laatsteExport: null,           /* date of the last back-up, YYYY-MM-DD */
    opslagBeschermd: null          /* what navigator.storage.persist() said: true|false|null */
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


/* ============================================================ 2b. dates

   Dates are kept as plain YYYY-MM-DD strings, in the phone's own timezone. They are only
   ever compared to each other and shown to a person, never sent anywhere, so a local date
   is the honest one: a card written on Tuesday evening should say Tuesday. */

var MAANDEN = ['januari', 'februari', 'maart', 'april', 'mei', 'juni',
               'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

function isoVan(datum) {
  var maand = datum.getMonth() + 1;
  var dag = datum.getDate();
  return datum.getFullYear() +
         '-' + (maand < 10 ? '0' : '') + maand +
         '-' + (dag < 10 ? '0' : '') + dag;
}

function uitIso(iso) {
  var deel = String(iso).split('-');
  return new Date(Number(deel[0]), Number(deel[1]) - 1, Number(deel[2]));
}

function vandaag() {
  return isoVan(new Date());
}

function plusDagen(iso, dagen) {
  var datum = uitIso(iso);
  datum.setDate(datum.getDate() + dagen);
  return isoVan(datum);
}

/* Rounded, because a clock change makes one of these days 23 or 25 hours long. */
function dagenTussen(vanIso, totIso) {
  return Math.round((uitIso(totIso) - uitIso(vanIso)) / 86400000);
}

function datumNL(iso) {
  var datum = uitIso(iso);
  return datum.getDate() + ' ' + MAANDEN[datum.getMonth()] + ' ' + datum.getFullYear();
}


/* ================================================== 2c. asking to keep the storage

   localStorage is best-effort by policy: a browser may throw it away after a stretch
   without visits, which is exactly the wrong thing to do to a card written to sleep for a
   year. navigator.storage.persist() asks it not to. WebKit's strongest signal for
   granting is a web app added to the home screen, which is how this one is played — so
   the answer is worth asking for, and worth showing rather than assuming.

   It is a request, not a guarantee, and some browsers have no such API at all. Both cases
   end in the menu saying so in Dutch, and neither may break the page.
   docs/DECISIONS.md D20. */

function onthoudOpslag(antwoord) {
  if (stand.opslagBeschermd === antwoord) return;
  stand.opslagBeschermd = antwoord;
  bewaarStand();
  if (!menuEl.hidden) vulMenu();
}

function vraagOpslag() {
  try {
    if (!navigator.storage || !navigator.storage.persist) {
      onthoudOpslag(null);
      return;
    }
    navigator.storage.persist().then(function (toegekend) {
      onthoudOpslag(toegekend === true);
    }, function () {
      onthoudOpslag(null);
    });
  } catch (e) {
    onthoudOpslag(null);
  }
}

function opslagRegel() {
  if (stand.opslagBeschermd === true) return T.opslagJa;
  if (stand.opslagBeschermd === false) return T.opslagNee;
  return T.opslagOnbekend;
}


/* ================================================== 3. the elements on the page */

var waarschuwingEl = document.getElementById('waarschuwing');
var standBovenEl = document.getElementById('stand-boven');
var menuKnopEl = document.getElementById('menu-knop');
var kaartEl = document.getElementById('kaart');
var tagEl = document.getElementById('tag');
var eerderEl = document.getElementById('eerder');
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
var opslagUitlegEl = document.getElementById('opslag-uitleg');
var backupUitlegEl = document.getElementById('backup-uitleg');
var diepteMenuEl = document.getElementById('diepte-menu');
var diepteMenuKopEl = document.getElementById('diepte-menu-kop');
var diepteMenuUitlegEl = document.getElementById('diepte-menu-uitleg');
var menuRijenEl = document.getElementById('menu-rijen');

var startEl = document.getElementById('start');
var startUitlegEl = document.getElementById('start-uitleg');

var capsuleEl = document.getElementById('capsule');
var capsuleTekstEl = document.getElementById('capsule-tekst');
var capsuleWanneerEl = document.getElementById('capsule-wanneer');
var capsuleMeldingEl = document.getElementById('capsule-melding');
var capsuleUitlegEl = document.getElementById('capsule-uitleg');
var capsuleLijstEl = document.getElementById('capsule-lijst');

var geheugenEl = document.getElementById('geheugen');
var geheugenUitlegEl = document.getElementById('geheugen-uitleg');
var geheugenBackupEl = document.getElementById('geheugen-backup');
var geheugenMeldingEl = document.getElementById('geheugen-melding');
var geheugenVraagEl = document.getElementById('geheugen-vraag');
var importEl = document.getElementById('import-bestand');
var importKnopEl = document.getElementById('import-knop');

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
var oordeelCapsulesEl = document.getElementById('oordeel-capsules');
var oordeelBlokEl = document.getElementById('oordeel-blok');
var oordeelMeldingEl = document.getElementById('oordeel-melding');

var uitslagEl = document.getElementById('uitslag');
var duifGrootEl = document.getElementById('duif-groot');
var uitslagKopEl = document.getElementById('uitslag-kop');
var uitslagOnderEl = document.getElementById('uitslag-onder');
var eindstandEl = document.getElementById('eindstand');
var uitslagUitlegEl = document.getElementById('uitslag-uitleg');

var PANELEN = [menuEl, startEl, eigenEl, capsuleEl, geheugenEl, oordeelEl, uitslagEl];

var stapNu = null;      /* the card step being shown, so a panel can come back to it */

/* The steps that are a card. Every other screen has no card under it, so it gets no
   verdict buttons. Filled in at the bottom of this file, once the steps exist. */
var KAARTSTAPPEN = [];

var eigenCategorie = null;   /* the category chosen for a card being written */


/* =============================================================== 4. the pigeon

   Drawn here rather than loaded, because the app has no dependencies and never reaches
   the network. The pigeon is the app's motif, chosen by the owner; it is decoration and
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

/* A capsule is only a card once its date has come. Until then it is not in the deck at
   all, so nothing can deal it, count it or filter it. */
function wakkereCapsules() {
  var nu = vandaag();
  return stand.capsules
    .filter(function (capsule) { return dagenTussen(capsule.wakkerOp, nu) >= 0; })
    .map(function (capsule) {
      return {
        id: capsule.id,
        category: T.capsuleCat,
        text: capsule.text,
        geschrevenOp: capsule.geschrevenOp
      };
    });
}

function alleKaarten() {
  return DECK.cards.concat(stand.eigen, wakkereCapsules());
}

function kaartMetId(id) {
  var gevonden = null;
  alleKaarten().forEach(function (kaart) {
    if (kaart.id === id) gevonden = kaart;
  });
  return gevonden;
}

function isEigen(id) {
  return id >= EIGEN_START_ID && id < CAPSULE_START_ID;
}

function isCapsule(id) {
  return id >= CAPSULE_START_ID;
}

/* A card with no diepte — a draft, a capsule, or the whole deck before the labels were
   written — always plays. The dial narrows the deck; it never empties it. */
function magBijDiepte(kaart) {
  if (stand.diepte === 'alles') return true;
  if (!kaart.diepte) return true;
  return kaart.diepte === stand.diepte;
}

function speelbaar() {
  return alleKaarten().filter(function (kaart) {
    if (stand.duimNeer.indexOf(kaart.id) !== -1) return false;
    /* A capsule waited months to be asked; it is not held back by an evening's mood. */
    if (isCapsule(kaart.id)) return true;
    if (stand.filter.length && stand.filter.indexOf(kaart.category) === -1) return false;
    if (!magBijDiepte(kaart)) return false;
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

  /* Read the previous date before overwriting it — the card is about to say it. */
  vorigeKeer = stand.gezienOp[gekozen.id] || null;

  stand.huidige = gekozen.id;
  if (stand.gezien.indexOf(gekozen.id) === -1) stand.gezien.push(gekozen.id);
  stand.gezienOp[gekozen.id] = vandaag();
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
  if (categorie === 'Rode vlaggen') return 'vlaggen';
  if (categorie === 'Mensen kijken') return 'mensen';
  return 'gewoon';
}

/* The quiet lines above the question: when a capsule was written, and when this card was
   last asked if that was long enough ago to be interesting. */
var vorigeKeer = null;      /* the date this card was dealt before, if it ever was */

function toonEerder(kaart) {
  var regels = [];

  if (isCapsule(kaart.id) && kaart.geschrevenOp) {
    regels.push(T.capsuleGeschreven(datumNL(kaart.geschrevenOp)));
  }
  if (vorigeKeer && dagenTussen(vorigeKeer, vandaag()) > OUDE_KAART_DAGEN) {
    regels.push(T.eerderGevraagd(datumNL(vorigeKeer)));
  }

  eerderEl.replaceChildren();
  regels.forEach(function (regel) {
    var alinea = document.createElement('span');
    alinea.textContent = regel;
    eerderEl.appendChild(alinea);
  });
  eerderEl.hidden = regels.length === 0;
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
  toonEerder(kaart);
  vraagEl.className = maatVoor(kaart.text);
  vraagEl.textContent = kaart.text;
  nrEl.textContent = isCapsule(kaart.id) ? ''
                   : isEigen(kaart.id) ? T.eigenNr
                   : kaart.id;
  leegExtra();

  /* Restart the arrival animation. Removing the class, reading offsetWidth and adding it
     back is the standard way to make a CSS animation play a second time: the read forces
     the browser to apply the removal before the class returns. */
  kaartEl.classList.remove('in');
  void kaartEl.offsetWidth;
  kaartEl.classList.add('in');

  var soort = soortVan(kaart.category);

  if (soort === 'kies' || soort === 'onenigheid' || soort === 'vlaggen') {
    toonActies([{ tekst: T.kiesMinuten, doe: function () { ga(stapKiezen); } }]);
  } else if (soort === 'mensen') {
    toonActies([{ tekst: T.mensenKnop, doe: function () { ga(stapMensen); } }]);
  } else if (soort === 'wie') {
    toonActies([{ tekst: T.wieWijzen, doe: function () { ga(stapWieAftellen); } }]);
  } else if (soort === 'weet') {
    toonActies([{ tekst: T.weetKop, doe: function () { ga(stapWeetWie); } }]);
  } else {
    toonActies([{ tekst: T.volgende, doe: deel }]);
  }
}

/* ---- Wat kies je, Onenigheid and Rode vlaggen: say it, a minute each, then who
       convinced. Rode vlaggen is the same shape as Wat kies je — both choose, then each
       argues the other chose wrong — so it uses the same timer rather than a second one.
       docs/DECISIONS.md D21. ---- */
function stapKiezen() {
  var soort = soortVan(huidigeKaart().category);
  if (soort === 'kies') toonExtraLijst(T.kiesKop, T.kiesRegels);
  else if (soort === 'vlaggen') toonExtraLijst(T.vlaggenKop, T.vlaggenRegels);
  else toonExtraLijst(T.onenigheidKop, T.onenigheidRegels);
  toonActies([{ tekst: T.start + ' · ' + naamVan(0), groot: true,
                doe: function () { ga(stapTimers); } }]);
}

/* ---- Mensen kijken: both guess out loud at once, and nothing is ever right ----

   So there is no scoring tap here, deliberately: a category with no right answer that
   asked who won would be inventing one. The courtesy line from the rules card is shown
   on the first one of the sitting and then left alone — said once is a reminder, said
   every time is nagging. docs/DECISIONS.md D21. */
var aardigGetoond = false;
var aardigKaart = null;

function stapMensen() {
  var toon = !aardigGetoond || aardigKaart === stand.huidige;
  if (toon) {
    aardigGetoond = true;
    aardigKaart = stand.huidige;
  }
  toonExtraLijst(T.mensenKop,
    toon ? T.mensenRegels.concat([T.mensenAardig]) : T.mensenRegels);
  toonActies([{ tekst: T.volgende, doe: deel }]);
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
  eerderEl.replaceChildren();
  eerderEl.hidden = true;
  vraagEl.className = 'vraag lang';
  vraagEl.textContent = T.leegKop;
  nrEl.textContent = '';
  toonExtraTekst('', stand.filter.length ? T.leegFilter : T.leegAlles);
  toonActies([{ tekst: T.menu, doe: openMenu }]);
}


/* ============================================================ 12. the menu */

/* The way on to the other panels is a list inside the menu rather than four more buttons
   in the bar: the bar is where the thumb goes, and six stacked buttons on a phone push
   the thing you actually came for off the screen. */
var MENU_RIJEN = [
  { tekst: function () { return T.eigenSchrijven; }, doe: function () { openEigen(); } },
  { tekst: function () { return T.capsule; },        doe: function () { openCapsule(); } },
  { tekst: function () { return T.naarOordeel; },    doe: function () { openOordeel(); } },
  { tekst: function () { return T.geheugen; },       doe: function () { naarGeheugen(); } }
];

function openMenu() {
  openPaneel(menuEl, vulMenu, [
    { tekst: T.terug, doe: sluitMenu },
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

/* The three moods, as the same kind of toggle a category is. */
var DIEPTES = ['licht', 'diep', 'alles'];

function vulDieptes(houder) {
  houder.replaceChildren();
  DIEPTES.forEach(function (sleutel) {
    var knop = document.createElement('button');
    knop.type = 'button';
    knop.className = 'cat cat-diepte';
    knop.setAttribute('aria-pressed', stand.diepte === sleutel ? 'true' : 'false');
    knop.textContent = T.diepteNamen[sleutel];
    knop.addEventListener('click', function () { kiesDiepte(sleutel); });
    houder.appendChild(knop);
  });
}

function kiesDiepte(sleutel) {
  stand.diepte = sleutel;
  bewaarStand();
  if (!startEl.hidden) deel();
  else vulMenu();
}

/* The nudge: one line, in the menu, and nowhere else. No badge and no notification —
   a back-up you are reminded of at the table is a back-up you will not make. */
function backupRegel() {
  if (!stand.laatsteExport) return T.backupNooit;
  var datum = datumNL(stand.laatsteExport);
  return dagenTussen(stand.laatsteExport, vandaag()) > BACKUP_OUD_DAGEN
    ? T.backupOud(datum)
    : T.backupOp(datum);
}

function vulMenu() {
  naamEls.forEach(function (veld, speler) {
    veld.value = stand.namen[speler];
    veld.placeholder = T.spelerStandaard[speler];
  });

  opslagUitlegEl.textContent = opslagRegel();
  backupUitlegEl.textContent = backupRegel();

  /* The dial is only offered once the deck actually carries the labels. Before that a
     "diep" sitting would be an empty deck, which is a worse thing to ship than no dial. */
  diepteMenuKopEl.hidden = !HEEFT_DIEPTE;
  diepteMenuUitlegEl.hidden = !HEEFT_DIEPTE;
  diepteMenuEl.hidden = !HEEFT_DIEPTE;
  if (HEEFT_DIEPTE) {
    diepteMenuUitlegEl.textContent = T.diepteUitleg;
    vulDieptes(diepteMenuEl);
  }

  vulCategorieën(filterEl,
    function (naam) { return stand.filter.indexOf(naam) !== -1; },
    wisselCategorie);

  filterUitlegEl.textContent = stand.filter.length
    ? T.filterAan + ' ' + stand.filter.join(', ') + '.'
    : T.filterUit;

  deckUitlegEl.textContent = T.deckStand(stand.gezien.length, speelbaar().length,
                                         stand.eigen.length, stand.duimNeer.length);

  menuRijenEl.replaceChildren();
  MENU_RIJEN.forEach(function (rij) {
    var knop = document.createElement('button');
    knop.type = 'button';
    knop.className = 'knop knop-stil';
    knop.textContent = rij.tekst();
    knop.addEventListener('click', rij.doe);
    menuRijenEl.appendChild(knop);
  });
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

/* One row: the card, and the button that takes it away again. The small line above the
   text is the category, unless the caller has something more useful to say there — a
   sleeping capsule says when it wakes up. */
function maakRegel(kaart, knopTekst, doe, boven) {
  var regel = document.createElement('div');
  regel.className = 'regel';
  regel.style.setProperty('--cc', KLEUREN[kaart.category] || '#5d6672');

  var tekst = document.createElement('div');
  tekst.className = 'regel-tekst';
  var cat = document.createElement('span');
  cat.className = 'regel-cat';
  cat.textContent = boven || kaart.category;
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


/* ============================================ 13b. the mood a sitting opens with */

function openStart() {
  openPaneel(startEl, function () {
    startUitlegEl.textContent = T.diepteUitleg;
  }, DIEPTES.map(function (sleutel) {
    return {
      tekst: T.diepteNamen[sleutel],
      stil: sleutel === 'alles',
      doe: function () { kiesDiepte(sleutel); }
    };
  }));
}


/* ================================================== 13c. the Tijdcapsule cards

   Cards written at the table about a shared memory, which then sleep until the date
   chosen for them. They are the private layer, and they stay in it: they live in
   localStorage and in the exported file and nowhere else.

   THERE IS NO PATH FROM HERE INTO THE DECK. A card written in the Eigen kaart panel can
   be promoted into cards.json after a privacy check (D15); a Tijdcapsule card is exempt
   from that path entirely, because it is a fact about two real people wearing the costume
   of a question. It is kept out of the Claude Code block by maakExport, the panel there
   says so in Dutch, and this panel says so before a word is typed.
   CLAUDE.md hard limit 6, docs/DECISIONS.md D20.

   The question is stored. An answer never is. */

var INTERVALLEN = [
  { sleutel: '3m',     tekst: '3 maanden', dagen: 92 },
  { sleutel: '6m',     tekst: '6 maanden', dagen: 183 },
  { sleutel: '1j',     tekst: '1 jaar',    dagen: 365 },
  { sleutel: 'verras', tekst: 'Verras me', dagen: null }
];

var VERRAS_MIN = 92;      /* three months */
var VERRAS_MAX = 730;     /* two years */

var capsuleInterval = INTERVALLEN[0].sleutel;

function intervalMet(sleutel) {
  var gevonden = INTERVALLEN[0];
  INTERVALLEN.forEach(function (soort) {
    if (soort.sleutel === sleutel) gevonden = soort;
  });
  return gevonden;
}

function openCapsule() {
  openPaneel(capsuleEl, vulCapsule, [
    { tekst: T.capsuleBewaar, doe: bewaarCapsule },
    { tekst: T.terug, stil: true, doe: openMenu }
  ]);
}

function vulCapsule() {
  capsuleWanneerEl.replaceChildren();
  INTERVALLEN.forEach(function (soort) {
    var knop = document.createElement('button');
    knop.type = 'button';
    knop.className = 'cat cat-diepte';
    knop.setAttribute('aria-pressed', capsuleInterval === soort.sleutel ? 'true' : 'false');
    knop.textContent = soort.tekst;
    knop.addEventListener('click', function () {
      capsuleInterval = soort.sleutel;
      vulCapsule();
    });
    capsuleWanneerEl.appendChild(knop);
  });

  capsuleUitlegEl.textContent = stand.capsules.length ? T.capsuleUitleg : T.capsuleGeen;

  var nu = vandaag();
  capsuleLijstEl.replaceChildren();
  stand.capsules.forEach(function (capsule) {
    var slaapt = dagenTussen(capsule.wakkerOp, nu) < 0;
    var kaart = { id: capsule.id, category: T.capsuleCat, text: capsule.text };

    /* "Verras me" keeps its date to itself here too. Printing it in the list would give
       away the one thing that option is for. */
    var boven = !slaapt ? T.capsuleWakker
              : capsule.interval === 'verras' ? T.capsuleSlaaptStil
              : T.capsuleSlaapt(datumNL(capsule.wakkerOp));

    capsuleLijstEl.appendChild(maakRegel(kaart, T.capsuleWeg, function () {
      verwijderCapsule(capsule.id);
    }, boven));
  });
}

function bewaarCapsule() {
  var tekst = capsuleTekstEl.value.trim();
  if (!tekst) { capsuleMeldingEl.textContent = T.capsuleLeeg; return; }

  var soort = intervalMet(capsuleInterval);
  var dagen = soort.dagen === null
    ? VERRAS_MIN + Math.floor(Math.random() * (VERRAS_MAX - VERRAS_MIN + 1))
    : soort.dagen;

  var nu = vandaag();
  var wakker = plusDagen(nu, dagen);

  stand.capsules.push({
    id: stand.volgendCapsuleId,
    text: tekst,
    geschrevenOp: nu,
    wakkerOp: wakker,
    interval: soort.sleutel
  });
  stand.volgendCapsuleId += 1;
  bewaarStand();

  capsuleTekstEl.value = '';
  /* "Verras me" is only a surprise if the date is not printed back at you. */
  capsuleMeldingEl.textContent = soort.dagen === null
    ? T.capsuleKlaar('later')
    : T.capsuleKlaar(datumNL(wakker));
  vulCapsule();
}

function verwijderCapsule(id) {
  stand.capsules = stand.capsules.filter(function (capsule) { return capsule.id !== id; });
  ['duimOp', 'duimNeer', 'gezien'].forEach(function (lijst) {
    var plek = stand[lijst].indexOf(id);
    if (plek !== -1) stand[lijst].splice(plek, 1);
  });
  delete stand.gezienOp[id];
  if (stand.huidige === id) stand.huidige = null;
  bewaarStand();
  vulCapsule();
}


/* ================================================= 13d. the memory file

   localStorage is best-effort and this phone is the only copy. So the whole private layer
   goes out as one file the players keep themselves, and comes back in as a replacement
   for what is on the phone.

   ONE PATH, AND IT IS THE SHARE SHEET. The file is handed to navigator.share(), not
   offered as a download. The game is played from a web app on the home screen, and that
   is exactly where an iOS download has nowhere to land and nothing to show for itself;
   the share sheet is the gesture that puts a file in Bestanden or Notities. Where sharing
   a file is not possible the button says so in Dutch and does nothing else — there is no
   second route, because a fallback that works on the laptop and not on the phone is a bug
   that hides until the evening it matters. docs/DECISIONS.md D22.

   REPLACE, NEVER MERGE. Two states merged is a class of bug nobody would ever find, and
   the game is played from one phone. docs/DECISIONS.md D10. */

var GEHEUGEN_MERK = 'vragenspel_geheugen';
var geheugenMelding = '';
var wachtOpTerugzetten = null;     /* a parsed file, waiting for a yes */

function geheugenObject() {
  return {
    vragenspel_geheugen: 1,
    gemaaktOp: vandaag(),
    namen: stand.namen,
    punten: stand.punten,
    gespeeld: stand.gespeeld,
    gezien: stand.gezien,
    gezienOp: stand.gezienOp,
    duimOp: stand.duimOp,
    duimNeer: stand.duimNeer,
    eigen: stand.eigen,
    volgendEigenId: stand.volgendEigenId,
    capsules: stand.capsules,
    volgendCapsuleId: stand.volgendCapsuleId,
    filter: stand.filter,
    diepte: stand.diepte,
    laatsteExport: stand.laatsteExport
  };
}

function naarGeheugen() {
  geheugenMelding = '';
  wachtOpTerugzetten = null;
  openGeheugen();
}

function openGeheugen() {
  var acties = wachtOpTerugzetten
    ? [{ tekst: T.importJa, waarschuwing: true, doe: zetTerug },
       { tekst: T.importNee, stil: true, doe: function () {
           wachtOpTerugzetten = null;
           geheugenMelding = '';
           openGeheugen();
         } }]
    : [{ tekst: T.exportKnop, doe: bewaarBackup },
       { tekst: T.terug, stil: true, doe: openMenu }];

  openPaneel(geheugenEl, vulGeheugen, acties);
}

function vulGeheugen() {
  geheugenUitlegEl.textContent = T.geheugenUitleg;
  geheugenBackupEl.textContent = backupRegel();
  geheugenMeldingEl.textContent = geheugenMelding;

  if (!wachtOpTerugzetten) {
    geheugenVraagEl.hidden = true;
    geheugenVraagEl.textContent = '';
    return;
  }

  var bron = wachtOpTerugzetten;
  geheugenVraagEl.textContent = T.importVervang(
    bron.gemaaktOp ? datumNL(bron.gemaaktOp) : '?',
    (bron.duimOp || []).length + (bron.duimNeer || []).length,
    (bron.eigen || []).length,
    (bron.capsules || []).length);
  geheugenVraagEl.hidden = false;
}

function bewaarBackup() {
  var naam = 'vragenspel-geheugen-' + vandaag() + '.json';
  var tekst = JSON.stringify(geheugenObject(), null, 2);

  var bestand;
  try {
    bestand = new File([tekst], naam, { type: 'application/json' });
    if (!navigator.share || !navigator.canShare || !navigator.canShare({ files: [bestand] })) {
      geheugenMelding = T.exportKan;
      vulGeheugen();
      return;
    }
  } catch (e) {
    geheugenMelding = T.exportKan;
    vulGeheugen();
    return;
  }

  navigator.share({ files: [bestand] }).then(function () {
    stand.laatsteExport = vandaag();
    bewaarStand();
    geheugenMelding = T.exportGelukt;
    vulGeheugen();
  }, function (fout) {
    geheugenMelding = (fout && fout.name === 'AbortError') ? T.exportAf : T.exportFout;
    vulGeheugen();
  });
}

function kiesGeheugenBestand() {
  var bestand = importEl.files && importEl.files[0];
  importEl.value = '';               /* so the same file chosen twice still fires */
  if (!bestand) return;

  var lezer = new FileReader();
  lezer.onerror = function () {
    geheugenMelding = T.importStuk;
    vulGeheugen();
  };
  lezer.onload = function () { leesGeheugen(lezer.result); };
  lezer.readAsText(bestand);
}

function leesGeheugen(tekst) {
  var gelezen = null;
  try {
    gelezen = JSON.parse(tekst);
  } catch (e) {
    geheugenMelding = T.importStuk;
    vulGeheugen();
    return;
  }

  /* Refuse anything that is not ours, out loud. A file picker will happily hand over a
     bank statement, and a silent failure would leave someone tapping. */
  if (!gelezen || typeof gelezen !== 'object' || gelezen[GEHEUGEN_MERK] !== 1) {
    geheugenMelding = T.importGeen;
    vulGeheugen();
    return;
  }

  geheugenMelding = '';
  wachtOpTerugzetten = gelezen;
  openGeheugen();
}

function zetTerug() {
  var bron = wachtOpTerugzetten;
  wachtOpTerugzetten = null;

  var nieuw = legeStand();
  Object.keys(nieuw).forEach(function (naam) {
    if (Object.prototype.hasOwnProperty.call(bron, naam)) nieuw[naam] = bron[naam];
  });

  /* Two things do not come out of the file. The card on the screen belonged to the
     sitting that made the back-up, and whether this phone protects its storage is a fact
     about this phone. */
  nieuw.huidige = null;
  nieuw.opslagBeschermd = stand.opslagBeschermd;

  stand = nieuw;
  bewaarStand();

  aardigGetoond = false;
  aardigKaart = null;
  vorigeKeer = null;

  geheugenMelding = T.importKlaar;
  toonStand();
  openGeheugen();
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

  /* The refusal, said out loud on the panel that promotes cards, not merely enacted by
     leaving them out of the block. docs/DECISIONS.md D20. */
  oordeelCapsulesEl.textContent = T.oordeelCapsules;
  oordeelCapsulesEl.hidden = stand.capsules.length === 0;

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
   The names are deliberately NOT in this block: they never leave the phone.

   NEITHER ARE THE TIJDCAPSULE CARDS. This block is the route into cards.json and so onto
   a public website; a capsule card is exempt from that route, so it is filtered out here
   rather than trusted not to turn up. docs/DECISIONS.md D20. */
function maakExport(opKaarten, neerKaarten) {
  function kort(kaart) {
    return isEigen(kaart.id)
      ? { eigen: true, categorie: kaart.category, tekst: kaart.text }
      : { id: kaart.id, tekst: kaart.text };
  }
  function geenCapsule(kaart) {
    return !isCapsule(kaart.id);
  }
  return JSON.stringify({
    vragenspel_feedback: 1,
    mooi: opKaarten.filter(geenCapsule).map(kort),
    nietMeer: neerKaarten.filter(geenCapsule).map(kort),
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
  aardigGetoond = false;
  aardigKaart = null;
  if (HEEFT_DIEPTE) { openStart(); return; }
  sluitMenu();
}


/* ============================================================= 16. starting up */

function begin() {
  stand = laadStand();
  if (!geheugenWerkt) toonWaarschuwing();
  vraagOpslag();

  /* A card still on the screen means the sitting was interrupted, not ended: pick it up
     where it was rather than asking for a mood that was already chosen. */
  if (stand.huidige !== null && kaartMetId(stand.huidige) &&
      stand.duimNeer.indexOf(stand.huidige) === -1) {
    ga(stapKaart);
    return;
  }
  if (HEEFT_DIEPTE) { openStart(); return; }
  deel();
}


/* ================================================================ 17. the deck

   window.VRAGENSPEL_DECK comes from cards.js, generated from cards.json by
   build_vragenspel.py. If it is not there, say what failed: an empty screen would send
   someone looking for a bug in the game instead of a missing build. */

var DECK = window.VRAGENSPEL_DECK;
var KLEUREN = {};          /* category name -> colour, resolved once */
var HEEFT_DIEPTE = false;  /* does the deck carry licht/diep labels yet? */

/* Tijdcapsule is not a deck category and must never become one: it is defined here so it
   cannot appear in the filter, in the category picker for a written card, or in
   cards.json. It only needs a colour and a name. docs/DECISIONS.md D20. */
var CAPSULE_KLEUR = '#3b3a5c';

if (!DECK || !DECK.cards || !DECK.cards.length) {
  document.body.replaceChildren();
  document.body.textContent =
    'De kaarten konden niet geladen worden: cards.js ontbreekt of is stuk. ' +
    'Draai build_vragenspel.bat opnieuw.';
} else {
  KAARTSTAPPEN = [stapKaart, stapKiezen, stapMensen, stapWieAftellen, stapWieUitslag,
                  stapWieRaak, stapWieMis, stapWeetWie, stapWeetNiemand, stapOvertuigd,
                  stapGeenPunt, stapPuntGegeven, stapTimers];

  DECK.categories.forEach(function (categorie) {
    KLEUREN[categorie.name] = categorie.colour;
  });
  KLEUREN[T.capsuleCat] = CAPSULE_KLEUR;

  HEEFT_DIEPTE = DECK.cards.some(function (kaart) { return !!kaart.diepte; });

  naamEls.forEach(function (veld, speler) {
    veld.addEventListener('input', function () { bewaarNaam(speler); });
  });

  importEl.addEventListener('change', kiesGeheugenBestand);
  importKnopEl.addEventListener('click', function () { importEl.click(); });

  menuKnopEl.addEventListener('click', function () {
    /* While the mood is being chosen there is nothing to go back to yet. */
    if (!startEl.hidden) return;
    if (PANELEN.every(function (p) { return p.hidden; })) openMenu();
    else sluitMenu();
  });

  begin();
}
