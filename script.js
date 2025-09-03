
// Mobile nav
const menuBtn = document.getElementById('menuBtn');
menuBtn?.addEventListener('click', ()=> document.getElementById('nav').classList.toggle('open'));

// Lightbox
(function(){
  const layer = document.createElement('div');
  layer.className = 'lb-layer';
  layer.innerHTML = '<button class="lb-close">Tutup</button><div class="lb-content"></div>';
  document.body.appendChild(layer);
  const content = layer.querySelector('.lb-content');
  const close = ()=> layer.classList.remove('show');
  layer.querySelector('.lb-close').addEventListener('click', close);
  layer.addEventListener('click', e=>{ if(e.target===layer) close(); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') close(); });
  document.querySelectorAll('a[data-lightbox]').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      content.innerHTML='';
      const img = new Image();
      img.onload = ()=> layer.classList.add('show');
      img.src = a.getAttribute('href');
      img.alt = a.querySelector('img')?.alt || '';
      content.appendChild(img);
    });
  });
})();

// Serverless form
const form = document.getElementById('emailForm');
const statusEl = document.getElementById('status');
form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  statusEl.textContent = 'Mengirim…';
  try{
    const res = await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form).entries()))});
    const data = await res.json();
    statusEl.textContent = res.ok ? 'Terkirim!' : 'Gagal: ' + (data.error || res.statusText);
    if(res.ok) form.reset();
  }catch(err){ statusEl.textContent = 'Gagal: ' + err.message; }
});
