(function () {
  var STORAGE_KEY = "vermena_cookie_consent";
  var INTERNAL_KEY = "vermena_internal_traffic";
  var GTM_ID = "GTM-KXFGPZDN";

  // Visiting once with ?internal=1 opts this browser out of analytics
  // permanently (e.g. https://vermena.in/?internal=1) — team members bookmark
  // that once instead of relying on IP-based filtering, which breaks the
  // moment anyone works from outside a fixed office IP.
  try {
    if (new URLSearchParams(location.search).get("internal") === "1") {
      localStorage.setItem(INTERNAL_KEY, "true");
    }
  } catch (e) {}

  function isInternalTraffic() {
    try {
      return localStorage.getItem(INTERNAL_KEY) === "true";
    } catch (e) {
      return false;
    }
  }

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

  // Same mechanism as GTM's own snippet, just under our control so it only
  // runs once consent is given. Idempotent — safe to call more than once
  // (e.g. once from the <head> snippet on return visits, once from here).
  function loadGTM() {
    if (window.__vermenaGtmLoaded || isInternalTraffic()) return;
    window.__vermenaGtmLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var f = document.getElementsByTagName("script")[0];
    var j = document.createElement("script");
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + GTM_ID;
    f.parentNode.insertBefore(j, f);
  }

  var banner = document.getElementById("cookie-banner");
  var consent = getConsent();

  if (consent === "accepted") {
    // Belt-and-braces: the <head> snippet already does this on return
    // visits, but calling it again here is harmless (see idempotent note).
    loadGTM();
  } else if (!consent && banner) {
    banner.removeAttribute("hidden");
  }

  if (banner) {
    var acceptBtn = document.getElementById("cookie-accept");
    var declineBtn = document.getElementById("cookie-decline");

    if (acceptBtn) {
      acceptBtn.addEventListener("click", function () {
        setConsent("accepted");
        loadGTM();
        banner.setAttribute("hidden", "");
      });
    }
    if (declineBtn) {
      declineBtn.addEventListener("click", function () {
        setConsent("declined");
        banner.setAttribute("hidden", "");
      });
    }
  }

  // Footer "Cookie settings" links call this to let a visitor change their mind.
  window.vermenaOpenCookieSettings = function (e) {
    if (e) e.preventDefault();
    if (banner) banner.removeAttribute("hidden");
  };
})();
