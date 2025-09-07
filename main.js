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

// Map titles to case slugs
const slugMap = {
  "Pakaian": "baju",
  "Mug": "mug",
  "Selimut": "selimut",
  "Bantal": "bantal",
  "Banner": "banner",
  "Cover Novel": "cover",
  "Hoodie": "hoodie",
  "Goodiebag": "goodiebag",
  "Tumbler": "tumbler"
};

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
    tags: ["Marketing", "Event"]
  },
  {
    title: "Cover Novel",
    desc: "Desain cover novel yang menarik.",
    thumb: "assets/project6.svg",
    tags: ["Publishing", "Book"]
  },
  {
    title: "Hoodie",
    desc: "Desain hoodie dengan berbagai gaya.",
    thumb: "assets/project7.svg",
    tags: ["Apparel", "Fashion"]
  },
  {
    title: "Goodiebag",
    desc: "Desain goodiebag untuk event dan souvenir.",
    thumb: "assets/project8.svg",
    tags: ["Event", "Merchandise"]
  },
  {
    title: "Tumbler",
    desc: "Desain tumbler untuk minuman.",
    thumb: "assets/project9.svg",
    tags: ["Drinkware", "Lifestyle"]
  }
];

const projectGrid = $('#projectGrid');
projects.forEach((proj, i) => {
  const card = document.createElement('div');
  card.className = 'card';
  card.style.animationDelay = `${i * 0.08}s`;
  card.innerHTML = `
    <div class="thumb" style="--bg: url('${proj.thumb}')"></div>
    <div class="body">
      <h3>${proj.title}</h3>
      <p>${proj.desc}</p>
      <div class="actions">
        ${proj.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
    </div>
  `;
  projectGrid.appendChild(card);
});

// ====== Contact Form ======
const contactForm = $('#contactForm');
const formMsg = $('#formMsg');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(contactForm);
  const payload = Object.fromEntries(data);
  
  formMsg.textContent = 'Mengirim...';
  
  try {
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    formMsg.textContent = 'Pesan berhasil dikirim!';
    contactForm.reset();
    
    // Clear message after 3 seconds
    setTimeout(() => {
      formMsg.textContent = '';
    }, 3000);
  } catch (err) {
    formMsg.textContent = 'Gagal mengirim pesan. Silakan coba lagi.';
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
    }
  });
}, observerOptions);

// Observe sections
$$('section').forEach(section => {
  observer.observe(section);
});

// ====== Lazy loading for images ======
if ('loading' in HTMLImageElement.prototype) {
  $$('img[loading="lazy"]').forEach(img => {
    img.src = img.dataset.src;
  });
} else {
  // Fallback for browsers that don't support lazy loading
  const lazyScript = document.createElement('script');
  lazyScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  document.body.appendChild(lazyScript);
}