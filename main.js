// ====== Utility ======
const $ = (q, ctx=document) => ctx.querySelector(q);
const $$ = (q, ctx=document) => [...ctx.querySelectorAll(q)];

// ====== Navbar ======
const hamburger = $('#hamburger');
const menu = $('#menu');
hamburger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(open));
});

// Smooth scroll
$$('.menu a').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  const id = a.getAttribute('href');
  menu.classList.remove('open');
  document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
}));

// Year
$('#year').textContent = new Date().getFullYear();

// ====== Hero Slider ======
const slidesEl = $('#slides');
const dotsEl = $('#dots');
const slides = $$('.slide', slidesEl);
let idx = 0;
let autoTimer;
function go(i) {
  idx = (i + slides.length) % slides.length;
  slidesEl.style.transform = `translateX(-${idx * 100}%)`;
  // dots
  [...dotsEl.children].forEach((d, j) => d.classList.toggle('active', j === idx));
  restartAuto();
}
function makeDots() {
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    if (i === 0) b.classList.add('active');
    b.addEventListener('click', () => go(i));
    dotsEl.appendChild(b);
  });
}
function next() { go(idx + 1); }
function prev() { go(idx - 1); }
$('#next').addEventListener('click', next);
$('#prev').addEventListener('click', prev);
function startAuto(){ autoTimer = setInterval(next, 5000); }
function stopAuto(){ clearInterval(autoTimer); }
function restartAuto(){ stopAuto(); startAuto(); }
makeDots(); startAuto();
// Touch swipe
let startX = 0;
slidesEl.addEventListener('touchstart', e => { startX = e.touches[0].clientX; stopAuto(); }, {passive:true});
slidesEl.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - startX;
  if (dx > 40) prev();
  else if (dx < -40) next();
  startAuto();
});

// ====== Projects ======
const projects = [
  { id:'baju', title:'Desain Baju',  tag:'Apparel',      thumb:'assets/ph-apparel.svg', desc:'Kaos tipografi/logo untuk komunitas & brand lokal.' },
  { id:'mug', title:'Desain Mug',    tag:'Merch',        thumb:'assets/ph-mug.svg',     desc:'Ilustrasi & slogan tematik siap produksi.' },
  { id:'selimut', title:'Desain Selimut', tag:'Home',    thumb:'assets/ph-blanket.svg', desc:'Motif geometrik & floral untuk cozy vibes.' },
  { id:'bantal', title:'Desain Bantal',   tag:'Home',    thumb:'assets/ph-pillow.svg',  desc:'Set bantal dekoratif sesuai palet brand.' },
  { id:'banner', title:'Banner',      tag:'Promo',       thumb:'assets/ph-banner.svg',  desc:'Spanduk event/promosi dengan visual kuat.' },
  { id:'cover', title:'Cover Novel',  tag:'Publishing',  thumb:'assets/ph-book.svg',    desc:'Cover naratif yang menarik perhatian.' },
  { id:'hoodie', title:'Desain Hoodie', tag:'Apparel',   thumb:'assets/ph-hoodie.svg',  desc:'Streetwear look dengan identitas brand.' },
  { id:'goodiebag', title:'Goodiebag',  tag:'Merch',     thumb:'assets/ph-bag.svg',     desc:'Tote & goody bag untuk campaign & event.' },
  { id:'tumbler', title:'Tumbler',     tag:'Merch',      thumb:'assets/ph-tumbler.svg', desc:'Desain clean, mudah diaplikasi ke produk.' },
];
const grid = $('#projectGrid');
projects.forEach((p, i) => {
  const card = document.createElement('article');
  card.className = 'card';
  card.style.animationDelay = (i * 80) + 'ms';
  card.innerHTML = `
    <div class="thumb" style="background-image:url('${p.thumb}')"></div>
    <div class="body">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
        <h3>${p.title}</h3>
        <span class="tag">${p.tag}</span>
      </div>
      <p>${p.desc}</p>
      <div class="actions">
        <a href="case.html#${p.id}" class="btn small">Lihat Case Study</a>
        <a href="#contact" class="btn small ghost">Pesan Desain</a>
      </div>
    </div>`;
  grid.appendChild(card);
});

// ====== Contact Form (Serverless) ======
const form = $('#contactForm');
const formMsg = $('#formMsg');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formMsg.textContent = 'Mengirim...';
  const data = Object.fromEntries(new FormData(form).entries());
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Gagal mengirim.');
    formMsg.textContent = 'Terkirim! Saya akan membalas segera.';
    form.reset();
  } catch (err) {
    formMsg.textContent = 'Gagal mengirim. Coba lagi atau kirim ke email langsung.';
    console.error(err);
  }
});
