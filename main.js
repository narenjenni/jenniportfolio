// ====== Helpers ======
const $ = (q, ctx=document) => ctx.querySelector(q);
const $$ = (q, ctx=document) => [...ctx.querySelectorAll(q)];

// ====== Navbar & Theme ======
const hamburger = $('#hamburger');
const menu = $('#menu');
const themeToggle = $('#themeToggle');
hamburger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(open));
});
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('contrast');
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

// ====== Hero Slider (Ken Burns) ======
const slidesEl = $('#slides');
const dotsEl = $('#dots');
const slides = $$('.slide', slidesEl);
let idx = 0;
let autoTimer;
function go(i) {
  idx = (i + slides.length) % slides.length;
  slidesEl.style.transform = `translateX(-${idx * 100}%)`;
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
let startX = 0;
slidesEl.addEventListener('touchstart', e => { startX = e.touches[0].clientX; stopAuto(); }, {passive:true});
slidesEl.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - startX; if (dx > 40) prev(); else if (dx < -40) next(); startAuto(); });

// Pause animation on hover (desktop)
slidesEl.addEventListener('mouseenter', stopAuto);
slidesEl.addEventListener('mouseleave', startAuto);

// ====== Projects Data ======
const projects = [
  { id:'baju',      title:'Desain Baju',     tag:'Apparel',    thumb:'assets/ph-apparel.svg',  desc:'Kaos tipografi/logo untuk komunitas & brand lokal.' },
  { id:'mug',       title:'Desain Mug',      tag:'Merch',      thumb:'assets/ph-mug.svg',      desc:'Ilustrasi & slogan tematik siap produksi.' },
  { id:'selimut',   title:'Desain Selimut',  tag:'Home',       thumb:'assets/ph-blanket.svg',  desc:'Motif geometrik & floral untuk suasana cozy.' },
  { id:'bantal',    title:'Desain Bantal',   tag:'Home',       thumb:'assets/ph-pillow.svg',   desc:'Bantal dekoratif sesuai palet brand.' },
  { id:'banner',    title:'Banner',          tag:'Promo',      thumb:'assets/ph-banner.svg',   desc:'Spanduk event/promosi dengan visual kuat.' },
  { id:'cover',     title:'Cover Novel',     tag:'Publishing', thumb:'assets/ph-book.svg',     desc:'Cover naratif yang menarik perhatian.' },
  { id:'hoodie',    title:'Desain Hoodie',   tag:'Apparel',    thumb:'assets/ph-hoodie.svg',   desc:'Streetwear look dengan identitas brand.' },
  { id:'goodiebag', title:'Goodiebag',       tag:'Merch',      thumb:'assets/ph-bag.svg',      desc:'Tote & goody bag untuk campaign & event.' },
  { id:'tumbler',   title:'Tumbler',         tag:'Merch',      thumb:'assets/ph-tumbler.svg',  desc:'Desain clean, mudah diaplikasi ke produk.' },
];

// ====== Project Rendering + Filter/Search ======
const grid = $('#projectGrid');
const filters = $('#filters');
const searchInput = $('#search');

let activeFilter = 'all';
function renderCards() {
  grid.innerHTML = '';
  const kw = (searchInput.value || '').toLowerCase();
  const filtered = projects.filter(p => (activeFilter === 'all' || p.tag === activeFilter) && (p.title.toLowerCase().includes(kw) || p.desc.toLowerCase().includes(kw)));
  filtered.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'card reveal';
    card.style.animationDelay = (i * 70) + 'ms';
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
  // update stat
  const statEl = document.getElementById('statProjects');
  statEl.dataset.count = String(filtered.length);
  countUp(statEl);
}
filters.addEventListener('click', (e) => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  $$('.chip', filters).forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = btn.dataset.filter;
  renderCards();
});
searchInput.addEventListener('input', renderCards);

// Reveal animation on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: .1 });
function observeReveals(){ $$('.card.reveal').forEach(el => io.observe(el)); }
new MutationObserver(observeReveals).observe(grid, { childList: true });
renderCards(); observeReveals();

// ====== Counters ======
function countUp(el) {
  const target = +el.dataset.count || 0;
  let n = 0; const step = Math.max(1, Math.round(target / 30));
  const timer = setInterval(() => {
    n += step;
    if (n >= target) { n = target; clearInterval(timer); }
    el.textContent = n;
  }, 30);
}
$$('.stat-num').forEach(countUp);

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
