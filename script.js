/* =============================================================
   EDIT YOUR CONTENT HERE. Everything below is easy to replace.
   ============================================================= */
const CONTENT = {
  // Letter: each line is one chat bubble. Keep it honest and in your voice.
  chat: [
    "hi alyssa :)",
    "i didn't expect a simple match to turn into something i'd look forward to every day.",
    "somewhere along the way, talking to you became one of my favorite parts of the day.",
    "i find myself smiling at your messages, looking forward to our conversations, and wanting to know even the smallest things about you.",
    "i like how naturally you became someone important to me.",
    "so, i made you this. hope it makes you smile."
  ],
  chatSign: "that's all, i promise (for this section) ♡",

  // Song: put your mp3 in /music and set the file name + the title shown on the button.
  song: { file: "music/ilysb.mp3", title: "ilysb" },

  // Question cards for her to draw. Edit, add or remove freely: { cat: "Label", q: "Question" }
  cards: [
    { cat: "Little Joys", q: "What small thing always makes your day better?" },
    { cat: "Feeling at Home", q: "When do you feel most comfortable being yourself?" },
    { cat: "Love in Little Things",       q: "What's a small gesture that makes you feel loved?" },
    { cat: "Quiet Thoughts",       q: "What's something you wish people understood about you?" },
    { cat: "Favorite Memories", q: "What's one memory you wish you could experience again?" },
    { cat: "Growing Together", q: "What does a healthy relationship look like to you?" },
    { cat: "Little Things About Us",          q: "What's something about us that makes you smile?" },
    { cat: "Looking Ahead",      q: "What's something you'd love for us to experience together?" },
  ],

  // Moments: each frame shows a pretty placeholder picture until its src file exists in /images.
  // Add your photo with the same file name (or change the path) and it replaces the placeholder automatically.
  moments: [
    { src: "images/photo1.jpg", caption: "the first message" },
    { src: "images/photo2.jpg", caption: "late-night talks" },
    { src: "images/photo3.jpg", caption: "you, making me smile" },
    { src: "images/photo4.jpg", caption: "our first photo, soon ♡" }
  ],

  giftMessage: "Pink roses, because I heard you like pink ♡",
  // First date details. iso = "2026-12-05T18:00" enables a live countdown; leave "" to hide it.
  date: { iso: "", label: "Nov. 28, 2026", place: "Nuvali, Sta. Rosa", note: "I'm already looking forward to it." },

  finalText: "I know we've already gotten close and things between us have naturally grown into something special, but I don't think I've ever properly told you how I truly feel. I genuinely like you, Aly. I like you for who you are, and I'm happy that I get to know you more every day. I may not have said it properly before, but I want you to know that my feelings for you are real, and I mean every bit of affection I show you. ",
  finalSign: "This little website is yours, Alyssa. ♡"
};

/* ===== HELPERS ===== */
const $ = (s) => document.querySelector(s);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = (t) => Object.assign(document.createElement("div"), { textContent: t }).innerHTML;
const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));

/* ===== DRIFTING PETALS (one canvas, 26 petals) ===== */
const cv = $("#sky"), cx = cv.getContext("2d");
let W, H, sp = [];
const PC = ["#ff7fae", "#ffb3cf", "#ffffff", "#ff9fc2"];
function size() {
  W = cv.width = innerWidth; H = cv.height = innerHeight;
  sp = Array.from({ length: 26 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: 6 + Math.random() * 7, a: Math.random() * 6, va: (Math.random() - .5) * .03, vy: .25 + Math.random() * .45, p: Math.random() * 6, c: PC[Math.random() * 4 | 0] }));
}
function draw(t) {
  cx.clearRect(0, 0, W, H);
  sp.forEach((s) => {
    if (!reduce) { s.y += s.vy; s.a += s.va; s.x += Math.sin(t / 1500 + s.p) * .5; if (s.y > H + 20) { s.y = -20; s.x = Math.random() * W; } }
    cx.save(); cx.translate(s.x, s.y); cx.rotate(s.a); cx.globalAlpha = .6; cx.fillStyle = s.c;
    cx.beginPath(); cx.ellipse(0, 0, s.r * .55, s.r, 0, 0, 6.3); cx.fill(); cx.restore();
  });
  if (!reduce) requestAnimationFrame(draw);
}
size(); addEventListener("resize", () => { size(); if (reduce) draw(0); }); draw(0);

