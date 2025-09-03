
// Mobile menu
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
hamburger?.addEventListener('click', ()=> menu.classList.toggle('show'));

// Hero slider (no arrows)
const slides = Array.from(document.querySelectorAll('.slide'));
const dotsWrap = document.getElementById('dots');
let idx = 0, timer;

function go(n){
  slides[idx].classList.remove('active');
  dotsWrap.children[idx].classList.remove('active');
  idx = (n + slides.length) % slides.length;
  slides[idx].classList.add('active');
  dotsWrap.children[idx].classList.add('active');
}
function next(){ go(idx+1); }

slides.forEach((_,i)=>{
  const b = document.createElement('button');
  if(i===0) b.classList.add('active');
  b.addEventListener('click', ()=>{ go(i); restart(); });
  dotsWrap.appendChild(b);
});

function start(){ timer = setInterval(next, 5000); }
function stop(){ clearInterval(timer); }
function restart(){ stop(); start(); }
start();

let touchStartX = 0;
document.querySelector('.slides')?.addEventListener('touchstart', (e)=>{
  touchStartX = e.changedTouches[0].clientX; stop();
},{passive:true});
document.querySelector('.slides')?.addEventListener('touchend', (e)=>{
  const dx = e.changedTouches[0].clientX - touchStartX;
  if(Math.abs(dx) > 40) (dx>0?go(idx-1):go(idx+1));
  start();
},{passive:true});

// Scroll reveal
const io = new IntersectionObserver((entries)=>{
  entries.forEach(el=>{
    if(el.isIntersecting){ el.target.classList.add('show'); io.unobserve(el.target); }
  });
},{threshold:.2});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Contact form
const emailForm = document.getElementById('emailForm');
const statusEl = document.getElementById('formStatus');
emailForm?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  statusEl.textContent = 'Mengirim...';
  const formData = new FormData(emailForm);
  const payload = Object.fromEntries(formData.entries());
  try{
    const res = await fetch('/api/contact', {
      method:'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if(res.ok){
      statusEl.textContent = 'Terkirim! Saya akan segera membalas.';
      emailForm.reset();
    }else{
      statusEl.textContent = 'Gagal: ' + (data.error || res.statusText);
    }
  }catch(err){
    statusEl.textContent = 'Gagal: ' + err.message;
  }
});

// Footer year
document.getElementById('year')?.append(new Date().getFullYear());
