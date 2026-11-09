const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

toggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = form.get("name").trim();
  const email = form.get("email").trim();
  const matter = form.get("matter").trim();
  const subject = encodeURIComponent(`Consultation request from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${matter}`);
  document.getElementById("form-status").textContent =
    "Opening your email application. Set your real email address in index.html before publishing.";
  window.location.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;
});

const teamSlider = document.querySelector(".team-slider");
const teamCards = teamSlider.querySelectorAll(".team-card");
const teamArrows = document.querySelectorAll(".team-arrow");
const teamProgress = document.querySelector(".team-progress span");
const teamCount = document.querySelector(".team-count");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let teamTimer;

const teamStep = () => teamCards[0].offsetWidth + parseFloat(getComputedStyle(teamSlider).columnGap);
const pad = (n) => String(n).padStart(2, "0");

const updateTeamSlider = () => {
  const maxScroll = teamSlider.scrollWidth - teamSlider.clientWidth;
  const step = teamStep();
  const perView = Math.max(1, Math.round((teamSlider.clientWidth + step - teamCards[0].offsetWidth) / step));
  const first = Math.min(Math.round(teamSlider.scrollLeft / step) + 1, teamCards.length);
  const last = Math.min(first + perView - 1, teamCards.length);

  teamArrows[0].disabled = teamSlider.scrollLeft <= 1;
  teamArrows[1].disabled = teamSlider.scrollLeft >= maxScroll - 1;
  teamProgress.style.width = `${(teamSlider.clientWidth / teamSlider.scrollWidth) * 100}%`;
  teamProgress.style.left = `${(teamSlider.scrollLeft / teamSlider.scrollWidth) * 100}%`;
  teamCount.textContent = `${pad(first)}${last > first ? `–${pad(last)}` : ""} / ${pad(teamCards.length)}`;
};

const slideTeam = (dir) => {
  const atEnd = teamSlider.scrollLeft >= teamSlider.scrollWidth - teamSlider.clientWidth - 1;
  if (dir > 0 && atEnd) teamSlider.scrollTo({ left: 0 });
  else teamSlider.scrollBy({ left: teamStep() * dir });
};

// Auto-advance every few seconds; pause while the visitor is interacting
const startTeamAutoplay = () => {
  if (reduceMotion) return;
  clearInterval(teamTimer);
  teamTimer = setInterval(() => slideTeam(1), 4500);
};
const stopTeamAutoplay = () => clearInterval(teamTimer);

teamArrows.forEach((arrow) => {
  arrow.addEventListener("click", () => slideTeam(Number(arrow.dataset.dir)));
});

const teamSection = document.querySelector(".team-section");
["mouseenter", "focusin", "touchstart"].forEach((type) => teamSection.addEventListener(type, stopTeamAutoplay, { passive: true }));
["mouseleave", "focusout", "touchend"].forEach((type) => teamSection.addEventListener(type, startTeamAutoplay, { passive: true }));

teamSlider.addEventListener("scroll", updateTeamSlider, { passive: true });
window.addEventListener("resize", updateTeamSlider);
updateTeamSlider();
startTeamAutoplay();