/* ===== OPEN ===== */
$("#openBtn").addEventListener("click", () => {
  $("#landing").classList.add("gone");
  $("#site").hidden = false;
  document.body.classList.remove("locked");
  scrollTo({ top: 0 });
  initReveal();
  setTimeout(() => ($("#landing").hidden = true), 1000);
});

/* ===== SCROLL REVEAL (also triggers the chat and the flower) ===== */
function initReveal() {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    if (e.target.classList.contains("phone")) runChat();
    io.unobserve(e.target);
  }), { threshold: .25 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}

/* ===== CHAT LETTER ===== */
let chatStarted = false;
async function runChat() {
  if (chatStarted) return; chatStarted = true;
  const box = $("#msgs");
  for (const line of CONTENT.chat) {
    const dots = Object.assign(document.createElement("div"), { className: "bub dots", innerHTML: "<i></i><i></i><i></i>" });
    if (!reduce) { box.appendChild(dots); await wait(700 + line.length * 18); dots.remove(); }
    box.appendChild(Object.assign(document.createElement("div"), { className: "bub", textContent: line }));
    await wait(350);
  }
  box.appendChild(Object.assign(document.createElement("div"), { className: "bub mine", textContent: CONTENT.chatSign }));
}

/* ===== QUESTION DECK: tap to flip, tap again to draw the next card ===== */
const Q = CONTENT.cards, deckBtn = $("#deckTop");
let qi = -1;
function drawCard() {
  const show = () => {
    qi = (qi + 1) % Q.length;
    $("#dCat").textContent = Q[qi].cat; $("#dQ").textContent = Q[qi].q;
    $("#dCount").textContent = `Card ${qi + 1} of ${Q.length}. Tap for the next one.`;
    deckBtn.classList.add("flip");
  };
  if (deckBtn.classList.contains("flip")) { deckBtn.classList.remove("flip"); setTimeout(show, reduce ? 0 : 450); } else show();
}
deckBtn.addEventListener("click", drawCard);

