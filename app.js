/**
 * VaultSecure Demo Site - Rebrandly Conversion Tracking Events
 *
 * Events tracked:
 * 1. "cta_click"              - User clicks "Open Account" or "Get a Quote" CTA (all pages)
 * 2. "rates_viewed"           - User lands on rates.html (high-intent comparison shopping)
 * 3. "account_type_selected"  - User picks an account type on the signup form
 * 4. "application_submitted"  - User submits the application form (signup.html)
 * 5. "application_complete"   - Final conversion fires on thank-you page
 *
 * Page views are tracked automatically by the Rebrandly SDK snippet.
 */

(function () {
  "use strict";

  // Helper: safely call trackConversion if the SDK has loaded
  function track(eventName, revenue, currency, properties) {
    if (typeof trackConversion === "function") {
      var payload = { eventName: eventName };
      if (revenue != null) payload.revenue = revenue;
      if (currency) payload.currency = currency;
      if (properties) payload.properties = properties;
      trackConversion(payload);
    }
    console.log("[Rebrandly CT]", eventName, { revenue: revenue, currency: currency, properties: properties });
  }

  // -----------------------------------------------------------
  // 1. CTA Click tracking (all pages)
  //    Fires when a user clicks "Open an Account" or "Get a Quote"
  // -----------------------------------------------------------
  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href="signup.html"]');
    if (!link) return;

    var ctaText = link.textContent.trim();
    var page = window.location.pathname.split("/").pop() || "index.html";

    track("cta_click", null, null, {
      ctaText: ctaText,
      sourcePage: page,
    });
  });

  // -----------------------------------------------------------
  // 2. Rates page viewed (rates.html)
  //    High-intent signal — customer is comparison shopping
  // -----------------------------------------------------------
  if (window.location.pathname.includes("rates")) {
    track("rates_viewed", null, null, {
      referrer: document.referrer || "direct",
    });
  }

  // -----------------------------------------------------------
  // 3. Account type selected (signup.html)
  //    Fires when customer picks an account type
  // -----------------------------------------------------------
  var accountTypeSelect = document.getElementById("account-type");
  if (accountTypeSelect) {
    accountTypeSelect.addEventListener("change", function () {
      var accountType = accountTypeSelect.value;
      if (accountType) {
        track("account_type_selected", null, null, {
          accountType: accountType,
        });
      }
    });
  }

  // -----------------------------------------------------------
  // 4. Application submitted (signup.html)
  //    Fires on form submission with account type and details
  // -----------------------------------------------------------
  var signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var accountType = accountTypeSelect ? accountTypeSelect.value : "";
      var incomeSelect = document.getElementById("income");
      var employmentSelect = document.getElementById("employment");
      var incomeRange = incomeSelect ? incomeSelect.value : "";
      var employmentStatus = employmentSelect ? employmentSelect.value : "";

      track("application_submitted", null, null, {
        accountType: accountType,
        incomeRange: incomeRange,
        employmentStatus: employmentStatus,
      });

      // Navigate to thank-you page with account info
      window.location.href =
        "thank-you.html?account_type=" + encodeURIComponent(accountType) +
        "&income=" + encodeURIComponent(incomeRange);
    });
  }

  // -----------------------------------------------------------
  // 5. Application complete (thank-you.html)
  //    Final conversion event — customer acquisition attributed
  // -----------------------------------------------------------
  if (window.location.pathname.includes("thank-you")) {
    var params = new URLSearchParams(window.location.search);
    var accountType = params.get("account_type") || "";
    var incomeRange = params.get("income") || "";

    track("application_complete", 0, "USD", {
      accountType: accountType,
      incomeRange: incomeRange,
    });
  }
})();
