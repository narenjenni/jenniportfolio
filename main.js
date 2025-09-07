// ====== Utility ======
const $ = (q, ctx=document) => ctx.querySelector(q);
const $$ = (q, ctx=document) => [...ctx.querySelectorAll(q)];

// ====== Navbar ======
const hamburger = $('#hamburger');
const menu = $('#menu');
hamburger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(open));
  
  // Close menu when clicking outside
  if (open) {
    setTimeout(() => {
      document.addEventListener('click', closeMenuOnClickOutside);
    }, 10);
  } else {
    document.removeEventListener('click', closeMenuOnClickOutside);
  }
});

function closeMenuOnClickOutside(e) {
  if (!menu.contains(e.target) && e.target !== hamburger) {
    menu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', closeMenuOnClickOutside);
  }
}

// Smooth scroll
$$('.menu a, .footer a[href="#home"]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  const id = a.getAttribute('href');
  if (id === '#home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    const target = document.querySelector(id);
    if (target) {
      const offset = 80; // Account for sticky header
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  }
  menu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}));

// Close menu when resizing to larger screen
window.addEventListener('resize', () => {
  if (window.innerWidth > 960) {
    menu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', closeMenuOnClickOutside);
  }
});

// Year
$('#year').textContent = new Date().getFullYear();

// ====== Hero Slider ======
const slides = $('#slides');
const dots = $('#dots');
const prev = $('#prev');
const next = $('#next');
let current = 0;
const slideCount = $$('.slide').length;

// Create dots
for (let i = 0; i < slideCount; i++) {
  const dot = document.createElement('button');
  dot.setAttribute('aria-label', `Slide ${i+1}`);
  dot.addEventListener('click', () => goToSlide(i));
  dots.appendChild(dot);
}

// Set active dot
function setActiveDot(i) {
  $$('#dots button').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === i);
  });
}

// Go to slide
function goToSlide(i) {
  current = i;
  slides.style.transform = `translateX(-${current * 100}%)`;
  setActiveDot(current);
}

// Next/prev
prev.addEventListener('click', () => {
  current = (current - 1 + slideCount) % slideCount;
  goToSlide(current);
});
next.addEventListener('click', () => {
  current = (current + 1) % slideCount;
  goToSlide(current);
});

// Auto slide
let slideInterval = setInterval(() => {
  current = (current + 1) % slideCount;
  goToSlide(current);
}, 5000);

// Pause on hover
slides.addEventListener('mouseenter', () => clearInterval(slideInterval));
slides.addEventListener('mouseleave', () => {
  slideInterval = setInterval(() => {
    current = (current + 1) % slideCount;
    goToSlide(current);
  }, 5000);
});

// ====== Project Cards ======
const projects = [
  {
    title: "Pakaian",
    desc: "Desain kaos, hoodie, jaket, dan lainnya.",
    thumb: "assets/project1.svg",
    tags: ["Apparel", "Fashion"]
  },
  {
    title: "Mug",
    desc: "Desain mug keramik untuk minuman.",
    thumb: "assets/project2.svg",
    tags: ["Mug", "Drinkware"]
  },
  {
    title: "Selimut",
    desc: "Desain selimut dengan bahan nyaman.",
    thumb: "assets/project3.svg",
    tags: ["Home", "Textile"]
  },
  {
    title: "Bantal",
    desc: "Desain bantal dekoratif dan fungsional.",
    thumb: "assets/project4.svg",
    tags: ["Home", "Decor"]
  },
  {
    title: "Banner",
    desc: "Desain banner untuk promosi dan event.",
    thumb: "assets/project5.svg",
    tags: ["Promo", "Event"]
  },
  {
    title: "Cover Novel",
    desc: "Desain cover novel yang menarik.",
    thumb: "assets/project6.svg",
    tags: ["Book", "Publishing"]
  },
  {
    title: "Goodiebag",
    desc: "Desain goodiebag untuk event.",
    thumb: "assets/project7.svg",
    tags: ["Event", "Merch"]
  },
  {
    title: "Tumbler",
    desc: "Desain tumbler untuk minuman.",
    thumb: "assets/project8.svg",
    tags: ["Drinkware", "Eco"]
  }
];

const projectGrid = $('#projectGrid');
projects.forEach((project, i) => {
  const card = document.createElement('article');
  card.className = 'card';
  card.style.animationDelay = `${i * 100}ms`;
  card.innerHTML = `
    <div class="thumb" style="--bg: url('${project.thumb}')"></div>
    <div class="body">
      <h3>${project.title}</h3>
      <p>${project.desc}</p>
      <div class="actions">
        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
    </div>
  `;
  projectGrid.appendChild(card);
});

// ====== Contact Form ======
const contactForm = $('#contactForm');
const formMsg = $('#formMsg');

contactForm.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData);
  
  // Simple validation
  if (!data.name || !data.email || !data.message) {
    formMsg.textContent = 'Semua field harus diisi.';
    return;
  }
  
  formMsg.textContent = 'Mengirim pesan...';
  
  try {
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    formMsg.textContent = 'Pesan berhasil dikirim! Saya akan membalas segera.';
    contactForm.reset();
  } catch (err) {
    formMsg.textContent = 'Terjadi kesalahan. Silakan coba lagi.';
  }
});

// ====== Intersection Observer for animations ======
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all sections
$$('section').forEach(section => {
  observer.observe(section);
});