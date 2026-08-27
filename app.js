'use strict';

/* Vragenspel — the browser app.

   A sitting, not a ritual: cards keep coming until you stop. One card fills the screen,
   the whole background takes the category's colour, and the only thing between you and
   the next card is one tap.

   While you play you review the deck. A thumb up marks a card as one of the good ones;
   a thumb down retires it and it is never dealt again. Both verdicts are carried to a
   Claude Code session by hand, through a copy-paste block in the menu, because this
   phone cannot write to the laptop and there is no server to put in between.

   Nothing here stores an answer. A "Weet jij dit?" card's answer lives in a person's
   head; the app only ever asks whether it was right and takes the player's word for it.

   The deck arrives in window.VRAGENSPEL_DECK from cards.js, which build_vragenspel.py
   generates from cards.json. This file never carries a copy of a card. Cards written in
   the app are DRAFTS, kept apart from the deck until a session promotes them into
   cards.json and the build is run — see docs/DECISIONS.md D15.

   Written for a phone, one hand, at a terrace. */


/* ==================================================== 1. everything in Dutch

   All player-facing text is collected here, so it can be read and changed in one place
   without reading the logic. */

var T = {
  volgende:      'Volgende kaart',
  terug:         'Terug',
  bewaar:        'Bewaar kaart',
  kopieer:       'Kopieer',

  duimOp:        'Mooie kaart',
  duimNeer:      'Niet meer tonen',

  kiesMinuten:   'Naar de minuten',
  kiesKop:       'Allebei kiezen',
  kiesRegels:    ['Zeg het tegelijk, geen slagen om de arm.',
                  'Daarna één minuut om de ander te overtuigen dat hij fout zit.'],

  wieWijzen:     'Aanwijzen op drie',
  wieNu:         'Wijs!',
  wieKop:        'En?',
  wieRegels:     ['Wezen jullie naar dezelfde persoon? Dan klopt het.',
                  'Wezen jullie naar elkaar? Dat is het gesprek.'],

  weetJa:        'Ja, dat klopt',
  weetNee:       'Nee, dat klopt niet',
  weetGoedKop:   'Een punt',
  weetGoedTekst: 'Goed geraden.',
  weetFoutKop:   'Geen punt',
  weetFoutTekst: 'En een korte stilte.',

  onenigheidKop:    'Ieder een kant',
  onenigheidRegels: ['Ook als je het er eigenlijk mee eens bent.',
                     'Eén minuut per persoon.'],

  spelers:       ['Speler 1', 'Speler 2'],
  start:         'Start',
  stop:          'Stop',
  tijd:          'Tijd.',

  menu:          'Menu',
  eigenSchrijven:'Eigen kaart schrijven',
  naarOordeel:   'Wat vonden we ervan',
  opnieuw:       'Deck opnieuw schudden',
  opnieuwKop:    'Opnieuw schudden?',
  opnieuwTekst:  'Alle kaarten worden weer ongezien. Wat jullie mooi vonden en wat jullie ' +
                 'weggelegd hebben, blijft staan.',
  opnieuwJa:     'Ja, opnieuw schudden',
  nietsAf:       'Toch niet',

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

  oordeelGeen:   'Nog niets beoordeeld. Gebruik de duimen onder een kaart.',
  oordeelTerug:  'Terughalen',
  oordeelGeenOp: 'Nog geen mooie kaarten aangewezen.',
  oordeelGeenNeer:'Nog geen kaarten weggelegd.',
  gekopieerd:    'Gekopieerd.',
  nietGekopieerd:'Kopiëren lukte niet. Selecteer de tekst hierboven en kopieer met de hand.',

  ronde:         'ronde',

  geenGeheugen:  'Deze browser onthoudt niets — de app werkt, maar alles wat jullie ' +
                 'beoordelen of schrijven is weg zodra je hem sluit. Zet privémodus uit ' +
                 'als dat niet de bedoeling is.'
};


/* ========================================================= 2. the saved state

   localStorage, so it is per device and per browser. Play from one phone: two phones
   means two decks that drift apart on the first evening (docs/DECISIONS.md D10). */

var SLEUTEL = 'vragenspel';
var TIMER_SECONDEN = 60;
var EIGEN_START_ID = 1001;   /* clear of the deck's 1..118, which the build validates */

