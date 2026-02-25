// PALEO — Il Mammut Che Non Scendeva a Compromessi
// index.js — Easter egg, scroll counter, neve nel footer

// ============================================================
// Easter egg: click sul mammut → "No."
// ============================================================
const mammut = document.getElementById('mammut-emoji');
const tooltip = document.getElementById('mammut-tooltip');

let tooltipTimer = null;

mammut.addEventListener('click', () => {
  // Animazione shake-no
  mammut.classList.remove('clicked');
  void mammut.offsetWidth; // reflow per riavviare l'animazione
  mammut.classList.add('clicked');

  // Mostra il tooltip "No."
  tooltip.classList.add('visible');
  clearTimeout(tooltipTimer);
  tooltipTimer = setTimeout(() => {
    tooltip.classList.remove('visible');
  }, 1800);
});

mammut.addEventListener('animationend', () => {
  mammut.classList.remove('clicked');
});

// ============================================================
// Contatore "compromessi rifiutati" — incrementa sullo scroll
// ============================================================
const counterEl = document.getElementById('compromise-counter');
let count = 0;
let lastScrollY = window.scrollY;
const maxCount = 47; // numero definitivo e irrevocabile di rifiuti di Paleo

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  const delta = currentScrollY - lastScrollY;

  if (delta > 50 && count < maxCount) {
    count = Math.min(count + 1, maxCount);
    lastScrollY = currentScrollY;
    updateCounter();
  } else if (delta < -50) {
    lastScrollY = currentScrollY;
  }
});

function updateCounter() {
  counterEl.textContent = count;
  counterEl.classList.add('bump');
  setTimeout(() => counterEl.classList.remove('bump'), 300);
}

// ============================================================
// Scroll reveal — timeline items
// ============================================================
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el) => observer.observe(el));

// ============================================================
// Neve nel footer — canvas semplice
// ============================================================
const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');

let snowflakes = [];
let animFrameId = null;
let isVisible = false;

function resizeCanvas() {
  const footer = canvas.parentElement;
  canvas.width = footer.offsetWidth;
  canvas.height = footer.offsetHeight;
}

function createFlake() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height * -1,
    r: Math.random() * 2.5 + 0.5,
    speed: Math.random() * 0.6 + 0.3,
    drift: (Math.random() - 0.5) * 0.4,
    opacity: Math.random() * 0.5 + 0.2,
  };
}

function initSnow() {
  resizeCanvas();
  snowflakes = Array.from({ length: 60 }, createFlake);
}

function drawSnow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snowflakes.forEach((f) => {
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 235, 248, ${f.opacity})`;
    ctx.fill();

    f.y += f.speed;
    f.x += f.drift;

    if (f.y > canvas.height + 5) {
      f.y = -5;
      f.x = Math.random() * canvas.width;
    }
    if (f.x < -5) f.x = canvas.width + 5;
    if (f.x > canvas.width + 5) f.x = -5;
  });

  animFrameId = requestAnimationFrame(drawSnow);
}

// Avvia la neve solo quando il footer è visibile
const footerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !isVisible) {
        isVisible = true;
        initSnow();
        drawSnow();
      } else if (!entry.isIntersecting && isVisible) {
        isVisible = false;
        cancelAnimationFrame(animFrameId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
  },
  { threshold: 0.1 }
);

footerObserver.observe(document.getElementById('footer'));

window.addEventListener('resize', () => {
  if (isVisible) {
    resizeCanvas();
    snowflakes = Array.from({ length: 60 }, createFlake);
  }
});
