/* =========================================================
   A Little Universe Called Mahudi 💌🌌  —  script.js
   ========================================================= */

/* ---------------------------------------------------------
   ✏️ CONFIG — the part YOU edit
   --------------------------------------------------------- */
const CONFIG = {
  herName: "Mahudi",
  myName: "Harshu",
  typingSpeed: 36,

  // 🎵 MUSIC — put your song in this folder named "music" with any of these
  // extensions: .mp3 / .m4a / .wav / .ogg — the code tries each one automatically.
  // Set to "" to use a soft built-in melody instead (works instantly, no file needed).
  musicBase: "music",
  musicVolume: 0.35,

  // 📸 PHOTOS — put 17 images in a "photos" folder next to this file, named
  // photo1 ... photo17 (any of .jpg / .jpeg / .png / .webp — the code tries
  // every extension automatically, so you don't need to match one exactly).
  // photo1, photo2 and photo3 are shown as the three special "Memory Photo" moments.
  // photo4–photo17 appear together in the little gallery screen.
  photos: [
    { base: "photo1", caption: "This smile… 🥹❤️" },
    { base: "photo2", caption: "One of those moments I wish I could keep forever. ❤️" },
    { base: "photo3", caption: "Some memories don't need an explanation. ❤️" },
    { base: "photo4", caption: "❤️" },
    { base: "photo5", caption: "🌹" },
    { base: "photo6", caption: "🧸" },
    { base: "photo7", caption: "🐱" },
    { base: "photo8", caption: "🐼" },
    { base: "photo9", caption: "✨" },
    { base: "photo10", caption: "💗" },
    { base: "photo11", caption: "🌙" },
    { base: "photo12", caption: "🌌" },
    { base: "photo13", caption: "💌" },
    { base: "photo14", caption: "🌷" },
    { base: "photo15", caption: "🤍" },
    { base: "photo16", caption: "💞" },
    { base: "photo17", caption: "♾️" }
  ],

  // 💌 FREE FORM-TO-EMAIL — see the setup guide you were given.
  // Paste your own Web3Forms Access Key below (this key is meant to be public,
  // it is NOT a password and cannot be used to read your email).
  web3formsKey: "4eff86cb-4095-43fe-9457-3ead9e920993",
  notifyEmail: "harshsp.work@gmail.com",

  // 💬 REPLIES shown right after she picks an option. {her} is replaced with her name.
  responses: {
    freeday: {
      stars:  "Under the stars it is, then. Just the two of us and the whole sky. 🌌❤️",
      teddy:  "A cozy teddy-and-movie day sounds perfect, Jaanu. 🧸🎬",
      kittens: "Kittens it is 🐱 — you around little kittens is a whole mood I want to see.",
      panda:  "Doing nothing and annoying each other… honestly my favorite kind of day. 🐼😂",
      all:    "All of the above, obviously. Why choose when we can have it all? ❤️"
    },
    remember: {
      yes:   "That means more to me than you know. Thank you for being honest ❤️",
      maybe: "Maybe is okay. Maybe is real. Thank you for telling me 🥺"
    },
    milkyway: {
      stars:  "Just looking at the stars with you sounds like enough for a lifetime. 🌌",
      talk:   "Talking for hours, no rush, no clock — that's my favorite version of us. ❤️",
      laugh:  "Laughing about something stupid with you is genuinely my happy place. 😂",
      photos: "100 pictures it is 📸 — I want to remember every second of it.",
      quiet:  "Just sitting quietly together… sometimes that says more than words. 🥺"
    },
    finalq: {
      yes:  "🥹❤️ Then let's not rush anything. Let's simply start creating beautiful little moments again — one day, one conversation and one smile at a time. 🌷",
      maybe: "🥺❤️ Maybe is enough for today. You don't have to know everything immediately. Take your time. I'll focus on showing you through my actions what my words mean, and I'll be right here, understanding you."
    },
    playful1: {
      reply: "See, I knew it. 😌❤️ You always say you don't care, but your reply speed says otherwise.",
      smile: "Caught you. 😏 That little smile gives you away every time, Jaadi.",
      tease: "5 whole minutes?! Cruel. But honestly, worth the wait if it's you. 😂❤️",
      call:  "That's exactly what I'd want too — hearing your voice beats any text. 🥺❤️"
    },
    playful2: {
      true:  "Thought so. 😌❤️ Cheesy Harshu still wins, every single time.",
      deny:  "Suuure, Jaadi. 🙄😂 Your face says otherwise though.",
      maybe: "'A little' from you basically means 'a lot.' I know you too well. 😏❤️"
    }
  }
};

