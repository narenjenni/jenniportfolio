// ===== Tailwind V4 JS =====
const $ = (q, ctx=document) => ctx.querySelector(q);
const $$ = (q, ctx=document) => [...ctx.querySelectorAll(q)];

// Mobile menu
const hamburger = $('#hamburger');
const menuMobile = $('#menuMobile');
hamburger.addEventListener('click', () => {
  const open = menuMobile.classList.toggle('hidden') === false;
  hamburger.setAttribute('aria-expanded', String(open));
});

// Year
$('#year').textContent = new Date().getFullYear();

// Hero slider
const slidesEl = $('#slides');
const dotsEl = $('#dots');
const slides = slidesEl.children;
let idx = 0;
function go(i){ idx=(i+slides.length)%slides.length; slidesEl.style.transform=`translateX(-${idx*100}%)`; [...dotsEl.children].forEach((d,j)=>d.classList.toggle('bg-white', j===idx)); [...dotsEl.children].forEach((d,j)=>d.classList.toggle('bg-white/40', j!==idx)); }
function next(){ go(idx+1); }
function prev(){ go(idx-1); }
$('#next').addEventListener('click', next);
$('#prev').addEventListener('click', prev);
for(let i=0;i<slides.length;i++){ const b=document.createElement('button'); b.className='w-2.5 h-2.5 rounded-full bg-white/40'; if(i===0) b.classList.add('bg-white'); b.addEventListener('click',()=>go(i)); dotsEl.appendChild(b); }
let timer = setInterval(next, 5000);
slidesEl.addEventListener('mouseenter', ()=>clearInterval(timer));
slidesEl.addEventListener('mouseleave', ()=>timer=setInterval(next, 5000));

// Reveal on scroll
const io = new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('show'); }); }, {threshold:.1});
$$('.reveal').forEach(el=>io.observe(el));

// Data
const projects = [
  { id:'baju',      title:'Desain Baju',     tag:'Apparel',    thumb:'assets/ph-apparel.svg',  desc:'Kaos tipografi/logo—komunikasi jelas & siap sablon.' },
  { id:'mug',       title:'Desain Mug',      tag:'Merch',      thumb:'assets/ph-mug.svg',      desc:'Ilustrasi & slogan tematik—layout 360°.' },
  { id:'selimut',   title:'Desain Selimut',  tag:'Home',       thumb:'assets/ph-blanket.svg',  desc:'Motif geometrik & floral—varian warna.' },
  { id:'bantal',    title:'Desain Bantal',   tag:'Home',       thumb:'assets/ph-pillow.svg',   desc:'Dekoratif—pattern ringan & ikonografi sederhana.' },
  { id:'banner',    title:'Banner',          tag:'Promo',      thumb:'assets/ph-banner.svg',   desc:'Hierarki tegas, CTA jelas, jarak baca aman.' },
  { id:'cover',     title:'Cover Novel',     tag:'Publishing', thumb:'assets/ph-book.svg',     desc:'Komposisi naratif, warna emosional, tipografi tematik.' },
  { id:'hoodie',    title:'Desain Hoodie',   tag:'Apparel',    thumb:'assets/ph-hoodie.svg',   desc:'Streetwear look—front/back/sleeve placement.' },
  { id:'goodiebag', title:'Goodiebag',       tag:'Merch',      thumb:'assets/ph-bag.svg',      desc:'Media event/brand—high contrast untuk sablon.' },
  { id:'tumbler',   title:'Tumbler',         tag:'Merch',      thumb:'assets/ph-tumbler.svg',  desc:'Wrap 360°—keterbacaan dari berbagai sudut.' },
];

const selected = [
  { link:'case.html#banner',  media:'assets/ph-banner.svg',  title:'Banner Campaign', kpis:['↑ Reach', '↑ CTR', 'On-time'] },
  { link:'case.html#cover',   media:'assets/ph-book.svg',    title:'Cover Novel',     kpis:['↑ Preorder', 'Brand-fit', 'Rapi'] },
  { link:'case.html#hoodie',  media:'assets/ph-hoodie.svg',  title:'Hoodie Street',   kpis:['Mockup', 'Siap sablon', 'Variasi'] },
  { link:'case.html#mug',     media:'assets/ph-mug.svg',     title:'Mug Series',      kpis:['4 desain', 'CMYK OK', 'Wrap 360°'] },
];

