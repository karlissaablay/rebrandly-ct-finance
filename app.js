/**
 * VaultSecure Demo Site - Rebrandly Conversion Tracking Events
 *
 * Events tracked:
 * 1. "cta_click"          — User clicks any CTA leading to signup (all pages)
 * 2. "pricing_viewed"     — User lands on the pricing page (high-intent signal)
 * 3. "industry_selected"  — User changes the industry dropdown on the signup form
 * 4. "signup"             — User submits the signup form (signup.html)
 * 5. "purchase"           — Paid plan selected, fires on thank-you page with revenue
 *
 * Page views are tracked automatically by the Rebrandly SDK snippet.
 */

(function () {
  "use strict";

  var PLAN_PRICES = {
    starter: 0,
    business: 299.0,
    enterprise: 0,
  };

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
  //    Fires when a user clicks any primary CTA leading to signup
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
  // 2. Pricing page viewed (pricing.html)
  //    High-intent signal — user is evaluating plans
  // -----------------------------------------------------------
  if (window.location.pathname.includes("pricing")) {
    track("pricing_viewed", null, null, {
      referrer: document.referrer || "direct",
    });
  }

  // -----------------------------------------------------------
  // 3. Industry selected (signup.html)
  //    Fires when user changes the industry dropdown
  // -----------------------------------------------------------
  var industrySelect = document.getElementById("industry");
  if (industrySelect) {
    industrySelect.addEventListener("change", function () {
      var industry = industrySelect.value;
      track("industry_selected", null, null, {
        industry: industry,
      });
    });
  }

  // -----------------------------------------------------------
  // 4. Signup event (signup.html)
  //    Fires on form submission with plan and industry details
  // -----------------------------------------------------------
  var signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var planSelect = document.getElementById("plan");
      var plan = planSelect ? planSelect.value : "business";
      var industry = industrySelect ? industrySelect.value : "";
      var company = document.getElementById("company").value;

      track("signup", null, null, {
        plan: plan,
        industry: industry,
        company: company,
      });

      // Navigate to thank-you page with plan info
      window.location.href = "thank-you.html?plan=" + encodeURIComponent(plan);
    });
  }

  // -----------------------------------------------------------
  // 5. Purchase event (thank-you.html)
  //    Fires for paid plans with revenue attribution
  // -----------------------------------------------------------
  if (window.location.pathname.includes("thank-you")) {
    var params = new URLSearchParams(window.location.search);
    var plan = params.get("plan");

    if (plan && plan !== "starter") {
      var revenue = PLAN_PRICES[plan] || 299.0;

      track("purchase", revenue, "USD", {
        plan: plan,
        billingCycle: "monthly",
      });
    }
  }
})();