/* ===== PLACEHOLDER PHOTOS: a dreamy pink scene (SVG) used until the real photo file exists ===== */
const PAL = [["#ffd6e5", "#ff9fc4", "#ee5a8f", 290, 150], ["#ffe9d6", "#ffb3a7", "#e0407f", 110, 170], ["#e9d6ff", "#ffb0d0", "#c2336f", 200, 130], ["#fff0f5", "#ffc2d8", "#ff7fae", 300, 190]];
function artSrc(i) {
  const [a, b, c, sx, sy] = PAL[i % PAL.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>` +
    `<rect width="400" height="400" fill="url(#g)"/><circle cx="${sx}" cy="${sy}" r="84" fill="#fff" opacity=".22"/><circle cx="${sx}" cy="${sy}" r="46" fill="#fff" opacity=".9"/>` +
    `<ellipse cx="90" cy="105" rx="62" ry="15" fill="#fff" opacity=".55"/><ellipse cx="330" cy="75" rx="48" ry="12" fill="#fff" opacity=".5"/>` +
    `<path d="M0 290 Q110 230 210 285 T400 262 V400 H0Z" fill="${c}" opacity=".5"/><path d="M0 335 Q120 285 240 330 T400 315 V400 H0Z" fill="${c}" opacity=".85"/>` +
    `<g fill="#fff" opacity=".8"><circle cx="70" cy="250" r="3"/><circle cx="150" cy="210" r="2"/><circle cx="260" cy="240" r="3"/><circle cx="340" cy="215" r="2"/><circle cx="40" cy="190" r="2"/></g></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
function usePh(img, i) { img.onerror = null; img.src = artSrc(i); img.dataset.ph = "1"; }

/* ===== HANGING PHOTO FRAMES + LIGHTBOX ===== */
$("#gallery").innerHTML = CONTENT.moments.map((p, i) => `
  <button class="photo has-img" data-i="${i}" title="${esc(p.src)}">
    <div class="ph"><img src="${esc(p.src)}" alt="${esc(p.caption)}" loading="lazy" onerror="usePh(this,${i})"></div>
    <div class="cap">${esc(p.caption)}</div></button>`).join("");
const lb = $("#lightbox"), closeLb = () => (lb.hidden = true);
$("#gallery").addEventListener("click", (e) => {
  const b = e.target.closest(".photo"); if (!b) return;
  const img = b.querySelector("img"); if (!img) return;
  const p = CONTENT.moments[b.dataset.i];
  $("#lbImg").src = img.src; $("#lbImg").alt = p.caption; $("#lbCap").textContent = p.caption;
  lb.hidden = false; $("#lbClose").focus();
});
lb.addEventListener("click", (e) => { if (e.target === lb || e.target.id === "lbClose") closeLb(); });
addEventListener("keydown", (e) => e.key === "Escape" && closeLb());

/* ===== PINK ROSES (SVG built here): layered circles give each rose its swirl ===== */
const rose = (x, y, r, i) => {
  const L = [[1, "#c9356f", 0, 0], [.86, "#ee5a8f", -.04, 0], [.68, "#ff7fae", .05, -.03], [.5, "#e8487f", -.04, .04], [.32, "#ff9cc0", .03, -.02], [.15, "#d6336c", 0, 0]];
  const outer = [0, 1, 2, 3, 4].map((k) => { const a = k * 1.2566 - 1.57; return `<circle cx="${x + Math.cos(a) * r * .78}" cy="${y + Math.sin(a) * r * .78}" r="${r * .46}" fill="#ff9cc0" stroke="#c9356f" stroke-width=".8"/>`; }).join("");
  const swirl = L.map(([s, c, dx, dy]) => `<circle cx="${x + dx * r}" cy="${y + dy * r}" r="${r * s * .72}" fill="${c}" stroke="rgba(120,20,60,.35)" stroke-width=".8"/>`).join("");
  return `<g class="rose" style="--i:${i}">${outer}${swirl}</g>`;
};
const R = [[80, 138, 32, 1], [180, 138, 32, 2], [130, 92, 40, 0]]; // x, y, size, bloom order
$("#flowerSvg").innerHTML =
  R.map(([x, y, r]) => `<path class="stem" d="M${x} ${y + r * .7} Q${x} 205 130 268"/>`).join("") +
  `<g fill="#7fcf9f"><ellipse cx="104" cy="198" rx="7" ry="19" transform="rotate(-50 104 198)"/><ellipse cx="156" cy="198" rx="7" ry="19" transform="rotate(50 156 198)"/><ellipse cx="130" cy="184" rx="6" ry="17"/></g>` +
  `<g fill="#fff" stroke="#ff9cc0"><ellipse cx="114" cy="238" rx="17" ry="8" transform="rotate(-22 114 238)"/><ellipse cx="146" cy="238" rx="17" ry="8" transform="rotate(22 146 238)"/></g><circle cx="130" cy="240" r="5.5" fill="#ff7fae"/>` +
  R.map((a) => rose(...a)).join("");


/* First-date ticket: appears after the flower blooms */
$("#giftMsg").textContent = CONTENT.giftMessage;
const D = CONTENT.date, left = D.iso ? Math.ceil((new Date(D.iso) - Date.now()) / 864e5) : NaN;
$("#tWhen").textContent = D.label; $("#tPlace").textContent = D.place; $("#tNote").textContent = D.note;
if (left >= 0) $("#tDays").textContent = left; else $(".t-stub").hidden = true;
$("#flower").addEventListener("click", () => { $("#flower").classList.add("open"); $("#askBox").classList.add("on"); }, { once: true });

/* ===== FINAL ===== */
$("#finalText").textContent = CONTENT.finalText;
$("#finalSign").textContent = CONTENT.finalSign;

/* ===== MUSIC (OFF until clicked; browsers block autoplay) ===== */
const bgm = $("#bgm"), mb = $("#musicBtn");
bgm.src = CONTENT.song.file; bgm.volume = .6;
const setMusic = (on) => {
  mb.setAttribute("aria-pressed", on); mb.classList.toggle("playing", on);
  $("#musicLabel").textContent = (on ? "Playing · " : "Play ") + CONTENT.song.title;
};
setMusic(false);
mb.addEventListener("click", () => {
  if (bgm.paused) bgm.play().then(() => setMusic(true)).catch(() => alert("Add your song at " + CONTENT.song.file));
  else { bgm.pause(); setMusic(false); }
});