/* =========================================================
   Below is the engine. You don't need to change anything.
   ========================================================= */

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (min, max) => Math.random() * (max - min) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const HEART_EMOJIS = ['❤️', '💗', '💕', '🩷', '💖', '🤍', '💞'];
const fill = (text) => text.replace(/\{her\}/g, CONFIG.herName).replace(/\{me\}/g, CONFIG.myName);

let runToken = 0;
let busy = false;
let typing = false;
let skip = false;

/* collected as she interacts — this IS the single source of truth */
const userResponses = {};

/* ---------------------------------------------------------
   Typewriter
   --------------------------------------------------------- */
async function typeInto(el, text) {
  const full = text ?? el.dataset.text ?? '';
  const chars = Array.from(full);
  const myRun = (el._run = (el._run || 0) + 1);

  const done = document.createElement('span');
  done.className = 't-done';
  const rest = document.createElement('span');
  rest.className = 't-rest';
  rest.textContent = full;

  el.textContent = '';
  el.append(done, rest);
  el.classList.add('typing');
  typing = true;
  skip = false;

  const pauses = { '.': 260, '…': 320, ',': 150, '?': 260, '!': 220 };
  let shown = '';

  for (let i = 0; i < chars.length; i++) {
    if (el._run !== myRun) return;
    if (skip) break;
    shown += chars[i];
    done.textContent = shown;
    rest.textContent = chars.slice(i + 1).join('');
    if (i % 12 === 0) scrollCard(el);
    await sleep(CONFIG.typingSpeed + (pauses[chars[i]] || 0));
  }

  if (el._run !== myRun) return;
  el.textContent = full;
  el.classList.remove('typing');
  typing = false;
  skip = false;
  scrollCard(el);
}

function scrollCard(el) {
  const card = el.closest('.card');
  if (card && card.scrollHeight > card.clientHeight) {
    card.scrollTo({ top: card.scrollHeight, behavior: 'smooth' });
  }
}

async function playScreen(screen) {
  const token = ++runToken;
  const steps = $$('[data-step]', screen);
  await sleep(350);

  for (const el of steps) {
    if (token !== runToken) return;
    el.classList.add('show');
    scrollCard(el);
    if (el.hasAttribute('data-celebrate')) celebrate();

    if (el.hasAttribute('data-type')) {
      await typeInto(el);
      await sleep(Number(el.dataset.pause) || 450);
    } else {
      await sleep(Number(el.dataset.delay) || 700);
    }
  }
}

async function goTo(nextScreen) {
  if (busy || !nextScreen) return;
  busy = true;
  const current = $('.screen.active');
  current.classList.add('leaving');
  await sleep(520);
  current.classList.remove('active', 'leaving');
  nextScreen.classList.add('active');
  busy = false;
  playScreen(nextScreen);
}

/* ---------------------------------------------------------
   Stars + floating hearts
   --------------------------------------------------------- */
function makeStars() {
  const box = $('#stars');
  const count = window.matchMedia('(max-width: 600px)').matches ? 40 : 70;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'star';
    const size = rand(1, 2.6);
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.left = rand(0, 100) + '%';
    s.style.top = rand(0, 100) + '%';
    s.style.setProperty('--tdur', rand(2, 6) + 's');
    box.append(s);
  }
}

