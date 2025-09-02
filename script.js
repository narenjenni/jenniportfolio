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
