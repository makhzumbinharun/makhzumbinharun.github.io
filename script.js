/**
 * MAKHZUM BIN HARUN – Portfolio Script v2
 * Dark mode · Typing · Scroll reveal · Active nav · Project filter · Contact form
 */

const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const html = document.documentElement;

/* ── 1. THEME (dark / light) ── */
const themeBtn  = $('#theme-toggle');
const themeIcon = $('#theme-icon');

function setTheme(dark) {
  html.setAttribute('data-theme', dark ? 'dark' : 'light');
  themeIcon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  localStorage.setItem('mbh-theme', dark ? 'dark' : 'light');
  updateGHImages(dark);
}

function updateGHImages(dark) {
  ['gh-stat-1', 'gh-stat-2'].forEach(id => {
    const img = $('#' + id);
    if (!img) return;
    const src = img.getAttribute(dark ? 'data-dark' : 'data-light');
    if (src) img.src = src + '&_v=' + Date.now();
  });
}

// Initialise from storage or system preference
const saved = localStorage.getItem('mbh-theme');
const sys   = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(saved ? saved === 'dark' : sys);

themeBtn.addEventListener('click', () =>
  setTheme(html.getAttribute('data-theme') !== 'dark'));

/* ── 2. NAVBAR scroll + active section ── */
const navbar   = $('#navbar');
const navLinks = $$('.nav-link');
const sections = $$('section[id]');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 20);
  $('#back-to-top').classList.toggle('visible', y > 400);

  let current = '';
  sections.forEach(s => { if (y >= s.offsetTop - 110) current = s.id; });
  navLinks.forEach(l =>
    l.classList.toggle('active', l.getAttribute('href').replace('#','') === current));
}, { passive: true });

/* ── 3. Mobile hamburger ── */
const hamburger  = $('#hamburger');
const navLinksEl = $('#nav-links');

hamburger.addEventListener('click', () => {
  const open = navLinksEl.classList.toggle('open');
  const spans = $$('span', hamburger);
  spans[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
  spans[1].style.opacity   = open ? '0' : '1';
  spans[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
});
$$('.nav-link, .nav-cert-btn').forEach(l => l.addEventListener('click', () => {
  navLinksEl.classList.remove('open');
  $$('span', hamburger).forEach(s => { s.style.transform=''; s.style.opacity='1'; });
}));

/* ── 4. Typing animation ── */
const phrases = [
  'CSE Student 🎓',
  'C / C++ Programmer',
  'Competitive Programmer',
  'Problem Solver',
  'Web Developer',
  'Co-Founder @ TechFash Nagar',
  'Social Media Strategist',
];
const typingEl = $('#typing-text');
let pi = 0, ci = 0, deleting = false;

function typeWriter() {
  const word = phrases[pi];
  typingEl.textContent = deleting ? word.slice(0, ci - 1) : word.slice(0, ci + 1);
  deleting ? ci-- : ci++;
  let delay = deleting ? 55 : 95;
  if (!deleting && ci === word.length)  { delay = 1800; deleting = true; }
  else if (deleting && ci === 0)        { deleting = false; pi = (pi + 1) % phrases.length; delay = 350; }
  setTimeout(typeWriter, delay);
}
setTimeout(typeWriter, 700);

/* ── 5. Scroll-reveal + skill bars ── */
const revealEls = $$('.reveal-up, .reveal-left, .reveal-right');

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    $$('.skill-bar-fill', e.target).forEach(b => b.style.width = b.dataset.width + '%');
    revealObs.unobserve(e.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

revealEls.forEach(el => revealObs.observe(el));

// Also animate skill bars when their section scrolls into view
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    $$('.skill-bar-fill', e.target).forEach(b => b.style.width = b.dataset.width + '%');
    skillObs.unobserve(e.target);
  });
}, { threshold: 0.18 });
$$('.skill-category').forEach(el => skillObs.observe(el));

/* ── 6. Project filter ── */
const filterBtns  = $$('.filter-btn');
const projectCards = $$('.project-card[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    projectCards.forEach(c => {
      const show = f === 'all' || c.dataset.category === f;
      c.style.display = show ? 'flex' : 'none';
    });
  });
});

/* ── 7. Back to top ── */
$('#back-to-top').addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── 8. Contact form → mailto ── */
$('#contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const note    = $('#form-note');
  const name    = $('#cf-name').value.trim();
  const email   = $('#cf-email').value.trim();
  const message = $('#cf-msg').value.trim();
  const subject = $('#cf-subject').value.trim() || 'Portfolio Enquiry';

  if (!name || !email || !message) {
    note.textContent = '⚠ Please fill in all required fields.';
    note.className = 'form-note error'; return;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    note.textContent = '⚠ Please enter a valid email address.';
    note.className = 'form-note error'; return;
  }
  const body = `Hi Makhzum,\n\nMy name is ${name}.\n\n${message}\n\nBest,\n${name}\n${email}`;
  window.location.href =
    `mailto:makhzum204@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  note.textContent = '✓ Your mail client should open. Thanks for reaching out!';
  note.className = 'form-note';
  this.reset();
});

/* ── 9. Smooth scroll for anchors ── */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = $(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 74, behavior: 'smooth' });
  });
});

/* ── 10. Hero reveal on load ── */
window.addEventListener('load', () => {
  $$('.hero-section .reveal-up, .hero-section .reveal-right').forEach((el, i) =>
    setTimeout(() => el.classList.add('visible'), 80 + i * 110));
});
