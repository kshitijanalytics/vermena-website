(function () {
  var toggle = document.getElementById("menu-toggle");
  var menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;

  function setOpen(open) {
    if (open) {
      menu.removeAttribute("hidden");
      toggle.setAttribute("aria-expanded", "true");
    } else {
      menu.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", "false");
    }
  }

  toggle.addEventListener("click", function () {
    setOpen(menu.hasAttribute("hidden"));
  });

  // Close after choosing a link, so it doesn't stay open across navigation.
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      setOpen(false);
    });
  });
})();
