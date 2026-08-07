(function () {
  var STORAGE_KEY = "vermena_cookie_consent";
  var banner = document.getElementById("cookie-banner");
  if (!banner) return;

  var acceptBtn = document.getElementById("cookie-accept");
  var declineBtn = document.getElementById("cookie-decline");

  function getConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
    document.dispatchEvent(
      new CustomEvent("vermena:cookie-consent", { detail: { consent: value } })
    );
  }

  function hideBanner() {
    banner.setAttribute("hidden", "");
  }

  function showBanner() {
    banner.removeAttribute("hidden");
  }

  if (!getConsent()) {
    showBanner();
  }

  if (acceptBtn) {
    acceptBtn.addEventListener("click", function () {
      setConsent("accepted");
      hideBanner();
    });
  }
  if (declineBtn) {
    declineBtn.addEventListener("click", function () {
      setConsent("declined");
      hideBanner();
    });
  }

  // Footer "Cookie settings" links call this to let a visitor change their mind.
  window.vermenaOpenCookieSettings = function (e) {
    if (e) e.preventDefault();
    showBanner();
  };

  // When consent is accepted, this is where you'd load analytics (e.g. GA4,
  // Plausible) — keep those scripts out of the page until this event fires.
  // document.addEventListener("vermena:cookie-consent", function (e) {
  //   if (e.detail.consent === "accepted") { /* inject analytics script tag here */ }
  // });
})();
