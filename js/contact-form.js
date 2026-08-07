(function () {
  var form = document.getElementById("webform1399398000000547200");
  if (!form) return;

  function fieldOf(name) {
    var input = form.elements[name];
    return input ? input.closest(".field") : null;
  }

  function clearErrors() {
    form.querySelectorAll(".field.has-error").forEach(function (f) {
      f.classList.remove("has-error");
    });
  }

  function markError(name) {
    var field = fieldOf(name);
    if (field) field.classList.add("has-error");
    return field;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function validate() {
    clearErrors();
    var firstInvalidField = null;

    var name = form.elements["Last Name"];
    var company = form.elements["Company"];
    var email = form.elements["Email"];
    var problem = form.elements["Description"];

    if (!name.value.trim()) {
      var f0 = markError("Last Name");
      firstInvalidField = firstInvalidField || f0.querySelector("input");
    }
    if (!company.value.trim()) {
      var fc = markError("Company");
      firstInvalidField = firstInvalidField || fc.querySelector("input");
    }
    if (!email.value.trim() || !isValidEmail(email.value)) {
      var f1 = markError("Email");
      firstInvalidField = firstInvalidField || f1.querySelector("input");
    }
    if (!problem.value.trim()) {
      var f2 = markError("Description");
      firstInvalidField = firstInvalidField || f2.querySelector("textarea");
    }

    if (firstInvalidField) {
      firstInvalidField.focus();
      return false;
    }
    return true;
  }

  // Clear a field's error state as soon as it becomes valid again.
  form.addEventListener("input", function (e) {
    var field = e.target.closest(".field");
    if (!field || !field.classList.contains("has-error")) return;
    if (e.target.name === "Email") {
      if (isValidEmail(e.target.value)) field.classList.remove("has-error");
    } else if (e.target.value.trim()) {
      field.classList.remove("has-error");
    }
  });

  form.addEventListener("submit", function (e) {
    // Honeypot: bots fill every field, humans never see this one.
    var honeypot = form.elements["aG9uZXlwb3Q"];
    if (honeypot && honeypot.value.trim()) {
      e.preventDefault();
      return;
    }

    if (!validate()) {
      e.preventDefault();
      return;
    }

    // Fold the optional "what are you using today" answer into the
    // Description field so it isn't lost even if no matching custom field
    // exists in Zoho yet. Left in place, the real POST + redirect to Zoho
    // proceeds normally after this.
    var using = form.elements["Current_Tools"];
    var problem = form.elements["Description"];
    if (using && using.value.trim()) {
      problem.value =
        "Currently using: " + using.value.trim() + "\n\n" + problem.value.trim();
    }

    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }
    // No preventDefault here — let the browser submit to Zoho natively,
    // which redirects to the "returnURL" (thank-you.html) on success.
  });
})();
