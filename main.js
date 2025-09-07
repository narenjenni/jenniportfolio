// ===== Redesign V3 JS =====
const $ = (q, ctx=document) => ctx.querySelector(q);
const $$ = (q, ctx=document) => [...ctx.querySelectorAll(q)];

// Mobile menu
const hamburger = $('#hamburger');
const menu = $('#menu');
hamburger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(open));
});

// Year
$('#year').textContent = new Date().getFullYear();

// Rotator
const words = ['merchandise', 'apparel', 'banner', 'cover novel', 'goodiebag'];
const rotator = $('#rotator');
let wi = 0;
setInterval(() => {
  wi = (wi + 1) % words.length;
  rotator.textContent = words[wi];
}, 2200);

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

// Render selected
const selWrap = $('#selectedWrap');
selWrap.innerHTML = selected.map(s => `
  <article class="sel-card">
    <div class="sel-media" style="background-image:url('${s.media}')"></div>
    <div class="sel-body">
      <h3>${s.title}</h3>
      <div class="kpis">${s.kpis.map(k => `<span class="kpi">${k}</span>`).join('')}</div>
      <div class="sel-actions">
        <a href="${s.link}" class="btn small">Buka Case</a>
        <a href="#contact" class="btn small ghost">Pesan Desain</a>
      </div>
    </div>
  </article>
`).join('');

// Metrics
$('#m1').textContent = new Set(projects.map(p => p.tag)).size;
$('#m2').textContent = projects.length;

// Projects grid
const grid = $('#projectGrid');
const filters = $('#filters');
const search = $('#search');
const sort = $('#sort');

function render(list){
  grid.innerHTML = list.map(p => `
    <article class="card">
      <div class="thumb" style="background-image:url('${p.thumb}')"></div>
      <div class="body">
        <div class="row">
          <h3>${p.title}</h3>
          <span class="tag">${p.tag}</span>
        </div>
        <p>${p.desc}</p>
        <div class="row">
          <a class="btn small" href="case.html#${p.id}">Case Study</a>
          <a class="btn small ghost" href="#contact">Pesan</a>
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
  $$('.chip', filters).forEach(c=>c.classList.remove('active')); btn.classList.add('active');
  filterVal = btn.dataset.filter; render(getList());
});
search.addEventListener('input', ()=>render(getList()));
sort.addEventListener('change', ()=>render(getList()));

render(getList());

// Contact form
const form = $('#contactForm'); const formMsg = $('#formMsg');
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
