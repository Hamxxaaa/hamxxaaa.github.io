// ===== Small utilities =====
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

// ===== Mobile nav toggle =====
const burger = $('.hamburger');
const menu = $('.menu');
burger?.addEventListener('click', () => {
  const expanded = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-expanded', String(!expanded));
  menu.classList.toggle('show');
});

// Close menu when clicking a link on mobile
$$('.menu a').forEach(a => a.addEventListener('click', () => menu.classList.remove('show')));

// ===== Typing effect (simple, no dependency) =====
const typingEl = $('#typing');
const cursor = $('.cursor');
const roles = [
  'Mechanical Engineer',
  'Operations Engineer',
  'Maintenance Engineer',
  'Problem Solver',
  '2024 Engineering Graduate',
];
let roleIdx = 0;
let charIdx = 0;
let deleting = false;

function typeLoop(){
  const current = roles[roleIdx];
  const displayed = current.slice(0, charIdx);
  typingEl.textContent = displayed;

  if(!deleting && charIdx < current.length){
    charIdx++;
  } else if (deleting && charIdx > 0){
    charIdx--;
  } else {
    if(!deleting){ // done typing
      deleting = true;
      setTimeout(typeLoop, 1200);
      return;
    } else {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  const speed = deleting ? 30 : 60;
  setTimeout(typeLoop, speed);
}
typeLoop();

// ===== Year in footer =====
$('#year').textContent = new Date().getFullYear();

// ===== Contact form (Formspree/Netlify optional) =====
// If you set FORM_ENDPOINT to your Formspree URL, this will submit via fetch.
const FORM_ENDPOINT = ''; // e.g. 'https://formspree.io/f/xxxxxx'
const form = $('#contact-form');

form?.addEventListener('submit', async (e) => {
  if(!FORM_ENDPOINT) return; // fallback to default action/behavior
  e.preventDefault();
  const data = new FormData(form);
  try{
    const res = await fetch(FORM_ENDPOINT, {
      method:'POST',
      headers: { 'Accept': 'application/json' },
      body: data
    });
    if(res.ok){
      alert('Thanks! Your message has been sent.');
      form.reset();
    } else {
      alert('Something went wrong. Please email me directly.');
    }
  }catch(err){
    alert('Network error. Please email me directly.');
  }
});

// ===== Scrollspy (highlight active section) =====
const sections = $$('section[id]');
const navLinks = new Map($$('.menu a').map(a => [a.getAttribute('href')?.slice(1), a]));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    const link = navLinks.get(id);
    if(link){
      if(entry.isIntersecting){
        $$('.menu a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

sections.forEach(sec => io.observe(sec));
