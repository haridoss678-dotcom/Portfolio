// ============================================================
// HARIDOSS B — Portfolio interactivity
// ============================================================

const typingText = document.getElementById('typingText');
const navToggle = document.getElementById('navToggle');
const siteHeader = document.querySelector('.site-header');
const overlay = document.getElementById('pageOverlay');
const navLinks = document.querySelectorAll('.main-nav a');
const sections = document.querySelectorAll('main section');
const form = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');
const themeToggle = document.getElementById('themeToggle');

// ---------- Theme toggle ----------
if (themeToggle) {
  const icon = themeToggle.querySelector('i');

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    if (icon) icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    themeToggle.title = isDark ? 'Light mode' : 'Dark mode';
  });
}

// ---------- Hero typing animation ----------
const lines = [
  'I build AI solutions.',
  'I create intelligent systems.',
  'I love Python development.',
  'I solve real-world problems.',
];
let lineIndex = 0;
let letterIndex = 0;
let isRemoving = false;

function updateTyping() {
  if (!typingText) return;
  const currentLine = lines[lineIndex];

  if (!isRemoving) {
    letterIndex++;
    typingText.textContent = currentLine.slice(0, letterIndex);
    if (letterIndex === currentLine.length) {
      isRemoving = true;
      setTimeout(updateTyping, 1600);
      return;
    }
  } else {
    letterIndex--;
    typingText.textContent = currentLine.slice(0, letterIndex);
    if (letterIndex === 0) {
      isRemoving = false;
      lineIndex = (lineIndex + 1) % lines.length;
    }
  }
  setTimeout(updateTyping, isRemoving ? 60 : 100);
}

// ---------- Mobile navigation ----------
function openNavigation() {
  if (!siteHeader) return;
  siteHeader.classList.add('nav-open');
  navToggle?.setAttribute('aria-expanded', 'true');
  if (overlay) {
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
  }
}

function closeNavigation() {
  if (!siteHeader) return;
  siteHeader.classList.remove('nav-open');
  navToggle?.setAttribute('aria-expanded', 'false');
  if (overlay) {
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
  }
}

navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  expanded ? closeNavigation() : openNavigation();
});

overlay?.addEventListener('click', closeNavigation);

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    closeNavigation();
  });
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeNavigation();
});

// ---------- Active nav link on scroll ----------
function highlightNav() {
  const scrollPosition = window.scrollY + 120;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const link = document.querySelector(`.main-nav a[href="#${section.id}"]`);
    if (!link) return;
    if (scrollPosition >= top && scrollPosition < top + height) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', highlightNav, { passive: true });

// ---------- Reveal-on-scroll (single observer, created once) ----------
function initReveal() {
  const revealItems = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || revealItems.length === 0) {
    revealItems.forEach((item) => item.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealItems.forEach((item) => observer.observe(item));
}

// ---------- Contact form (AJAX submit, no page navigation) ----------
if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalLabel = submitBtn ? submitBtn.textContent : '';

    if (feedback) {
      feedback.classList.remove('is-error');
      feedback.textContent = 'Sending...';
    }
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });

      if (!response.ok) throw new Error('Request failed');

      if (feedback) feedback.textContent = 'Thanks for reaching out! I will get back to you soon.';
      form.reset();
    } catch (err) {
      if (feedback) {
        feedback.classList.add('is-error');
        feedback.textContent = 'Something went wrong sending that. Please email me directly at haridoss678@gmail.com.';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    }
  });
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  updateTyping();
  highlightNav();
  initReveal();
});
