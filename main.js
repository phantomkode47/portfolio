// ===== Theme toggle (dark <-> light), remembered between visits =====
const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  if (themeBtn) themeBtn.textContent = theme === "dark" ? "☀ Light" : "🌙 Dark";
  try { localStorage.setItem("theme", theme); } catch (e) { /* storage blocked */ }
}
let saved = "dark";
try { saved = localStorage.getItem("theme") || "dark"; } catch (e) { /* ignore */ }
applyTheme(saved);
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });
}

// ===== Mobile menu =====
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
}

// ===== Footer year =====
const yr = document.getElementById("year");
if (yr) yr.textContent = new Date().getFullYear();

// ===== Scroll reveal + skill bars =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      entry.target.querySelectorAll(".bar i").forEach((b) => (b.style.width = b.dataset.level + "%"));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ===== Typing effect on homepage (arrays + DOM updates) =====
const typingEl = document.getElementById("typing");
if (typingEl) {
  const roles = ["Ethical Hacker", "AI Developer", "Hardware Reverse Engineer", "App Builder", "Computer Science Student"];
  let r = 0, c = 0, deleting = false;
  function type() {
    const word = roles[r];
    typingEl.textContent = word.slice(0, deleting ? c-- : c++);
    let delay = deleting ? 45 : 90;
    if (!deleting && c > word.length) { deleting = true; delay = 1400; }
    else if (deleting && c < 0) { deleting = false; r = (r + 1) % roles.length; c = 0; delay = 400; }
    setTimeout(type, delay);
  }
  type();
}
