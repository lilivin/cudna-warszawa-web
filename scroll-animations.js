/* Cudna Warszawa — interakcje: reveal on scroll, sticky nav, smooth scroll, mobilne menu */
(function () {
  "use strict";

  /* --- sticky nav cień/tło po przewinięciu --- */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --- reveal on scroll (oparte na pozycji w kadrze — odporne na środowisko) --- */
  var reveals = [].slice.call(document.querySelectorAll(".reveal"));
  function reveal(el) { el.classList.add("in"); }
  function revealInView() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = 0; i < reveals.length; i++) {
      var el = reveals[i];
      if (el.classList.contains("in")) continue;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.86 && r.bottom > -40) reveal(el);
    }
  }
  // odsłoń to, co w kadrze (po pierwszym malowaniu — żeby był efekt wejścia)
  requestAnimationFrame(revealInView);
  // pas bezpieczeństwa: timery odpalają też w ukrytych/tłowych iframe’ach,
  // gdzie requestAnimationFrame bywa wstrzymany
  setTimeout(revealInView, 90);
  document.addEventListener("visibilitychange", revealInView);
  window.addEventListener("load", revealInView);
  // odsłaniaj kolejne podczas przewijania (capture łapie scroll z dowolnego kontenera)
  window.addEventListener("scroll", revealInView, { passive: true, capture: true });
  window.addEventListener("resize", revealInView, { passive: true });
  // BEZPIECZNIK: nic nie może zostać trwale ukryte (działa też bez rAF)
  setTimeout(function () { reveals.forEach(reveal); }, 1500);

  /* --- smooth scroll z offsetem na nav --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (ev) {
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      ev.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top: top, behavior: "smooth" });
      closeMenu();
    });
  });

  /* --- mobilne menu --- */
  var menu = document.querySelector(".mobile-menu");
  var burger = document.querySelector(".nav-burger");
  var closeBtn = document.querySelector(".mobile-menu-close");
  function openMenu() { if (menu) menu.classList.add("open"); }
  function closeMenu() { if (menu) menu.classList.remove("open"); }
  if (burger) burger.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  /* --- delikatny parallax na portrecie hero --- */
  var fig = document.querySelector(".hero-figure .arch");
  if (fig && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y < 700) fig.style.transform = "translateY(" + (y * 0.04) + "px)";
    }, { passive: true });
  }

  /* --- formularz: udawana wysyłka --- */
  var form = document.querySelector("#kontakt-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      var orig = btn.innerHTML;
      btn.innerHTML = "Dziękuję! Odezwę się wkrótce ✦";
      btn.disabled = true;
      setTimeout(function () { btn.innerHTML = orig; btn.disabled = false; form.reset(); }, 3200);
    });
  }
})();