function makeHearts() {
  const box = $('#hearts');
  const count = window.matchMedia('(max-width: 600px)').matches ? 16 : 26;
  for (let i = 0; i < count; i++) {
    const h = document.createElement('span');
    h.className = 'heart';
    h.textContent = pick(HEART_EMOJIS);
    h.style.setProperty('--x', rand(0, 100) + '%');
    h.style.setProperty('--size', rand(14, 34) + 'px');
    h.style.setProperty('--dur', rand(9, 18) + 's');
    h.style.setProperty('--delay', -rand(0, 18) + 's');
    h.style.setProperty('--drift', rand(-80, 80) + 'px');
    h.style.setProperty('--rot', rand(-40, 40) + 'deg');
    box.append(h);
  }
}

function burst(x, y, emoji = '❤️', count = 6, spread = 60) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'pop-heart';
    p.textContent = Array.isArray(emoji) ? pick(emoji) : emoji;
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.setProperty('--dx', rand(-spread, spread) + 'px');
    p.style.setProperty('--dy', -spread * rand(0.8, 1.6) + 'px');
    p.style.animationDuration = 0.9 + spread / 250 + 's';
    document.body.append(p);
    setTimeout(() => p.remove(), 2200);
  }
}

function celebrate() {
  for (let i = 0; i < 28; i++) {
    setTimeout(() => {
      burst(rand(10, window.innerWidth - 10), window.innerHeight - 20, HEART_EMOJIS, 1, 260);
    }, i * 120);
  }
}

/* ---------------------------------------------------------
   Photos — the 3 dedicated moments + the gallery of the rest
   Tries several file extensions automatically, and logs to the
   console (F12) exactly which paths it tried, to make fixing a
   missing photo easy.
   --------------------------------------------------------- */
const PHOTO_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG'];

function loadImageWithFallback(img, base, onAllFail) {
  const candidates = PHOTO_EXTS.map((ext) => `photos/${base}.${ext}`);
  let i = 0;
  function tryNext() {
    if (i >= candidates.length) {
      console.warn(`[photo] none of these worked for "${base}":`, candidates);
      onAllFail && onAllFail();
      return;
    }
    img.src = candidates[i++];
  }
  img.onerror = tryNext;
  tryNext();
}

function buildDedicatedPhoto(elId, photo) {
  const fig = $('#' + elId);
  if (!fig || !photo) return;
  const img = document.createElement('img');
  img.alt = photo.caption || 'A memory of us';
  img.loading = 'lazy';
  fig.append(img);
  loadImageWithFallback(img, photo.base, () => { fig.style.display = 'none'; });
}

function buildGallery() {
  const strip = $('#photoGallery');
  if (!strip) return;
  const rest = CONFIG.photos.slice(3);
  if (!rest.length) { strip.remove(); return; }

  rest.forEach((p, i) => {
    const fig = document.createElement('figure');
    fig.className = 'polaroid';
    fig.style.setProperty('--tilt', (i % 2 ? 3 : -3) + 'deg');
    const img = document.createElement('img');
    img.alt = p.caption || 'A little moment';
    img.loading = 'lazy';
    fig.append(img);
    if (p.caption) {
      const cap = document.createElement('figcaption');
      cap.textContent = p.caption;
      fig.append(cap);
    }
    strip.append(fig);
    loadImageWithFallback(img, p.base, () => fig.remove());
  });
}

/* ---------------------------------------------------------
   Music
   --------------------------------------------------------- */
let muted = false;
let musicStarted = false;
let audio = null;
let ctx = null;
let master = null;

const AUDIO_EXTS = ['mp3', 'm4a', 'wav', 'ogg', 'MP3'];

function startMusic() {
  if (musicStarted) return;
  musicStarted = true;

  if (CONFIG.musicBase) {
    tryAudioFallback(0);
  } else {
    startSynth();
  }
}

function tryAudioFallback(i) {
  if (i >= AUDIO_EXTS.length) {
    console.warn(`[music] no file found named "${CONFIG.musicBase}" with any of these extensions:`, AUDIO_EXTS);
    startSynth();
    return;
  }
  const path = `${CONFIG.musicBase}.${AUDIO_EXTS[i]}`;
  const test = new Audio(path);
  test.loop = true;
  test.volume = CONFIG.musicVolume;
  test.muted = muted;
  test.addEventListener('canplaythrough', () => {
    audio = test;
    audio.play().catch(() => startSynth());
  }, { once: true });
  test.addEventListener('error', () => tryAudioFallback(i + 1), { once: true });
  test.load();
}