var stand = null;
var geheugenWerkt = true;

function legeStand() {
  return {
    gezien: [],                    /* ids dealt in the current pass through the deck */
    rondes: 0,                     /* completed passes */
    duimOp: [],                    /* ids marked as one of the good ones */
    duimNeer: [],                  /* ids retired; never dealt again */
    eigen: [],                     /* cards written here: {id, category, text} — drafts */
    volgendEigenId: EIGEN_START_ID,
    filter: [],                    /* chosen categories; empty means everything plays */
    huidige: null                  /* id of the card on the screen */
  };
}

function laadStand() {
  var opgeslagen;
  try {
    opgeslagen = window.localStorage.getItem(SLEUTEL);
  } catch (e) {
    /* Private mode, or storage switched off. The game is still playable, but nothing is
       kept — which the player is told, rather than left to discover. */
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


/* ================================================== 3. the elements on the page */

var waarschuwingEl = document.getElementById('waarschuwing');
var voortgangEl = document.getElementById('voortgang');
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

var PANELEN = [menuEl, eigenEl, oordeelEl];

var stapNu = null;      /* the card step being shown, so a panel can come back to it */

/* The steps that are a card. Every other screen — nothing left to deal, shuffle again —
   has no card under it, so it gets no verdict buttons. Filled in at the bottom of this
   file, once the step functions exist. */
var KAARTSTAPPEN = [];


/* ===================================================== 4. drawing the screen */

function toonWaarschuwing() {
  waarschuwingEl.textContent = T.geenGeheugen;
  waarschuwingEl.hidden = false;
}

/* The buttons in the bottom bar. Rebuilt for every step: the old buttons are removed,
   and their click handlers go with them. */
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

/* The two verdict buttons. Present under every card, at every step of it, because an
   opinion arrives whenever it arrives — but never on a screen that is not a card, where
   they would silently judge whichever card happened to be dealt last. */
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

function toonExtraTekst(kop, tekst) {
  extraEl.replaceChildren();
  if (kop) extraEl.appendChild(maakKop(kop));
  var alinea = document.createElement('p');
  alinea.className = 'extra-tekst';
  alinea.textContent = tekst;
  extraEl.appendChild(alinea);
  extraEl.hidden = false;
}

function toonVoortgang() {
  var totaal = speelbaar().length;
  var gezien = stand.gezien.length;
  voortgangEl.textContent = (stand.rondes > 0 ? T.ronde + ' ' + (stand.rondes + 1) + ' · ' : '') +
                            gezien + ' van ' + totaal;
}

/* Go to a card step. One place, so the clock is always stopped and any panel closed. */
function ga(stapFunctie) {
  stopKlok();
  stapNu = stapFunctie;
  sluitPanelen();
  kaartEl.hidden = false;
  toonVoortgang();
  stapFunctie();
  toonDuimen();
}

function sluitPanelen() {
  PANELEN.forEach(function (paneel) { paneel.hidden = true; });
  document.body.classList.remove('paneel-open');
}

/* Open one panel. The category colour steps back: a panel is not a card. */
function openPaneel(paneel, vulFunctie, acties) {
  stopKlok();
  kaartEl.hidden = true;
  sluitPanelen();
  paneel.hidden = false;
  document.body.classList.add('paneel-open');
  duimenEl.replaceChildren();
  toonVoortgang();
  vulFunctie();
  toonActies(acties);
}


/* ============================================ 5. which cards are still available

   The deck is cards.json plus whatever has been written here. Cards written here are
   drafts and are marked as such everywhere they appear. */

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

/* Everything that could still be dealt: not retired, and inside the chosen categories. */
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

/* The printed deck is shuffled, so this one is too. When the deck has been all the way
   round it shuffles again rather than stopping — at a terrace, a dead end mid-glass is
   worse than seeing a good question a second time. */
function deel() {
  var mogelijk = beschikbaar();

  if (!mogelijk.length) {
    var alles = speelbaar();
    if (!alles.length) { ga(stapLeeg); return; }
    stand.gezien = [];
    stand.rondes += 1;
    mogelijk = alles;
  }

  var gekozen = mogelijk[Math.floor(Math.random() * mogelijk.length)];
  stand.huidige = gekozen.id;
  if (stand.gezien.indexOf(gekozen.id) === -1) stand.gezien.push(gekozen.id);
  bewaarStand();
  ga(stapKaart);
}


/* ================================================= 6. reviewing while playing */

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
  toonVoortgang();
}

function haalOordeelTerug(id, lijstNaam) {
  var plek = stand[lijstNaam].indexOf(id);
  if (plek !== -1) stand[lijstNaam].splice(plek, 1);
  bewaarStand();
  vulOordeel();
  toonVoortgang();
}


/* =========================================================== 7. the card's steps

   No gate: the card is shown whole and the next one is one tap away. Four categories
   still have a step of their own, because the printed rules card gives them one. */

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

  var soort = soortVan(kaart.category);

  if (soort === 'kies' || soort === 'onenigheid') {
    toonActies([{ tekst: T.kiesMinuten, doe: function () { ga(stapKiezen); } }]);
  } else if (soort === 'wie') {
    toonActies([{ tekst: T.wieWijzen, doe: function () { ga(stapWieAftellen); } }]);
  } else if (soort === 'weet') {
    toonActies([
      { tekst: T.weetJa,  doe: function () { ga(stapWeetGoed); } },
      { tekst: T.weetNee, stil: true, doe: function () { ga(stapWeetFout); } }
    ]);
  } else {
    toonActies([{ tekst: T.volgende, doe: deel }]);
  }
}

