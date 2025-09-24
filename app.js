import { gsap } from "gsap";

const slides = Array.from(document.querySelectorAll(".slide"));
const dots = Array.from(document.querySelectorAll(".dot"));
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const voteBtn = document.querySelector(".vote-btn");

let index = 0;
let isAnimating = false;

function setActive(i, instant = false) {
  if (isAnimating || i === index || i < 0 || i >= slides.length) return;
  isAnimating = true;

  const from = slides[index];
  const to = slides[i];

  dots[index].classList.remove("active");
  dots[i].classList.add("active");

  to.classList.add("active");

  const dir = i > index ? 1 : -1;

  if (instant) {
    gsap.set(from, { opacity: 0 });
    from.classList.remove("active");
    gsap.set(to, { xPercent: 0, opacity: 1 });
    index = i; isAnimating = false; return;
  }

  gsap.set(to, { xPercent: 100 * dir, opacity: 1 });
  const tl = gsap.timeline({
    defaults: { ease: "power3.out", duration: 0.6 },
    onComplete: () => {
      from.classList.remove("active");
      gsap.set(from, { clearProps: "all" });
      index = i;
      isAnimating = false;
    }
  });

  tl
    .to(from, { xPercent: -100 * dir, opacity: 0 }, 0)
    .to(to, { xPercent: 0 }, 0);

  const items = to.querySelectorAll(".title, .subtitle, .hero-logo, .grid .card, .bullets li, .lead, .cta");
  gsap.from(items, { y: 18, opacity: 0, stagger: 0.06, duration: 0.5, ease: "power2.out" });
}

function init() {
  slides[0].classList.add("active");
  dots[0].classList.add("active");
  gsap.from(slides[0].querySelectorAll(".hero-logo, .title, .subtitle"), {
    y: 18, opacity: 0, stagger: 0.08, duration: 0.7, ease: "power2.out"
  });
}
init();

prevBtn.addEventListener("click", () => setActive(index - 1));
nextBtn.addEventListener("click", () => setActive(index + 1));
dots.forEach(d => d.addEventListener("click", () => setActive(Number(d.dataset.target))));

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") setActive(index + 1);
  else if (e.key === "ArrowLeft") setActive(index - 1);
});

let startX = null, activeDrag = false;
function startDrag(x) { startX = x; activeDrag = true; }
function moveDrag(x) {
  if (!activeDrag || isAnimating) return;
  const dx = x - startX;
  const threshold = Math.min(window.innerWidth * 0.12, 120);
  if (dx > threshold) { activeDrag = false; setActive(index - 1); }
  else if (dx < -threshold) { activeDrag = false; setActive(index + 1); }
}
function endDrag() { activeDrag = false; startX = null; }

window.addEventListener("pointerdown", (e) => startDrag(e.clientX));
window.addEventListener("pointermove", (e) => moveDrag(e.clientX));
window.addEventListener("pointerup", endDrag);
window.addEventListener("pointercancel", endDrag);

voteBtn?.addEventListener("click", () => {
  gsap.to(voteBtn, { scale: 0.98, duration: 0.08, yoyo: true, repeat: 1 });
  alert("Merci pour votre soutien !");
});