function startSynth() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  if (ctx.resume) ctx.resume();

  master = ctx.createGain();
  master.gain.value = muted ? 0 : CONFIG.musicVolume;
  master.connect(ctx.destination);

  const echo = ctx.createDelay(1.0);
  echo.delayTime.value = 0.5;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.4;
  echo.connect(feedback);
  feedback.connect(echo);
  echo.connect(master);

  const chords = [
    [261.63, 329.63, 392.00, 493.88],
    [220.00, 261.63, 329.63, 392.00],
    [174.61, 220.00, 261.63, 329.63],
    [196.00, 246.94, 293.66, 329.63]
  ];
  const pattern = [0, 1, 2, 3, 2, 1, 3, 2];
  let step = 0;

  function note(freq, when, dur, vol) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(vol, when + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(g);
    g.connect(master);
    g.connect(echo);
    osc.start(when);
    osc.stop(when + dur + 0.05);
  }

  setInterval(() => {
    if (!ctx || ctx.state !== 'running') return;
    const chord = chords[Math.floor(step / 8) % chords.length];
    const i = step % 8;
    const now = ctx.currentTime + 0.05;
    if (i === 0) note(chord[0] / 2, now, 4.2, 0.35);
    note(chord[pattern[i]], now, 2.4, 0.22);
    step++;
  }, 550);
}

$('#muteBtn').addEventListener('click', () => {
  muted = !muted;
  $('#muteBtn').textContent = muted ? '🔇' : '🔊';
  if (audio) audio.muted = muted;
  if (master) master.gain.setTargetAtTime(muted ? 0 : CONFIG.musicVolume, ctx.currentTime, 0.1);
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (ctx && ctx.suspend) ctx.suspend();
    if (audio) audio.pause();
  } else {
    if (ctx && ctx.resume) ctx.resume();
    if (audio && musicStarted) audio.play().catch(() => {});
  }
});

/* ---------------------------------------------------------
   Interactions
   --------------------------------------------------------- */
document.addEventListener('click', () => { if (typing) skip = true; }, true);

document.addEventListener('click', (e) => {
  const b = e.target.closest('.btn, .option');
  if (!b) return;
  b.classList.remove('pressed');
  void b.offsetWidth;
  b.classList.add('pressed');
  burst(e.clientX, e.clientY, ['❤️', '💗', '✨'], 6, 60);
});

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-next]');
  if (!btn) return;
  startMusic();
  goTo(btn.closest('.screen').nextElementSibling);
});

// Choice questions — reused for every data-choices group on the page
$$('[data-choices]').forEach((group) => {
  const screen = group.closest('.screen');
  const resp = $('.response', screen);
  const next = $('[data-late][data-next]', screen);
  const question = group.dataset.question || '';

  group.addEventListener('click', async (e) => {
    const btn = e.target.closest('.option');
    if (!btn) return;

    $$('.option', group).forEach((b) => b.classList.remove('selected'));
    btn.classList.add('selected');

    // save her answer exactly as chosen
    userResponses[group.dataset.choices] = {
      question,
      answer: btn.textContent.trim()
    };

    const replyText = (CONFIG.responses[group.dataset.choices] || {})[btn.dataset.choice] || '❤️';
    if (resp) {
      resp.classList.add('show');
      await typeInto(resp, fill(replyText));
    }

    $$('[data-late]', screen).forEach((el) => el.classList.add('show'));
    if (next) scrollCard(next);
  });
});

