// Mobile menu (same max-height slide behaviour as the original)
(function () {
  var btn = document.getElementById("menu-btn"), menu = document.getElementById("mobile-menu");
  if (!btn || !menu) return;
  function close() { menu.style.maxHeight = null; btn.textContent = "☰"; btn.setAttribute("aria-expanded", "false"); }
  btn.addEventListener("click", function () {
    if (menu.style.maxHeight) close();
    else { menu.style.maxHeight = menu.scrollHeight + "px"; btn.textContent = "✕"; btn.setAttribute("aria-expanded", "true"); }
  });
  document.querySelectorAll(".mobile-link").forEach(function (l) { l.addEventListener("click", close); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
})();