/* ---- Wat kies je and Onenigheid: say it, then a minute each ---- */
function stapKiezen() {
  var soort = soortVan(huidigeKaart().category);
  if (soort === 'kies') toonExtraLijst(T.kiesKop, T.kiesRegels);
  else toonExtraLijst(T.onenigheidKop, T.onenigheidRegels);
  toonActies([{ tekst: T.start + ' · ' + T.spelers[0], groot: true,
                doe: function () { ga(stapTimers); } }]);
}

/* ---- Wie van ons? — point on three, then read the outcome ---- */
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
  toonExtraLijst(T.wieKop, T.wieRegels);
  toonActies([{ tekst: T.volgende, doe: deel }]);
}

/* ---- Weet jij dit? — self-reported, and nothing is written down ---- */
function stapWeetGoed() {
  toonExtraTekst(T.weetGoedKop, T.weetGoedTekst);
  toonActies([{ tekst: T.volgende, doe: deel }]);
}

function stapWeetFout() {
  toonExtraTekst(T.weetFoutKop, T.weetFoutTekst);
  toonActies([{ tekst: T.volgende, doe: deel }]);
}


/* ===================================================== 8. the one-minute timers */

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
  beurt.textContent = T.spelers[klokSpeler];
  extraEl.appendChild(beurt);

  var klok = document.createElement('p');
  klok.className = 'klok';
  klok.textContent = klokFase === 'af' ? T.tijd : klokTekst(klokRest);
  extraEl.appendChild(klok);
  extraEl.hidden = false;

  if (klokFase === 'loopt') {
    toonActies([{ tekst: T.stop, groot: true, doe: klokAfgelopen }]);
  } else if (klokSpeler === 0) {
    toonActies([{ tekst: T.start + ' · ' + T.spelers[1], groot: true, doe: volgendeSpeler }]);
  } else {
    toonActies([{ tekst: T.volgende, doe: deel }]);
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


/* ==================================================== 9. nothing left to deal */

function stapLeeg() {
  document.body.style.setProperty('--cc', '#2b3038');
  tagEl.textContent = '';
  vraagEl.className = 'vraag lang';
  vraagEl.textContent = T.leegKop;
  nrEl.textContent = '';
  toonExtraTekst('', stand.filter.length ? T.leegFilter : T.leegAlles);
  toonActies([{ tekst: T.menu, doe: openMenu }]);
}


/* ============================================================ 10. the menu */

function menuActies() {
  return [
    { tekst: T.terug, doe: sluitMenu },
    { tekst: T.eigenSchrijven, stil: true, doe: openEigen },
    { tekst: T.naarOordeel, stil: true, doe: openOordeel },
    { tekst: T.opnieuw, waarschuwing: true, doe: function () { ga(stapOpnieuw); } }
  ];
}

function openMenu() {
  openPaneel(menuEl, vulMenu, menuActies());
}

function sluitMenu() {
  if (stand.huidige !== null && kaartMetId(stand.huidige)) ga(stapNu || stapKaart);
  else deel();
}

function meervoud(aantal, enkel, meer) {
  return aantal + ' ' + (aantal === 1 ? enkel : meer);
}

function vulMenu() {
  filterEl.replaceChildren();
  DECK.categories.forEach(function (categorie) {
    var aan = stand.filter.indexOf(categorie.name) !== -1;
    var knop = document.createElement('button');
    knop.type = 'button';
    knop.className = 'cat';
    knop.style.setProperty('--cc', categorie.colour);
    knop.setAttribute('aria-pressed', aan ? 'true' : 'false');
    knop.textContent = categorie.name;
    knop.addEventListener('click', function () { wisselCategorie(categorie.name); });
    filterEl.appendChild(knop);
  });

  filterUitlegEl.textContent = stand.filter.length
    ? T.filterAan + ' ' + stand.filter.join(', ') + '.'
    : T.filterUit;

  deckUitlegEl.textContent =
    meervoud(alleKaarten().length, 'kaart', 'kaarten') + ' in totaal, waarvan ' +
    meervoud(stand.eigen.length, 'zelfgeschreven', 'zelfgeschreven') + '. ' +
    meervoud(stand.duimNeer.length, 'kaart', 'kaarten') + ' weggelegd, ' +
    meervoud(stand.duimOp.length, 'kaart', 'kaarten') + ' mooi gevonden.';
}

function wisselCategorie(naam) {
  var plek = stand.filter.indexOf(naam);
  if (plek === -1) stand.filter.push(naam);
  else stand.filter.splice(plek, 1);
  bewaarStand();
  vulMenu();
  toonVoortgang();
}


/* ================================================= 11. writing your own card

   These are drafts. They play at once, but they are not in cards.json — which stays the
   only editable copy of the deck — until a Claude Code session promotes them and the
   build is run. The warning about the public website is on the panel itself, at the
   moment of typing, because that is the only moment it can help. */

function openEigen() {
  openPaneel(eigenEl, vulEigen, [
    { tekst: T.bewaar, doe: bewaarEigen },
    { tekst: T.terug, stil: true, doe: openMenu }
  ]);
}

function vulEigen() {
  if (!eigenCategorieEl.options.length) {
    DECK.categories.forEach(function (categorie) {
      var optie = document.createElement('option');
      optie.value = categorie.name;
      optie.textContent = categorie.name;
      eigenCategorieEl.appendChild(optie);
    });
  }

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
    category: eigenCategorieEl.value,
    text: tekst
  });
  stand.volgendEigenId += 1;
  bewaarStand();

  eigenTekstEl.value = '';
  eigenMeldingEl.textContent = T.eigenBewaard;
  vulEigen();
  toonVoortgang();
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
  toonVoortgang();
}