// Textarea typing animation (used on the final-message screen)
(function setupAnswerBox() {
  const answer = $('#heartAnswer');
  const dots = $('#typingDots');
  if (!answer) return;
  let idle;
  let keys = 0;

  answer.addEventListener('input', () => {
    dots.classList.add('on');
    answer.classList.add('glow');
    clearTimeout(idle);
    idle = setTimeout(() => {
      dots.classList.remove('on');
      answer.classList.remove('glow');
    }, 900);

    keys++;
    if (keys % 4 === 0) {
      const r = answer.getBoundingClientRect();
      burst(r.left + rand(20, r.width - 20), r.top + 8, ['💗', '✨', '💕'], 1, 50);
    }
  });
})();

/* ---------------------------------------------------------
   Gallery slide arrows
   --------------------------------------------------------- */
function scrollGalleryBy(dir) {
  const strip = $('#photoGallery');
  if (!strip) return;
  const card = strip.querySelector('.polaroid');
  const step = card ? card.getBoundingClientRect().width + 14 : 150;
  strip.scrollBy({ left: dir * step * 2, behavior: 'smooth' });
}
const galleryPrev = $('#galleryPrev');
const galleryNext = $('#galleryNext');
if (galleryPrev) galleryPrev.addEventListener('click', () => scrollGalleryBy(-1));
if (galleryNext) galleryNext.addEventListener('click', () => scrollGalleryBy(1));

/* ---------------------------------------------------------
   Collect + submit her responses
   --------------------------------------------------------- */
function collectTextFields() {
  const box = $('#heartAnswer');
  if (box && box.value.trim()) {
    userResponses.heartAnswer = {
      question: $('#screen-finalmessage .answer-wrap').dataset.question || "What's in your heart?",
      answer: box.value.trim()
    };
  }
}

function buildMessage() {
  collectTextFields();

  // reading order — only keys that actually exist are included, nothing invented
  const order = ['freeday', 'remember', 'milkyway', 'heartAnswer', 'finalq'];

  let msg = `${CONFIG.herName.toUpperCase()} — HER RESPONSES ❤️\n\n`;
  msg += `Submitted: ${new Date().toLocaleString()}\n\n`;
  msg += `--------------------------------\n\n`;

  order.forEach((key) => {
    const r = userResponses[key];
    if (!r) return;
    msg += `${r.question}\n${r.answer}\n\n--------------------------------\n\n`;
  });

  msg += `END OF RESPONSES ❤️`;
  return msg;
}

async function submitResponses() {
  const message = buildMessage();

  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: CONFIG.web3formsKey,
      subject: `${CONFIG.herName} — Her Little Chapter ❤️`,
      from_name: CONFIG.herName,
      email: CONFIG.notifyEmail,
      message
    })
  });

  const data = await res.json();
  if (!data.success) throw new Error('submit failed');
}

const keepBtn = $('#keepBtn');
const failOverlay = $('#failOverlay');

async function attemptSubmit() {
  keepBtn.disabled = true;
  const originalText = keepBtn.textContent;
  keepBtn.textContent = 'Sealing our little chapter… 💌';

  try {
    await submitResponses();
    failOverlay.classList.remove('show');
    startMusic();
    goTo($('#screen-success'));
  } catch (err) {
    keepBtn.disabled = false;
    keepBtn.textContent = originalText;
    failOverlay.classList.add('show');
  }
}

if (keepBtn) keepBtn.addEventListener('click', attemptSubmit);
$('#retryBtn').addEventListener('click', () => {
  failOverlay.classList.remove('show');
  attemptSubmit();
});

/* ---------------------------------------------------------
   Start
   --------------------------------------------------------- */
function init() {
  document.title = fill(document.title);

  const walker = document.createTreeWalker($('#app'), NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) walker.currentNode.nodeValue = fill(walker.currentNode.nodeValue);

  $$('[data-type]').forEach((el) => {
    el.dataset.text = el.textContent.trim().replace(/\s+/g, ' ');
    el.textContent = '';
  });

  buildDedicatedPhoto('photoOne', CONFIG.photos[0]);
  buildDedicatedPhoto('photoTwo', CONFIG.photos[1]);
  buildDedicatedPhoto('photoThree', CONFIG.photos[2]);
  buildGallery();

  makeStars();
  makeHearts();
  playScreen($('.screen.active'));
}

init();