// Render Selected
const selWrap = document.getElementById('selectedWrap');
selWrap.innerHTML = selected.map(s => `
  <article class="interactive-card relative overflow-hidden rounded-2xl bg-gradient-to-b from-brand-600/50 to-brand-700/60 border border-white/20 shadow-soft hover:shadow-hard hover:-translate-y-0.5 transition-all duration-300 grid grid-cols-1 md:grid-cols-2 focus-within:ring-2 focus-within:ring-accent-300/40">
    <div class="aspect-[16/10] bg-center bg-cover" style="background-image:url('${s.media}')"></div>
    <div class="p-4 grid content-start gap-2">
      <h3 class="font-semibold text-lg">${s.title}</h3>
      <div class="flex flex-wrap gap-2">${s.kpis.map(k=>`<span class="px-2 py-1 rounded-full glass border border-white/10 text-sm">${k}</span>`).join('')}</div>
      <div class="mt-1 flex gap-2 flex-wrap">
        <a href="${s.link}" class="px-3 py-2 rounded-full bg-accent-300 text-brand-900 font-semibold transition-transform active:scale-95">Buka Case</a>
        <a href="#contact" class="px-3 py-2 rounded-full glass border border-white/10 transition-transform active:scale-95">Pesan Desain</a>
      </div>
    </div>
  </article>
`).join('');

// Metrics
document.getElementById('m1').textContent = new Set(projects.map(p=>p.tag)).size;
document.getElementById('m2').textContent = projects.length;

// Projects grid
const grid = document.getElementById('projectGrid');
const filters = document.getElementById('filters');
const search = document.getElementById('search');
const sort = document.getElementById('sort');

function render(list){
  grid.innerHTML = list.map(p => `
    <article class="interactive-card relative overflow-hidden rounded-2xl bg-gradient-to-b from-brand-600/50 to-brand-700/60 border border-white/20 shadow-soft hover:shadow-hard hover:-translate-y-0.5 transition-all duration-300 focus-within:ring-2 focus-within:ring-accent-300/40">
      <div class="aspect-[4/3] bg-center bg-cover" style="background-image:url('${p.thumb}')"></div>
      <div class="p-4 grid gap-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="font-semibold">${p.title}</h3>
          <span class="text-sm text-white/80">${p.tag}</span>
        </div>
        <p class="text-white/80">${p.desc}</p>
        <div class="flex gap-2">
          <a href="case.html#${p.id}" class="px-3 py-2 rounded-full bg-accent-300 text-brand-900 font-semibold transition-transform active:scale-95">Case Study</a>
          <a href="#contact" class="px-3 py-2 rounded-full glass border border-white/10 transition-transform active:scale-95">Pesan</a>
        </div>
      </div>
    </article>
  `).join('');
}

let filterVal = 'all';
function getList(){
  let list = projects.filter(p => filterVal==='all' || p.tag===filterVal);
  const q = (search.value||'').toLowerCase();
  if(q) list = list.filter(p => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
  if (sort.value==='az') list.sort((a,b)=>a.title.localeCompare(b.title));
  if (sort.value==='za') list.sort((a,b)=>b.title.localeCompare(a.title));
  if (sort.value==='cat') list.sort((a,b)=>a.tag.localeCompare(b.tag) || a.title.localeCompare(b.title));
  return list;
}

filters.addEventListener('click', e => {
  const btn = e.target.closest('.chip'); if(!btn) return;
  $$('.chip', filters).forEach(c=>c.classList.remove('bg-white','text-brand-900')); 
  btn.classList.add('bg-white','text-brand-900');
  filterVal = btn.dataset.filter; render(getList());
});
search.addEventListener('input', ()=>render(getList()));
sort.addEventListener('change', ()=>render(getList()));
render(getList());

// Contact form
const form = document.getElementById('contactForm'); const formMsg = document.getElementById('formMsg');
form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  formMsg.textContent = 'Mengirim...';
  const data = Object.fromEntries(new FormData(form).entries());
  try{
    const r = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
    const j = await r.json(); if(!r.ok) throw new Error(j.error||'Gagal');
    formMsg.textContent = 'Terkirim! Saya akan membalas segera.'; form.reset();
  }catch(err){ formMsg.textContent = 'Gagal mengirim. Coba lagi atau email langsung.'; console.error(err); }
});


// Press/active animation on cards
function wireCards(){
  document.querySelectorAll('.interactive-card').forEach(el=>{
    const down = ()=>{ el.style.transform = (el.style.transform||'') + ' scale(0.98) translateY(1px)'; };
    const up = ()=>{ el.style.transform = el.style.transform.replace(' scale(0.98) translateY(1px)',''); };
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    el.addEventListener('mouseleave', up);
  });
}
wireCards();
