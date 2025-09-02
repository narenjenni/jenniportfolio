// Mobile nav
const navToggle = document.querySelector('.nav-toggle');
const body = document.body;
if (navToggle){
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
    navToggle.setAttribute('aria-expanded', String(!expanded));
    body.classList.toggle('nav-open');
  });
  document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>body.classList.remove('nav-open')))
}

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  });
},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Contact Form -> serverless function
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

function setStatus(text, type='info'){
  statusEl.textContent = text;
  statusEl.style.color = type==='error' ? '#ff9a9a' : (type==='success' ? '#a6f3c1' : '#b7b7bf');
}

function validateEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

if (form){
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    // Simple client validation
    let ok = true;
    const errName = form.querySelector('#name + .error');
    const errEmail = form.querySelector('#email + .error');
    const errMsg = form.querySelector('#message + .error');
    errName.textContent = errEmail.textContent = errMsg.textContent = '';

    if (!name){ errName.textContent = 'Nama wajib diisi.'; ok = false; }
    if (!validateEmail(email)){ errEmail.textContent = 'Email tidak valid.'; ok = false; }
    if (message.length < 10){ errMsg.textContent = 'Pesan minimal 10 karakter.'; ok = false; }
    if (!ok) return;

    submitBtn.disabled = true;
    setStatus('Mengirim...', 'info');

    try{
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name, email, message })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setStatus('Terkirim! Saya akan membalas secepatnya.', 'success');
      form.reset();
    }catch(err){
      setStatus('Gagal mengirim. Pastikan serverless function aktif & env EMAIL_USER/EMAIL_PASS sudah di-set.', 'error');
      console.error(err);
    }finally{
      submitBtn.disabled = false;
    }
  });
}



// ---- Hero Slider ----
(function(){
  const slider = document.getElementById('heroSlider');
  if(!slider) return;
  const slides = Array.from(slider.querySelectorAll('.slide'));
  const dotsWrap = slider.querySelector('.slider-dots');
  const prevBtn = slider.querySelector('.prev');
  const nextBtn = slider.querySelector('.next');
  let i = 0, auto = null, hover = false;
  const interval = 5000; // 5 detik

  function setActive(n){
    i = (n + slides.length) % slides.length;
    slides.forEach((s,idx)=>s.classList.toggle('is-active', idx===i));
    dotsWrap.querySelectorAll('button').forEach((b,idx)=>b.setAttribute('aria-current', idx===i ? 'true' : 'false'));
  }
  slides.forEach((_, idx)=>{
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Ke slide ' + (idx+1));
    b.addEventListener('click', ()=>setActive(idx));
    dotsWrap.appendChild(b);
  });
  setActive(0);

  function start(){
    if(auto) clearInterval(auto);
    auto = setInterval(()=>!hover && setActive(i+1), interval);
  }
  start();

  prevBtn.addEventListener('click', ()=>{ setActive(i-1); start(); });
  nextBtn.addEventListener('click', ()=>{ setActive(i+1); start(); });

  slider.addEventListener('mouseenter', ()=>{ hover = true; });
  slider.addEventListener('mouseleave', ()=>{ hover = false; });

  // swipe
  let startX = 0, touching = false;
  slider.addEventListener('touchstart', (e)=>{ touching = true; startX = e.touches[0].clientX; });
  slider.addEventListener('touchmove', (e)=>{
    if(!touching) return;
    const dx = e.touches[0].clientX - startX;
    if(Math.abs(dx) > 40){
      touching = false;
      if(dx > 0) setActive(i-1); else setActive(i+1);
      start();
    }
  }, {passive:true});
  slider.addEventListener('touchend', ()=> touching=false);
})();

// === Header slider init ===
(function(){
  const slider = document.getElementById('headerSlider');
  if(!slider) return;
  const track = slider.querySelector('.slides');
  const slides = Array.from(slider.querySelectorAll('.slide'));
  const dotsWrap = slider.querySelector('.slider-dots');
  let index = 0; let timer;

  // dots
  slides.forEach((_, i)=>{
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Ke slide ' + (i+1));
    b.addEventListener('click', ()=> go(i));
    dotsWrap.appendChild(b);
  });
  function updateDots(){
    dotsWrap.querySelectorAll('button').forEach((b, i)=>{
      b.classList.toggle('is-active', i===index);
    });
  }
  function go(i){
    index = (i+slides.length)%slides.length;
    track.style.transform = `translateX(-${index*100}%)`;
    updateDots(); restart();
  }
  function next(){ go(index+1) }
  function prev(){ go(index-1) }
  slider.querySelector('.next').addEventListener('click', next);
  slider.querySelector('.prev').addEventListener('click', prev);

  function restart(){
    clearInterval(timer);
    timer = setInterval(next, 5000);
  }
  // swipe
  let startX=null;
  slider.addEventListener('touchstart', (e)=>{ startX = e.touches[0].clientX; clearInterval(timer); });
  slider.addEventListener('touchend', (e)=>{
    if(startX==null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx) > 40){ dx<0 ? next() : prev(); }
    restart(); startX=null;
  });
  updateDots(); restart();
})();

// v10: defer header slider start until first image is loaded
(function(){
  const slider = document.getElementById('headerSlider');
  if(!slider) return;
  const firstImg = slider.querySelector('.slide img');
  const startHeader = () => {
    if (!slider.__started) {
      slider.__started = true;
      const ev = new Event('headerslider:start'); slider.dispatchEvent(ev);
    }
  };
  if (firstImg && !firstImg.complete) {
    firstImg.addEventListener('load', startHeader, {once:true});
    firstImg.addEventListener('error', startHeader, {once:true});
  } else { startHeader(); }

  slider.addEventListener('headerslider:start', ()=>{
    const track = slider.querySelector('.slides');
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const dotsWrap = slider.querySelector('.slider-dots');
    let index = 0; let timer;

    slides.forEach((_, i)=>{
      const b = document.createElement('button');
      b.setAttribute('aria-label', 'Ke slide ' + (i+1));
      b.addEventListener('click', ()=> go(i));
      dotsWrap.appendChild(b);
    });
    function updateDots(){
      dotsWrap.querySelectorAll('button').forEach((b, i)=> b.classList.toggle('is-active', i===index));
    }
    function go(i){
      index = (i+slides.length)%slides.length;
      track.style.transform = `translateX(-${index*100}%)`;
      updateDots(); restart();
    }
    function next(){ go(index+1) }
    function prev(){ go(index-1) }
    slider.querySelector('.next').addEventListener('click', next);
    slider.querySelector('.prev').addEventListener('click', prev);
    function restart(){ clearInterval(timer); timer = setInterval(next, 5000); }

    // If lazy images error, keep slider alive
    slides.forEach(sl=>{
      const img = sl.querySelector('img');
      if(!img) return;
      img.addEventListener('error', ()=>{ img.classList.add('broken'); });
    });

    updateDots(); restart();
  }, {once:true});
})();

// v13 resolver removed in v14