/* ================================================ 12. the verdicts, and the export

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
   reads this. Cards written here carry their full text, because nothing else has them. */
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


/* ======================================================= 13. shuffling again */

function stapOpnieuw() {
  document.body.style.setProperty('--cc', '#2b3038');
  tagEl.textContent = '';
  vraagEl.className = 'vraag lang';
  vraagEl.textContent = T.opnieuwKop;
  nrEl.textContent = '';
  toonExtraTekst('', T.opnieuwTekst);
  toonActies([
    { tekst: T.opnieuwJa, waarschuwing: true, doe: doeOpnieuw },
    { tekst: T.nietsAf, stil: true, doe: openMenu }
  ]);
}

function doeOpnieuw() {
  stand.gezien = [];
  stand.rondes = 0;
  stand.huidige = null;
  bewaarStand();
  deel();
}


/* ============================================================= 14. starting up */

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


/* ================================================================ 15. the deck

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
  KAARTSTAPPEN = [stapKaart, stapKiezen, stapWieAftellen, stapWieUitslag,
                  stapWeetGoed, stapWeetFout, stapTimers];
  DECK.categories.forEach(function (categorie) {
    KLEUREN[categorie.name] = categorie.colour;
  });
  menuKnopEl.addEventListener('click', function () {
    if (menuEl.hidden && eigenEl.hidden && oordeelEl.hidden) openMenu();
    else sluitMenu();
  });
  begin();
}
